const { IamAuthenticator } = require('ibm-cloud-sdk-core');
const { CloudantV1 } = require('@ibm-cloud/cloudant');

// interface waterJsonType {
//     doc: {
//         type: string,
//         properties: { idx: string },
//         geometry: { coordinates: number[] }
//     }
// }

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

// const shapeWaters = (waterJson: waterJsonType) => ({
//     index: waterJson?.doc?.properties?.idx,
//     coords: waterJson?.doc?.geometry?.coordinates,
// });

const shapeWaters = (waterJson: waterJsonType) => ({
    index: waterJson?.doc?.properties?.idx,
    area: waterJson?.doc?.properties?.area,
    centroid_coords: waterJson?.doc?.features[0]?.geometry?.coordinates,
    polygon_coords: waterJson?.doc?.features[1]?.geometry?.coordinates
});

function goodId(id: string) {
    if (id.length > 5) return id.slice(0, 5) === "test_"
    return false
}

export async function loadWaters() {

    // const service = CloudantV1.newInstance({
    //     serviceName: "CLOUDANT_SENTI"
    // });

    const authenticator = new IamAuthenticator({
        apikey: ''
    });

    const service = new CloudantV1({
        authenticator: authenticator
    });

    service.setServiceUrl('');

    const result = await service.postAllDocs({
        db: 'senti-water-polygons',
        includeDocs: true,
        limit: 1000000
    }).then((response: any) => {
        return response.result
    });

    // console.log('aaa');
    // console.log(result.rows);
    console.log(result.rows[0].doc.features[0].geometry);
    // console.log(result.rows[0].doc.features[1].geometry);
    // console.log(result.rows[0].doc);
    
    return result.rows.filter((row: waterJsonType) => row?.doc?.type === "FeatureCollection" && goodId(row?.doc?._id)).map(shapeWaters);
}
  