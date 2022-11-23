import osmsm from 'osm-static-maps'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const x = typeof req.query.x === 'string' ? parseFloat(req.query.x) : req.query.x
    const y = typeof req.query.y === 'string' ? parseFloat(req.query.y) : req.query.y
    const imageBinaryBuffer = await osmsm({geojson: {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [x, y],
        },
    }, zoom: 8.5 })
    res.status(200).send(imageBinaryBuffer)
}
