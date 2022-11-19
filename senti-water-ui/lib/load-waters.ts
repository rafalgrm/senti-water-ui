const { CloudantV1 } = require('@ibm-cloud/cloudant');

interface waterJsonType {
    doc: {
        _id: string,
        _rev: string,
        type: string,
        features: [
            {
                type: string,
                geometry: {
                    type: string,
                    coordinates: number[]
                }
            },
            {
                type: string,
                geometry: {
                    type: string,
                    coordinates: number[]
                }
            }
        ],
        properties: { 
            idx: number,
            area: number
        }
    }
}

const shapeWaters = (waterJson: waterJsonType) => ({
    index: waterJson?.doc?.properties?.idx,
    area: waterJson?.doc?.properties?.area,
    centroid_coords: waterJson?.doc?.features?.[0]?.geometry?.coordinates,
    polygon_coords: waterJson?.doc?.features?.[1]?.geometry?.coordinates
});

function goodId(id: string) {
    if (id.length > 5) return id.slice(0, 5) === "test_"
    return false
}

export async function loadWaters(limit: number, page: number) {

    const service = CloudantV1.newInstance({
        serviceName: "CLOUDANT_SENTI"
    });

    const result = await service.postAllDocs({
        db: 'senti-water-polygons',
        includeDocs: true,
        limit: limit,
        skip: page * limit,
    }).then((response: any) => {
        console.log(response.result)
        return response.result
    });

    //filter((row: waterJsonType) => row?.doc?.type === "FeatureCollection" && goodId(row?.doc?._id)
    return { waters: result.rows.map(shapeWaters), total: result.total_rows };
}
  