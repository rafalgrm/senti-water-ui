const { CloudantV1 } = require('@ibm-cloud/cloudant');

interface waterJsonType {
    doc: {
        type: string,
        properties: { idx: string },
        geometry: { coordinates: number[] }
    }
}

const shapeWaters = (waterJson: waterJsonType) => ({
    index: waterJson?.doc?.properties?.idx,
    coords: waterJson?.doc?.geometry?.coordinates,
});

export async function loadWaters() {

    const service = CloudantV1.newInstance({
        serviceName: "CLOUDANT_SENTI"
    });

    const result = await service.postAllDocs({
        db: 'senti-water-points',
        includeDocs: true,
        limit: 20
    }).then((response: any) => {
        return response.result
    });

    return result.rows.filter((row: waterJsonType) => row?.doc?.type === "Feature").map(shapeWaters);
  }
  