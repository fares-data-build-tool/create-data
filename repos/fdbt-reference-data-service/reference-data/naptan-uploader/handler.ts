import { Handler, Context, Callback } from 'aws-lambda';
import AWS from 'aws-sdk';

interface s3ObjectParameters {
    Bucket: string,
    Key: string
}

interface dynamoDBParamsToPush {
    TableName: string,
    Item: dynamoDBData
}

interface dynamoDBData {
    ATCOCode: number,
    NaptanCode: string,
    CommonName: string,
    Street: string,
    Indicator: string,
    IndicatorLang: string,
    Bearing: string,
    NptgLocalityCode: string,
    LocalityName: string,
    ParentLocalityName: string,
    LocalityCentre: number,
    GridType: string,
    Easting: number,
    Northing: number,
    Longitude: number,
    Latitude: number,
    StopType: string,
    BusStopType: string,
    TimingStatus: string
}

async function fetchDataFromS3(parameters: s3ObjectParameters) {
    const s3 = new AWS.S3();
    try {
        const s3object = await s3.getObject(parameters, function (err, data) {
            if (err) {
                console.error("Unable to retrieve S3 object: ", err)
            } else {
                console.log("S3 object retrieved: ", data)
            }
        }).promise();
        
         const dataAsString = s3object.Body?.toString('utf-8')!;
         console.log("dataAsString is: ", dataAsString);
         return dataAsString;
        
    } catch (err) {
        console.error(`Internal error - something went wrong with the data collection: (${err})`);
        throw new Error(`Internal error :${err}`);
    }
}

// async function pushDataToDynamoDB(data: any) {
//     const dynamodb = new AWS.DynamoDB();
// }

export const s3hook: Handler = (event:any, context: Context, callback: Callback) => {
    const s3BucketName: string = event.Records[0].s3.bucket.name;
    const s3FileName: string = event.Records[0].s3.object.key; // Object key may have spaces or unicode non-ASCII characters
    const params: s3ObjectParameters = {Bucket: s3BucketName, Key: s3FileName};
    console.log("s3BucketName is: ", s3BucketName);
    console.log("s3FileName is: ", s3FileName);
    const s3DataAsString = fetchDataFromS3(params);
    console.log("s3DataAsString is: ", s3DataAsString);
    // const dynamodbResponse = pushDataToDynamoDB(data);
};

// function addDataToDynamo(parameters: dynamoDBParamsToPush) {
//     console.log("Adding a new item.")
//     const docClient = new DocumentClient()
//     docClient.put(parameters, function(err, data) {
//         if (err) {
//             console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
//         } else {
//             console.log("Added item:", JSON.stringify(parameters.Item, null, 2))
//         }
//     });
// }

// const s3 = new AWS.S3();
// console.log("s3 set as: ", s3)
// const s3Stream = s3.getObject(params).createReadStream()
// console.log("s3stream set as: ", s3Stream)
// csv().fromStream(s3Stream).on('data', (row) => {
//     let jsonContent = JSON.parse(row);
//     console.log(JSON.stringify(jsonContent));

//     let data: dynamoDBData = {
//         "ATCOCode": jsonContent.ATCOCode,
//         "NaptanCode": jsonContent.NaptanCode,
//         "CommonName": jsonContent.CommonName,
//         "Street": jsonContent.Street,
//         "Indicator": jsonContent.Indicator,
//         "IndicatorLang": jsonContent.IndicatorLang,
//         "Bearing": jsonContent.Bearing,
//         "NptgLocalityCode": jsonContent.NptgLocalityCode,
//         "LocalityName": jsonContent.LocalityName,
//         "ParentLocalityName": jsonContent.ParentLocalityName,
//         "LocalityCentre": jsonContent.LocalityCentre,
//         "GridType": jsonContent.GridType,
//         "Easting": jsonContent.Easting,
//         "Northing": jsonContent.Northing,
//         "Longitude": jsonContent.Longitude,
//         "Latitude": jsonContent.Latitude,
//         "StopType": jsonContent.StopType,
//         "BusStopType": jsonContent.BusStopType,
//         "TimingStatus": jsonContent.TimingStatus
//     };
//     let paramsToPush = {
//         TableName: tableName,
//         Item: data
//     };
//     addDataToDynamo(paramsToPush);
// })  

// const tableName = "Stops";