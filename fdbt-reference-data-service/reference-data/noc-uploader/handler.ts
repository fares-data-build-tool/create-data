import { Handler, Context, Callback, S3Handler } from "aws-lambda";
import AWS from "aws-sdk";
import util from "util";
import csvParse from "csv-parse/lib/sync";
import { WriteRequest } from "aws-sdk/clients/dynamodb";

type ParsedData = dynamoDBData;

interface s3ObjectParameters {
  Bucket: string;
  Key: string;
}

interface dynamoDBData {
  id: any;
  NCOCODE: string;
  OperatorPublicName: string;
  VOSA_PSVLicenseName: string;
  OpId: number;
  PubNmId: number;
  Mode: string;
  TTRteEnq: string;
  FareEnq: string;
  ComplEnq: string;
  Website: string;
}

interface PushToDyanmoInput {
  parsedLines: ParsedData[];
  tableName: string;
}

export async function fetchDataFromS3AsString(
  parameters: s3ObjectParameters
): Promise<string> {
  const s3 = new AWS.S3();
  const data = await s3.getObject(parameters).promise();
  const dataAsString = data.Body?.toString("utf-8")!;
  return dataAsString;
}

export function csvParser(csvData: string) {
  const parsedData: ParsedData[] = csvParse(csvData, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ","
  });
  return parsedData;
}

 export function mergeArrayObjects(objectArray1: ParsedData[], objectArray2: ParsedData []) {
    let start = 0;
    let merge = [];
    while(start < objectArray1.length){
      if(objectArray1[start].id === objectArray1[start].id){
          merge.push({...objectArray1[start],...objectArray2[start]})
      }
      start = start+1
    }
    return merge;
  }

export async function pushToDynamo({
  parsedLines,
  tableName
}: PushToDyanmoInput) {
  const dynamodb = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
  });
  const parsedDataMapper = (parsedDataItem: ParsedData): WriteRequest => ({
    PutRequest: { Item: parsedDataItem as any }
  });
  const dynamoWriteRequests = parsedLines.map(parsedDataMapper);

  const emptyBatch: WriteRequest[][] = [];
  const batchSize = 25;
  const dynamoWriteRequestBatches = dynamoWriteRequests.reduce(function(result, _value, index, array) {
    if (index % batchSize === 0)
      result.push(array.slice(index, index + batchSize));
    return result;
  }, emptyBatch);

  for (const batch of dynamoWriteRequestBatches) {
    console.log("Writing to DynamoDB...");
    console.log(
      "Reading options from event:\n",
      util.inspect(batch, { depth: 5 })
    );
    await dynamodb
      .batchWrite({
        RequestItems: {
          [tableName]: batch
        }
      })
      .promise();
    console.log(`Wrote batch of ${batch.length} items to Dynamo DB.`);
  }
  console.log(`Wrote ${dynamoWriteRequestBatches.length} batches to DynamoDB`);
}

export const s3hook: S3Handler = async (event, context) => {
  console.log(
    "Reading options from event:\n",
    util.inspect(event, { depth: 5 })
  );

  const tableName = process.env.NOC_TABLE_NAME;
  if (!tableName) {
    throw new Error("TABLE_NAME environment variable not set.");
  }

  const s3BucketName: string = event.Records[0].s3.bucket.name;

  const s3FileName1: string = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  const s3FileName2: string = decodeURIComponent(
    event.Records[1].s3.object.key.replace(/\+/g, " ")
  );
  const s3FileName3: string = decodeURIComponent(
    event.Records[2].s3.object.key.replace(/\+/g, " ")
  );

  const params1: s3ObjectParameters = {
    Bucket: s3BucketName,
    Key: s3FileName1
  };
  const params2: s3ObjectParameters = {
    Bucket: s3BucketName,
    Key: s3FileName2
  };
  const params3: s3ObjectParameters = {
    Bucket: s3BucketName,
    Key: s3FileName3
  };

  const stringifiedData1 = await fetchDataFromS3AsString(params1);
  const stringifiedData2 = await fetchDataFromS3AsString(params2);
  const stringifiedData3 = await fetchDataFromS3AsString(params3);

  const parsedCsvData1 = csvParser(stringifiedData1);
  const parsedCsvData2 = csvParser(stringifiedData2);
  const parsedCsvData3 = csvParser(stringifiedData3);



  await pushToDynamo({ tableName: tableName, parsedLines: parsedCsvData });
};




