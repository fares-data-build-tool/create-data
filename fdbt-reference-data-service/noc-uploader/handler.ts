import { Handler } from 'aws-lambda';
import AWS from 'aws-sdk';

async function fetchDataFromS3AsString(bucketName: string, eventKey: string): Promise<string> {
    const s3 = new AWS.S3();
    try {
        const data = await s3.getObject({
            Bucket: bucketName,
            Key: eventKey
        }).promise();

        const dataAsString = data.Body?.toString('utf-8')!;

        console.log(dataAsString);

        return dataAsString;

    } catch (err) {
        throw new Error("Internal error - omething went wrong with the data collection.");
    }
}

function csvToJsonParse(csvData: string){
    let csv = csvData;
    let json;

    return json;
}

export const s3hook: Handler = async (event: any) => {

    // Could pass in dynamodb connection string here (localhost / )
    const { TNDS_CSV_TABLE = "", TNDS_XML_TABLE = "", IS_OFFLINE = "" } = process.env;
    const eventKey = event.Records[0].s3.object.key;
    const bucketName = event.Records[0].s3.bucket.name;
    let parsedS3Data = null;

    const filePath = JSON.stringify(eventKey);

    const stringifiedS3Data = await fetchDataFromS3AsString(bucketName, filePath);

    const table = 

    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: table,
        Key: eventKey,
        UpdateExpression: 'DYNAMO-DB QUERY',
        ExpressionAttributeNames: { 'DYNAMO-DB QUERY VALUES ATTRIBUTES': 'values' },
        ExpressionAttributeValues: { 'DYNAMO-DB QUERY VALUES': 'values' }  
    };

    const result = await dynamoDb.update(params, (error) => {
        if (error) {
            console.log(`Error updating table ${table}`, error);
        }
    }).promise();
}
