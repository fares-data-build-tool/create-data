import { Handler } from 'aws-lambda';
import AWS from 'aws-sdk';
import express from 'express';

const { IS_OFFLINE } = process.env;
const app = express();

const dynamoDb = IS_OFFLINE === 'true' ?
    new AWS.DynamoDB.DocumentClient({
        region: '',
        endpoint: '',
    }) :
    new AWS.DynamoDB.DocumentClient();











// this is the code that gets hit when the s3 event (object created) happens
export const s3hook: Handler = async (event: any) => {

    const s3 = new AWS.S3();

    // HEAD the bucket and see if it exists and we have permissions to access
    try {
        const head = await s3.headObject({
            Bucket: event.Records[0].s3.bucket.name,
            Key: event.Records[0].s3.object.key
        }).promise();

    } catch (err) {
        return {
            statusCode: err.statusCode || 400,
            body: err.message || JSON.stringify(err.message)
        }
    }

    try {
        const data = await s3.getObject({
            Bucket: event.Records[0].s3.bucket.name,
            Key: event.Record[0].s3.object.key
        }).promise();

        console.log(data);

        return {
            statusCode: 201,
            body: JSON.stringify(data)
        }
    } catch (err) {
        return {
            statusCode: err.statusCode || 400,
            body: err.message || JSON.stringify(err.message)
        }
    }

};