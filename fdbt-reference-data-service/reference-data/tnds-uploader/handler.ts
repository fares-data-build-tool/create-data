import { Handler, Context, Callback } from 'aws-lambda';
import AWS from 'aws-sdk';
import X2JS from 'x2js';
import util from 'util';
import omitEmpty from 'omit-empty';
import Papa from 'papaparse';

const awsTest: any = {
    "accessKeyId": "S3RVER",
    "secretAccessKey": "S3RVER",
    "region": "eu-west-2",
    "endpoint": "http://localhost:4569",
    "sslEnabled": false,
    "s3ForcePathStyle": true
}

interface s3ObjectParameters {
    Bucket: string;
    Key: string;
}

export function convertDataForDDB(data:any){

    const options:AWS.DynamoDB.Converter.ConverterOptions = {
        convertEmptyValues: true,
        wrapNumbers: true
    }

    const convertedData = AWS.DynamoDB.Converter.marshall(data, options);

    return convertedData;

}


export async function fetchDataFromS3AsString(parameters: s3ObjectParameters): Promise<string> {

    if (process.env.IS_OFFLINE) { AWS.config.update(awsTest); }
    
    const s3 = new AWS.S3();

    const data = await s3.getObject(parameters, function (err, data) {
        if (err) {
            console.log("Failed to retrieve object from S3 with response code: " + err.statusCode + " and error message: " + err.message);
        } else {
            console.log("Object returned from S3: " + data.Body?.toString("utf-8"))
        }
    }).promise();

    const dataAsString = data.Body?.toString('utf-8')!;

    return dataAsString;
}

export function fileExtensionCheck(fileExtension: string, xmlTableName: string, csvTableName: string) {

    let table = "";

    if (!fileExtension) {
        console.error("Could not determine the file type.");
        return;
    }

    if (fileExtension === "csv") {
        return table = csvTableName;
    } else if (fileExtension === "xml") {
        return table = xmlTableName;
    } else {
        console.error(`File is not of a supported format type (${fileExtension})`);
        throw new Error(`Unsupported file type ${fileExtension}`);
    }

}

export function xmlToJsonParse(xmlData: string) {
    const xml = xmlData;

    const x2js = new X2JS({
        attributeConverters: [],
        attributePrefix: "", useDoubleQuotes: true, ignoreRoot: true, skipEmptyTextNodesForObj: true, emptyNodeForm: 'object'
    });

    const document: any = x2js.xml2js(xml);

    const noEmptyDocument = omitEmpty(document);
    console.log(util.inspect(noEmptyDocument, { showHidden: false, depth: null }))

    const convertedFormatData = convertDataForDDB(noEmptyDocument);
    console.log(util.inspect(convertedFormatData.M, { showHidden: false, depth: null }))

    if (!convertedFormatData.M) {
        throw console.error("Data conversion failed");
    }

    const dataToCommit = convertedFormatData.M;

    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: "TNDS",
        Item: dataToCommit
    };

    if (params) {
        return params;
    } else {
        throw console.error("XML to JSON converstion failed.");
    }
}

export function csvToJsonParse(csvData: string) {
    const csv = csvData;
    const lines = csv.split("\n");
    const headerLine = lines[0];

    const newCsvLines = [];

    for (let i = 1; i < lines.length; i++) { // this starts at 1 to avoid the header line
        const newCsvLine = headerLine + "\n" + lines[i];
        newCsvLines.push(newCsvLine);
    }
    // newCsvLines should have ~20k lines in it now, with a header for each.

    const parsedLines = [];

    for (let j = 0; j < newCsvLines.length; j++) {
        const parsedLine = Papa.parse(newCsvLines[j]);
        parsedLines.push(parsedLine);
    }
    // parsedLines should now have ~20k parsed JSON objects in it.

    

    }

}

export const s3hook: Handler = async (event: any, context: Context, callback: Callback) => {

    console.log("Reading options from event:\n", util.inspect(event, { depth: 5 }));

    const TNDS_CSV_TABLE = "Services"; 
    const TNDS_XML_TABLE = "TNDS";

    const eventKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ")); // Object key may have spaces or unicode non-ASCII characters
    const bucketName = event.Records[0].s3.bucket.name;

    console.log(`Got S3 event for key '${eventKey}' in bucket '${bucketName}'`);

    let dynamoDbParams = null;
    const filePath = eventKey;
    const parameters: s3ObjectParameters = { Bucket: bucketName, Key: filePath };
    const fileExtension = filePath.split('.').pop()!;

    const stringifiedS3Data = await fetchDataFromS3AsString(parameters);

    const table = fileExtensionCheck(fileExtension, TNDS_XML_TABLE, TNDS_CSV_TABLE);

    if (table === TNDS_XML_TABLE) {
        dynamoDbParams = xmlToJsonParse(stringifiedS3Data);
    } else if (table === TNDS_CSV_TABLE) {
        dynamoDbParams = csvToJsonParse(stringifiedS3Data);
    }

    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    if (!dynamoDbParams) throw new Error('Unable to parse dynamodb params.');

    dynamoDb.put(dynamoDbParams, function (err, data){
        if (err){
            callback("Failed to add data to database.")
            console.error("Failed to add data to database due to: " + err.message)
            return;
        } else {
            callback("Database update complete.")
            console.log("Database update complete for : " + data.Attributes)
            return;
        }
    })
}
