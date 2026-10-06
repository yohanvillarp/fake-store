import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDbPool, getMockDb, INITIAL_PRODUCTS } from './_lib/db.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS'])
    return res.status(405).json({ success: false, error: 'Method Not Allowed' })
  }

  const { confirm } = (req.body || {}) as { confirm?: boolean }
  if (!confirm) {
    return res.status(400).json({
      success: false,
      error: 'Confirmation required to reset demo data. Send { confirm: true } in body.',
    })
  }

  const pool = getDbPool()

  if (pool) {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Clear orders and related items & payments via cascading delete
      await client.query('DELETE FROM fake_store_orders WHERE source = $1', ['fake_store'])

      // Reset product stock to initial values
      for (const p of INITIAL_PRODUCTS) {
        await client.query(
          `UPDATE fake_store_products 
           SET stock = $1, price = $2, updated_at = CURRENT_TIMESTAMP 
           WHERE product_id = $3`,
          [p.stock, p.price, p.product_id],
        )
      }

      await client.query('COMMIT')

      return res.status(200).json({
        success: true,
        message: 'PostgreSQL Fake Store orders cleared and inventory restored to initial stock.',
        database: 'postgresql',
      })
    } catch (err) {
      await client.query('ROLLBACK')
      return res.status(500).json({
        success: false,
        error: err instanceof Error ? err.message : 'Database error',
      })
    } finally {
      client.release()
    }
  }

  // Fallback in-memory reset
  const mockDb = getMockDb()
  mockDb.orders.length = 0
  global.__mock_products_db__ = JSON.parse(JSON.stringify(INITIAL_PRODUCTS))

  return res.status(200).json({
    success: true,
    message: 'Local memory orders cleared and inventory restored to initial stock.',
    database: 'local_memory',
  })
}
