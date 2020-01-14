import { Handler, Context, Callback } from 'aws-lambda';
import AWS, { CodeBuild } from 'aws-sdk';
import csvtojson from 'csvtojson';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

interface s3GetObjectParameters {
    Bucket: string,
    Key: string
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

interface dynamoDBParamsToPush {
    TableName: string,
    Item: dynamoDBData
}

const tableName = "Stops";

export const s3hook: Handler = (event:any, context: Context, callback: Callback) => {
    const bucketName: string = event.Records[0].s3.bucket.name;
    const filepath = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ")); // Object key may have spaces or unicode non-ASCII characters

    const params: s3GetObjectParameters = {Bucket: bucketName, Key: filepath};

    const s3 = new AWS.S3();
    console.log("s3 set as: ", s3)
    const s3Stream = s3.getObject(params).createReadStream()
    console.log("s3stream set as: ", s3Stream)
    csvtojson().fromStream(s3Stream).on('data', (row) => {
        let jsonContent = JSON.parse(row);
        console.log(JSON.stringify(jsonContent));

        let data: dynamoDBData = {
            "ATCOCode": jsonContent.ATCOCode,
            "NaptanCode": jsonContent.NaptanCode,
            "CommonName": jsonContent.CommonName,
            "Street": jsonContent.Street,
            "Indicator": jsonContent.Indicator,
            "IndicatorLang": jsonContent.IndicatorLang,
            "Bearing": jsonContent.Bearing,
            "NptgLocalityCode": jsonContent.NptgLocalityCode,
            "LocalityName": jsonContent.LocalityName,
            "ParentLocalityName": jsonContent.ParentLocalityName,
            "LocalityCentre": jsonContent.LocalityCentre,
            "GridType": jsonContent.GridType,
            "Easting": jsonContent.Easting,
            "Northing": jsonContent.Northing,
            "Longitude": jsonContent.Longitude,
            "Latitude": jsonContent.Latitude,
            "StopType": jsonContent.StopType,
            "BusStopType": jsonContent.BusStopType,
            "TimingStatus": jsonContent.TimingStatus
        };
        let paramsToPush = {
            TableName: tableName,
            Item: data
        };
        addDataToDynamo(paramsToPush);
    })  
};

function addDataToDynamo(parameters: dynamoDBParamsToPush) {
    console.log("Adding a new item.")
    const docClient = new DocumentClient()
    docClient.put(parameters, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(parameters.Item, null, 2))
        }
    });
}