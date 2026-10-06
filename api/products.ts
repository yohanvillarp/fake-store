import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ensureDbBootstrapped, getDbPool, getMockDb } from './_lib/db'

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  )
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'OPTIONS'])
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` })
  }

  const pool = getDbPool()
  const productId = req.query.id as string | undefined

  // PostgreSQL Mode
  if (pool) {
    try {
      await ensureDbBootstrapped(pool)

      if (productId) {
        const result = await pool.query(
          `SELECT 
             product_id,
             display_name,
             category_name,
             price::float,
             stock,
             weight_g,
             length_cm,
             height_cm,
             width_cm,
             source
           FROM fake_store_products
           WHERE product_id = $1`,
          [productId],
        )

        if (result.rowCount === 0) {
          return res.status(404).json({ success: false, error: 'Product not found' })
        }

        return res.status(200).json({ success: true, product: result.rows[0] })
      }

      const result = await pool.query(
        `SELECT 
           product_id,
           display_name,
           category_name,
           price::float,
           stock,
           weight_g,
           length_cm,
           height_cm,
           width_cm,
           source
         FROM fake_store_products
         ORDER BY display_name ASC`,
      )

      return res.status(200).json({
        success: true,
        count: result.rowCount,
        products: result.rows,
        database: 'postgresql',
      })
    } catch (err) {
      console.error('[API /api/products] DB Error:', err)
      return res.status(500).json({
        success: false,
        error: err instanceof Error ? err.message : 'Database error',
      })
    }
  }

  // Local In-Memory Fallback Mode
  const mockDb = getMockDb()

  if (productId) {
    const product = mockDb.products.find((p) => p.product_id === productId)
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' })
    }
    return res.status(200).json({ success: true, product })
  }

  return res.status(200).json({
    success: true,
    count: mockDb.products.length,
    products: mockDb.products,
    database: 'local_memory',
  })
}
