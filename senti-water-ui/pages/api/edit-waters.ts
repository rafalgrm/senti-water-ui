import type { NextApiRequest, NextApiResponse } from 'next'
const { CloudantV1 } = require('@ibm-cloud/cloudant');

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const service = CloudantV1.newInstance({
        serviceName: "CLOUDANT_SENTI"
    });

    const id = req.query.id
    const name = typeof req.query.name === 'string' ? req.query.name : ""
    const description = typeof req.query.description === 'string' ? req.query.description : ""

    if (id) {
        service.getDocument({
            db: 'senti-water-polygons-2',
            docId: id
        }).then((response) => {
            console.log("found")
            const documentToEdit = response.result
            const editedDocument = {
                ...documentToEdit,
                properties: {
                    ...documentToEdit.properties,
                    name: name,
                    description: description,
                }
            }
            service.postDocument({
                db: 'senti-water-polygons-2',
                document: editedDocument,
            }).then((response: any) => {
                console.log(response)
                res.status(200).send(response.result)
            })
        });
    }
}
