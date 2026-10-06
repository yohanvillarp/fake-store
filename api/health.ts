import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDbPool, isDbConfigured } from './_lib/db'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (!isDbConfigured()) {
    return res.status(200).json({
      status: 'ok',
      database: 'local_memory',
      message: 'Running in local fallback mode. Connect DATABASE_URL for PostgreSQL.',
    })
  }

  const pool = getDbPool()
  if (!pool) {
    return res.status(200).json({
      status: 'ok',
      database: 'disconnected',
    })
  }

  try {
    const check = await pool.query('SELECT 1 AS alive')
    return res.status(200).json({
      status: 'ok',
      database: check.rows[0]?.alive === 1 ? 'connected' : 'unknown',
      provider: 'postgresql',
    })
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      database: 'error',
      error: err instanceof Error ? err.message : 'Database error',
    })
  }
}
