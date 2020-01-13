import { Handler, Context, Callback } from 'aws-lambda';
import AWS from 'aws-sdk';
import X2JS from 'x2js';
var util = require('util');
import omitEmpty from 'omit-empty';

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
        console.error(`Internal error - something went wrong with the data collection: (${err})`);
        throw new Error(`Internal error :${err}`);
    }
}

function fileExtensionCheck(fileExtension: string, xmlTableName: string, csvTableName: string, callback: Callback) {
    let table = "";

    if(!fileExtension){
        callback("Could not determine the file type.");
        console.error("Could not determine the file type.");
        return;
    }

    if (fileExtension === "csv") {

        return table = csvTableName;

    } else if (fileExtension === "xml") {

        return table = xmlTableName;

    } else {
        callback(`File is not of a supported format type (${fileExtension})`);
        console.error(`File is not of a supported format type (${fileExtension})`);
        throw new Error(`Unsupported file type ${fileExtension}`);
    }
}

function xmlToJsonParse(xmlData: string){
    const xml = xmlData;

    const x2js = new X2JS({
        attributeConverters: [],
        attributePrefix: "", useDoubleQuotes: true, ignoreRoot: true, skipEmptyTextNodesForObj: true, emptyNodeForm: 'object'
    });

    const document: any = x2js.xml2js(xml);
    const noEmptyDocument = omitEmpty(document);
    console.log(util.inspect(noEmptyDocument, { showHidden: false, depth: null }))
    const convertedFormatData = AWS.DynamoDB.Converter.input(noEmptyDocument);
    console.log(util.inspect(convertedFormatData.M, { showHidden: false, depth: null }))

    if(!convertedFormatData.M){
        throw console.error("Data conversion failed");
    }

    const dataToCommit = convertedFormatData.M;

    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: "TNDS",
        Item: dataToCommit
    };

    if (params){
        return params;
    } else {
        throw console.error("XML to JSON converstion failed.");
    }
}

function csvToJsonParse(csvData: string){
    let csv = csvData;
    let json;

    return json;
}

export const s3hook: Handler = async (event: any, context: Context, callback: Callback) => {

    console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));

    // Could pass in dynamodb connection string here (localhost / )
    const { TNDS_CSV_TABLE = "", TNDS_XML_TABLE = "", IS_OFFLINE = "" } = process.env;
    
    const eventKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ")); // Object key may have spaces or unicode non-ASCII characters
    const bucketName = event.Records[0].s3.bucket.name;
    let params = null;

    const filePath = JSON.stringify(eventKey);
    const fileExtension = filePath.split('.').pop()!;

    const stringifiedS3Data = await fetchDataFromS3AsString(bucketName, filePath);

    const table = fileExtensionCheck(fileExtension, TNDS_XML_TABLE, TNDS_CSV_TABLE, callback);

    if(table===TNDS_XML_TABLE){
        params = xmlToJsonParse(stringifiedS3Data);
    } else if(table===TNDS_CSV_TABLE){
        params = csvToJsonParse(stringifiedS3Data);
    }

    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    if (!params) throw new Error('Unable to parse dynamodb params')

    dynamoDb.put(params, function (err, data){
        if (err){
            callback("Failed to add data to database.")
            console.error("Failed to add data to database due to: " + err)
            return;
        } else {
            callback("Database update complete.")
            console.log("Database update complete for : " + data)
        }
    })
}
