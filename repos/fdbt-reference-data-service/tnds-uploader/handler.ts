import bodyParser from 'body-parser';
import { Handler } from 'aws-lambda';
import AWS from 'aws-sdk';
import express from 'express';

// this is the code that gets hit when the s3 event (object created) happens
export const s3hook: Handler = async (event: any) => {

    const s3 = new AWS.S3();
    const tndsCsvTableName = "";
    const tndsXmlTableName = "";
    const eventKey = event.Records[0].s3.object.key;
    const bucketName = event.Records[0].s3.bucket.name;

    // HEAD the bucket and see if it exists and we have permissions to access
    try {
        const head = await s3.headObject({
            Bucket: bucketName,
            Key: eventKey
        }).promise();

    } catch (err) {
        return {
            statusCode: err.statusCode || 400,
            body: err.message || JSON.stringify(err.message)
        }
    }

    try {
        const data = await s3.getObject({
            Bucket: bucketName,
            Key: eventKey
        }).promise();

        console.log(JSON.stringify(data));

    } catch (err) {
        return {
            statusCode: err.statusCode || 400,
            body: err.message || JSON.stringify(err.message)
        }
    }

    const filename = JSON.stringify(eventKey);
    const fileExtension = filename.split('.').pop();

    let table = "";

    if (fileExtension === "csv") {

        table = tndsCsvTableName;

    } else if (fileExtension === "xml") {

        table = tndsXmlTableName;

    } else {
        console.log("File is not of a supported format type.")
    }

    if (table === tndsCsvTableName) {

        const { TNDS_CSV_TABLE, IS_OFFLINE } = process.env;
        const app = express();

        const dynamoDb = (IS_OFFLINE === 'true') ?
            new AWS.DynamoDB.DocumentClient({
                region: 'localhost',
                endpoint: '',
            }) :
            new AWS.DynamoDB.DocumentClient();

        app.use(bodyParser.json({ strict: false }));

        app.put('/' + tndsCsvTableName, (req, res) => {

            const { tndsCsvId, Columns } = req.body;

            const params = {
                TableName: tndsCsvTableName,
                Key: eventKey,
                UpdateExpression: 'DYNAMO-DB QUERY',
                ExpressionAttributeNames: { 'DYNAMO-DB QUERY VALUES ATTRIBUTES': 'values' },
                ExpressionAttributeValues: { 'DYNAMO-DB QUERY VALUES': 'values' },
            };

            dynamoDb.update(params, (error) => {
                if (error) {
                    console.log(`Error updating table with id ${tndsCsvId}: `, error);
                    res.status(400).json({ error: 'Could not update table' });
                }

                res.json({ tndsCsvId, Columns });

            })

        });
    } else if (table === tndsXmlTableName) {

        //same as above but xml version

        return null;

    }
}

