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
            name: string,
            description: string,
            area: number,
            timestamp: string,
            dataset_id: string,
        }
    }
}

const shapeWaters = (waterJson: waterJsonType) => ({
    index: waterJson?.doc?._id,
    name: waterJson?.doc?.properties?.name,
    description: waterJson?.doc?.properties?.description,
    area: waterJson?.doc?.properties?.area,
    timestamp: waterJson?.doc?.properties?.timestamp,
    dataset_id: waterJson?.doc?.properties?.dataset_id,
    centroid_coords: waterJson?.doc?.features?.[0]?.geometry?.coordinates,
    polygon_coords: waterJson?.doc?.features?.[1]?.geometry?.coordinates
});

function goodId(id: string) {
    return id !== "_design/design_doc"
}

export async function loadWaters(limit: number, page: number) {

    const service = CloudantV1.newInstance({
        serviceName: "CLOUDANT_SENTI"
    });

    const result = await service.postAllDocs({
        db: 'senti-water-polygons-2',
        includeDocs: true,
        limit: limit + 5,
        skip: (page-1) * limit,
    }).then((response: any) => {
        console.log(response)
        return response.result
    });

    const waters = result.rows.filter((row: any) => goodId(row?.doc?._id)).map(shapeWaters).slice(0, limit)

    return {
        waters: waters,
        total: result.total_rows
    };
}
  