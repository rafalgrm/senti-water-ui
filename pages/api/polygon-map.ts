import osmsm from 'osm-static-maps'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const polygon = req.body.polygon
    const imageBinaryBuffer = await osmsm({geojson: {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [polygon.map((point: any) => [point[0].toString(), point[1].toString()])],
        },
    }, zoom: 13.0 })
    res.status(200).send(imageBinaryBuffer)
}
