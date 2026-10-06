import type { VercelRequest, VercelResponse } from '@vercel/node'
import productsHandler from '../products'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return productsHandler(req, res)
}
