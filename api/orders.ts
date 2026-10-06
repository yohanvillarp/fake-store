import type { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'node:crypto'
import { ensureDbBootstrapped, getDbPool, getMockDb } from './_lib/db'
import type {
  CreateOrderPayload,
  CustomerRecord,
  OrderItemRecord,
  OrderRecord,
  PaymentRecord,
} from './_lib/types'

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  )
}

function calculateDeterministicFreight(subtotal: number, itemsCount: number): number {
  if (itemsCount === 0 || subtotal <= 0) return 0
  // Standard simulated Brazilian freight baseline: R$ 15.00 base + R$ 3.90 per item
  const freight = 15.0 + (itemsCount - 1) * 3.9
  return Number(freight.toFixed(2))
}

function generateOrderCode(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  return `FS-2026-${randomSuffix}`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const pool = getDbPool()

  // ---------------------------------------------------------------------------
  // GET: List orders or retrieve single order detail
  // ---------------------------------------------------------------------------
  if (req.method === 'GET') {
    const orderId = req.query.id as string | undefined

    if (pool) {
      try {
        await ensureDbBootstrapped(pool)

        if (orderId) {
          // Fetch single detailed order
          const orderRes = await pool.query(
            `SELECT o.*, 
                    c.first_name, c.last_name, c.email, c.country, c.state, c.city, c.zip_code
             FROM fake_store_orders o
             JOIN fake_store_customers c ON o.customer_id = c.customer_id
             WHERE o.order_id = $1 OR o.order_code = $1`,
            [orderId],
          )

          if (orderRes.rowCount === 0) {
            return res.status(404).json({ success: false, error: 'Order not found' })
          }

          const orderRow = orderRes.rows[0]
          const resolvedOrderId = orderRow.order_id

          const itemsRes = await pool.query(
            `SELECT i.*, p.display_name, p.category_name 
             FROM fake_store_order_items i
             JOIN fake_store_products p ON i.product_id = p.product_id
             WHERE i.order_id = $1
             ORDER BY i.order_item_id ASC`,
            [resolvedOrderId],
          )

          const paymentsRes = await pool.query(
            `SELECT * FROM fake_store_payments 
             WHERE order_id = $1
             ORDER BY payment_sequential ASC`,
            [resolvedOrderId],
          )

          return res.status(200).json({
            success: true,
            order: {
              order_id: orderRow.order_id,
              order_code: orderRow.order_code,
              customer_id: orderRow.customer_id,
              order_status: orderRow.order_status,
              order_purchase_timestamp: orderRow.order_purchase_timestamp,
              order_approved_at: orderRow.order_approved_at,
              freight_value: Number(orderRow.freight_value),
              subtotal: Number(orderRow.subtotal),
              total: Number(orderRow.total),
              source: orderRow.source,
              customer: {
                customer_id: orderRow.customer_id,
                first_name: orderRow.first_name,
                last_name: orderRow.last_name,
                email: orderRow.email,
                country: orderRow.country,
                state: orderRow.state,
                city: orderRow.city,
                zip_code: orderRow.zip_code,
                source: 'fake_store',
              },
              items: itemsRes.rows.map((row) => ({
                id: row.id,
                order_id: row.order_id,
                order_item_id: row.order_item_id,
                product_id: row.product_id,
                display_name: row.display_name,
                category_name: row.category_name,
                quantity: row.quantity,
                unit_price: Number(row.unit_price),
                freight_value: Number(row.freight_value),
              })),
              payments: paymentsRes.rows.map((row) => ({
                id: row.id,
                order_id: row.order_id,
                payment_sequential: row.payment_sequential,
                payment_type: row.payment_type,
                payment_installments: row.payment_installments,
                payment_value: Number(row.payment_value),
              })),
            },
          })
        }

        // List all orders summary
        const limit = Math.min(Number(req.query.limit) || 50, 100)
        const listRes = await pool.query(
          `SELECT 
             o.order_id,
             o.order_code,
             o.order_status,
             o.order_purchase_timestamp,
             o.freight_value::float,
             o.subtotal::float,
             o.total::float,
             o.source,
             c.first_name || ' ' || c.last_name AS customer_name,
             c.city,
             c.state,
             COUNT(DISTINCT i.id)::int AS items_count,
             COALESCE(SUM(i.quantity), 0)::int AS total_units,
             STRING_AGG(DISTINCT p.payment_type, ', ') AS payment_type
           FROM fake_store_orders o
           JOIN fake_store_customers c ON o.customer_id = c.customer_id
           LEFT JOIN fake_store_order_items i ON o.order_id = i.order_id
           LEFT JOIN fake_store_payments p ON o.order_id = p.order_id
           GROUP BY o.order_id, c.customer_id
           ORDER BY o.order_purchase_timestamp DESC
           LIMIT $1`,
          [limit],
        )

        return res.status(200).json({
          success: true,
          count: listRes.rowCount,
          orders: listRes.rows,
          database: 'postgresql',
        })
      } catch (err) {
        console.error('[API /api/orders GET] Error:', err)
        return res.status(500).json({
          success: false,
          error: err instanceof Error ? err.message : 'Database error',
        })
      }
    }

    // Local in-memory fallback
    const mockDb = getMockDb()
    if (orderId) {
      const found = mockDb.orders.find((o) => o.order_id === orderId || o.order_code === orderId)
      if (!found) {
        return res.status(404).json({ success: false, error: 'Order not found' })
      }
      return res.status(200).json({ success: true, order: found })
    }

    return res.status(200).json({
      success: true,
      count: mockDb.orders.length,
      orders: mockDb.orders,
      database: 'local_memory',
    })
  }

  // ---------------------------------------------------------------------------
  // POST: Create new order using atomic SQL transaction
  // ---------------------------------------------------------------------------
  if (req.method === 'POST') {
    const payload = req.body as CreateOrderPayload

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid request body.' })
    }

    const { customer, items, payment } = payload

    if (!customer?.first_name || !customer?.last_name || !customer?.email) {
      return res.status(400).json({
        success: false,
        error: 'Customer information (first name, last name, email) is required.',
      })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order must contain at least one item.',
      })
    }

    if (!payment?.payment_type) {
      return res.status(400).json({
        success: false,
        error: 'Payment type is required.',
      })
    }

    // =========================================================================
    // PostgreSQL Transaction Path
    // =========================================================================
    if (pool) {
      await ensureDbBootstrapped(pool)
      const client = await pool.connect()

      try {
        await client.query('BEGIN')

        // 1. Fetch & Lock Product Rows for Update to ensure atomic inventory check
        const productIds = items.map((i) => i.product_id)
        const productsQuery = await client.query(
          `SELECT product_id, display_name, category_name, price, stock 
           FROM fake_store_products 
           WHERE product_id = ANY($1) 
           FOR UPDATE`,
          [productIds],
        )

        const productsMap = new Map<string, any>()
        for (const p of productsQuery.rows) {
          productsMap.set(p.product_id, p)
        }

        // 2. Validate stock and recalculate subtotal on server (NEVER trust frontend prices!)
        let calculatedSubtotal = 0
        const validatedItems: {
          product_id: string
          quantity: number
          unit_price: number
          freight_value: number
          display_name: string
          category_name: string
        }[] = []

        let totalUnitsCount = 0

        for (const item of items) {
          const qty = Number(item.quantity)
          if (!qty || qty <= 0) {
            throw new Error(`Invalid quantity for product ${item.product_id}.`)
          }

          const product = productsMap.get(item.product_id)
          if (!product) {
            throw new Error(`Product with ID ${item.product_id} was not found.`)
          }

          if (qty > 5) {
            throw new Error(`Límite de 5 unidades por persona excedido para "${product.display_name}".`)
          }



          if (product.stock < qty) {
            throw new Error(
              `Product "${product.display_name}" has insufficient stock. Available: ${product.stock}, requested: ${qty}.`,
            )
          }

          const unitPrice = Number(product.price)
          calculatedSubtotal += unitPrice * qty
          totalUnitsCount += qty

          validatedItems.push({
            product_id: item.product_id,
            quantity: qty,
            unit_price: unitPrice,
            freight_value: 0, // Will distribute freight
            display_name: product.display_name,
            category_name: product.category_name,
          })
        }

        calculatedSubtotal = Number(calculatedSubtotal.toFixed(2))
        const calculatedFreight = calculateDeterministicFreight(
          calculatedSubtotal,
          validatedItems.length,
        )
        const calculatedTotal = Number((calculatedSubtotal + calculatedFreight).toFixed(2))

        // Distribute freight evenly among items
        const itemFreightShare = Number(
          (calculatedFreight / Math.max(1, validatedItems.length)).toFixed(2),
        )
        validatedItems.forEach((vi) => {
          vi.freight_value = itemFreightShare
        })

        // 3. Upsert Customer Record
        const customerId = customer.customer_id || `CUST-${crypto.randomUUID().slice(0, 8)}`
        const customerUpsertQuery = `
          INSERT INTO fake_store_customers (
            customer_id, first_name, last_name, email, country, state, city, zip_code, source
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'fake_store')
          ON CONFLICT (customer_id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            state = EXCLUDED.state,
            city = EXCLUDED.city,
            zip_code = EXCLUDED.zip_code
          RETURNING *
        `
        const customerRes = await client.query(customerUpsertQuery, [
          customerId,
          customer.first_name.trim(),
          customer.last_name.trim(),
          customer.email.trim().toLowerCase(),
          customer.country || 'Brazil',
          customer.state || 'SP',
          customer.city || 'São Paulo',
          customer.zip_code || '01001-000',
        ])
        const savedCustomer: CustomerRecord = customerRes.rows[0]

        // 4. Create Order Record
        const orderId = crypto.randomUUID()
        const orderCode = generateOrderCode()
        const orderPurchaseTimestamp = new Date()
        const orderApprovedAt = new Date(orderPurchaseTimestamp.getTime() + 1000)

        const orderInsertQuery = `
          INSERT INTO fake_store_orders (
            order_id, order_code, customer_id, order_status, order_purchase_timestamp,
            order_approved_at, freight_value, subtotal, total, source
          ) VALUES ($1, $2, $3, 'completed', $4, $5, $6, $7, $8, 'fake_store')
          RETURNING *
        `
        const orderRes = await client.query(orderInsertQuery, [
          orderId,
          orderCode,
          savedCustomer.customer_id,
          orderPurchaseTimestamp,
          orderApprovedAt,
          calculatedFreight,
          calculatedSubtotal,
          calculatedTotal,
        ])
        const savedOrder: OrderRecord = orderRes.rows[0]

        // 5. Create Order Items & Decrement Inventory atomically
        const savedItems: OrderItemRecord[] = []
        let itemSequence = 1

        for (const item of validatedItems) {
          const itemInsertQuery = `
            INSERT INTO fake_store_order_items (
              order_id, order_item_id, product_id, quantity, unit_price, freight_value
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
          `
          const itemRes = await client.query(itemInsertQuery, [
            orderId,
            itemSequence++,
            item.product_id,
            item.quantity,
            item.unit_price,
            item.freight_value,
          ])

          savedItems.push({
            ...itemRes.rows[0],
            display_name: item.display_name,
            category_name: item.category_name,
          })

          // Decrement stock in database atomically
          await client.query(
            `UPDATE fake_store_products 
             SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP
             WHERE product_id = $2`,
            [item.quantity, item.product_id],
          )
        }

        // 6. Create Payment Record
        const paymentInstallments = Math.max(1, Number(payment.payment_installments) || 1)
        const paymentInsertQuery = `
          INSERT INTO fake_store_payments (
            order_id, payment_sequential, payment_type, payment_installments, payment_value
          ) VALUES ($1, 1, $2, $3, $4)
          RETURNING *
        `
        const paymentRes = await client.query(paymentInsertQuery, [
          orderId,
          payment.payment_type,
          paymentInstallments,
          calculatedTotal,
        ])
        const savedPayment: PaymentRecord = paymentRes.rows[0]

        // Commit SQL Transaction
        await client.query('COMMIT')

        return res.status(201).json({
          success: true,
          order: {
            order_id: savedOrder.order_id,
            order_code: savedOrder.order_code,
            customer_id: savedOrder.customer_id,
            order_status: savedOrder.order_status,
            order_purchase_timestamp: savedOrder.order_purchase_timestamp,
            order_approved_at: savedOrder.order_approved_at,
            freight_value: Number(savedOrder.freight_value),
            subtotal: Number(savedOrder.subtotal),
            total: Number(savedOrder.total),
            source: savedOrder.source,
            customer: savedCustomer,
            items: savedItems,
            payments: [savedPayment],
          },
          database: 'postgresql',
        })
      } catch (transactionError) {
        await client.query('ROLLBACK')
        console.error('[API /api/orders POST] Transaction rolled back:', transactionError)
        return res.status(400).json({
          success: false,
          error:
            transactionError instanceof Error
              ? transactionError.message
              : 'Transaction failed and was rolled back.',
        })
      } finally {
        client.release()
      }
    }

    // =========================================================================
    // Local In-Memory Fallback Path (for offline development without DATABASE_URL)
    // =========================================================================
    const mockDb = getMockDb()
    let calculatedSubtotal = 0
    const validatedItems = []

    for (const item of items) {
      const prod = mockDb.products.find((p) => p.product_id === item.product_id)
      if (!prod) {
        return res
          .status(400)
          .json({ success: false, error: `Product ${item.product_id} not found.` })
      }
      if (item.quantity > 5) {
        return res.status(400).json({
          success: false,
          error: `Límite de 5 unidades por persona excedido para "${prod.display_name}".`,
        })
      }
      if (prod.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for "${prod.display_name}". Available: ${prod.stock}`,
        })
      }
      calculatedSubtotal += prod.price * item.quantity
      validatedItems.push({
        ...prod,
        quantity: item.quantity,
      })
    }

    calculatedSubtotal = Number(calculatedSubtotal.toFixed(2))
    const calculatedFreight = calculateDeterministicFreight(calculatedSubtotal, items.length)
    const calculatedTotal = Number((calculatedSubtotal + calculatedFreight).toFixed(2))

    // Decrement stock in memory
    for (const vi of validatedItems) {
      const p = mockDb.products.find((x) => x.product_id === vi.product_id)
      if (p) p.stock -= vi.quantity
    }

    const orderId = crypto.randomUUID()
    const orderCode = generateOrderCode()
    const timestamp = new Date().toISOString()

    const newOrder = {
      order_id: orderId,
      order_code: orderCode,
      customer_id: customer.customer_id || `CUST-${crypto.randomUUID().slice(0, 8)}`,
      order_status: 'completed',
      order_purchase_timestamp: timestamp,
      order_approved_at: timestamp,
      freight_value: calculatedFreight,
      subtotal: calculatedSubtotal,
      total: calculatedTotal,
      source: 'fake_store',
      customer: {
        customer_id: customer.customer_id || `CUST-${crypto.randomUUID().slice(0, 8)}`,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        country: customer.country || 'Brazil',
        state: customer.state || 'SP',
        city: customer.city || 'São Paulo',
        zip_code: customer.zip_code || '01001-000',
        source: 'fake_store',
      },
      items: validatedItems.map((vi, idx) => ({
        id: idx + 1,
        order_id: orderId,
        order_item_id: idx + 1,
        product_id: vi.product_id,
        display_name: vi.display_name,
        category_name: vi.category_name,
        quantity: vi.quantity,
        unit_price: vi.price,
        freight_value: Number((calculatedFreight / validatedItems.length).toFixed(2)),
      })),
      payments: [
        {
          id: 1,
          order_id: orderId,
          payment_sequential: 1,
          payment_type: payment.payment_type,
          payment_installments: payment.payment_installments || 1,
          payment_value: calculatedTotal,
        },
      ],
    }

    mockDb.orders.unshift(newOrder)

    return res.status(201).json({
      success: true,
      order: newOrder,
      database: 'local_memory',
    })
  }

  res.setHeader('Allow', ['GET', 'POST', 'OPTIONS'])
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` })
}
