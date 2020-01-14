import { Handler } from 'aws-lambda';
import AWS from 'aws-sdk';
import CsvToJson from 'csvtojson'; 

const s3 = new AWS.S3();

export const s3hook: Handler = async (event: any) => {


    const eventKey = event.Records[0].s3.object.key;

    const bucketName = event.Records[0].s3.bucket.name;

    const params = {
        Bucket: bucketName,
        Key : eventKey
     }; 

    const filePath = JSON.stringify(eventKey);


    const stringifiedS3Data = await fetchDataFromS3AsString(bucketName, filePath);


    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const dynamodbparams: AWS.DynamoDB.DocumentClient.PutItemInput = {
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

async function getListOfS3ObjectKeys () {

    const s3 = new AWS.S3();

    const params = {
        Bucket: 'fdbt_test_ref_data'
    };

    const objectsData = s3.listObjects(params);

    let keysList = [];

    for (var o in objectsData) {
        keysList.push(Contents.Key);
    };

    const objectKey1 = keysList[0];
    const objectKey2 = keysList[1];
    const objectKey3 = keysList[2];
       
};

function fetchDataFromS3AsString(bucketName: string, eventKey: string): Promise<string> {
    const s3 = new AWS.S3();
    try {
        const s3Stream = s3.getObject({
            Bucket: bucketName,
            Key: eventKey
        }).createReadStream();

        CsvToJson().fromStream(s3Stream).on('data', (row) =>
            let jsonContent = JSON.parse(row);
            console.log(JSON.stringify(jsonContent));

        const dataAsString = data.Body?.toString('utf-8')!;

        console.log(dataAsString);

        return dataAsString;

    } catch (err) {
        console.error(`Internal error - something went wrong with the data collection: (${err})`);
        throw new Error(`Internal error :${err}`);
    }
}

function csvToJsonParse(csvData: string){
    let csv = csvData;
    let json;

    return json;
}