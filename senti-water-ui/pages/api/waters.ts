import type { NextApiRequest, NextApiResponse } from 'next'
import { loadWaters } from '../../lib/load-waters'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
  const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : 10
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page): 0
  const waters = await loadWaters(limit, page)
  res.status(200).send(waters)
}
