import type { VercelRequest, VercelResponse } from '@vercel/node'
import ordersHandler from '../orders'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return ordersHandler(req, res)
}
