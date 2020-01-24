import { S3Event, S3Handler } from "aws-lambda";
import AWS from "aws-sdk";
import util from "util";
import csvParse from "csv-parse/lib/sync";
import { WriteRequest } from "aws-sdk/clients/dynamodb";

export type ParsedData = dynamoDBData;

export interface s3ObjectParameters {
  Bucket: string;
  Key: string;
}

interface dynamoDBData {
  id: string;
  NOCCODE: string;
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

interface lists3ObjectsParameters {
  Bucket: string;
  Prefix: string;
}

export async function lists3Objects(parameters: lists3ObjectsParameters): Promise<string[]> {
  let objlist: string[] = [];
  const s3 = new AWS.S3();
  const data = await s3.listObjectsV2(parameters, function (err, data) {
    if (err) {
      throw new Error("Could not list objects, error message: " +err.message + " error name: " +err.name);
    } else {
      return data;
    }
  }).promise();
  const contents = data.Contents!;
  const itemOne = contents[0]["Key"];
  const itemTwo = contents[1]["Key"];
  const itemThree = contents[2]["Key"];
  if (
    !itemOne || itemOne === undefined || !itemTwo || itemTwo === undefined || !itemThree || itemThree === undefined
  ) {
    return [];
  }
  objlist.push(itemOne, itemTwo, itemThree);
  return objlist;
}

export async function fetchDataFromS3AsString(parameters: s3ObjectParameters): Promise<string> {
  const s3 = new AWS.S3();
  const data = await s3.getObject(parameters).promise();
  const dataAsString = data.Body?.toString("utf-8")!;
  return dataAsString;
}

export function csvParser(csvData: string): ParsedData[] {
  const parsedData: ParsedData[] = csvParse(csvData, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ","
  });
  return parsedData;
}

export function mergeArrayObjects(objectArray1: ParsedData[], objectArray2: ParsedData[]): ParsedData[] {
  let start = 0;
  let merge = [];
  while (start < objectArray1.length) {
    if (objectArray1[start].id === objectArray1[start].id) {
      merge.push({ ...objectArray1[start], ...objectArray2[start] })
    };
    start = start + 1;
  };
  return merge;
}

export function formatDynamoWriteRequest(parsedLines: dynamoDBData[]): AWS.DynamoDB.WriteRequest[][] {
  const parsedDataMapper = (parsedDataItem: ParsedData): WriteRequest => ({
    PutRequest: { Item: parsedDataItem as any }
  });
  const dynamoWriteRequests = parsedLines.map(parsedDataMapper);
  const emptyBatch: WriteRequest[][] = [];
  const batchSize = 25;
  const dynamoWriteRequestBatches = dynamoWriteRequests.reduce(function (
    result,
    _value,
    index,
    array
  ) {
    if (index % batchSize === 0)
      result.push(array.slice(index, index + batchSize));
    return result;
  },
    emptyBatch);
  return dynamoWriteRequestBatches;
}

export async function writeBatchesToDynamo({ parsedLines, tableName }: PushToDyanmoInput) {
  const dynamodb = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
  });
  const dynamoWriteRequestBatches = formatDynamoWriteRequest(parsedLines);
  let count = 0;
  for (const batch of dynamoWriteRequestBatches) {
    console.log("Writing to DynamoDB...");
    console.log(
      "Reading options from event:\n",
      util.inspect(batch, { depth: 5 })
    );
    try {
    await dynamodb
      .batchWrite({
        RequestItems: {
          [tableName]: batch
        }
      })
      .promise();
    } catch {
      console.log("Throwing error....")
      throw new Error("Could not write batch to DynamoDB")
    }
    let batchLength = batch.length;
    console.log(`Wrote batch of ${batchLength} items to Dynamo DB.`);
    count += batchLength;
  }
  console.log(`Wrote ${dynamoWriteRequestBatches.length} batches to DynamoDB.`);
  console.log(`Wrote ${count} total items to DynamoDB.`);
}

export function setS3ObjectParams(event: S3Event): s3ObjectParameters {
  const s3BucketName: string = event.Records[0].s3.bucket.name;
  const s3FileName: string = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  const params: s3ObjectParameters = {
    Bucket: s3BucketName,
    Key: s3FileName
  };
  return params;
}

export function setDbTableEnvVariable(): string {
  const tableName: string | undefined = process.env.NOC_TABLE_NAME;
  if (!tableName) {
    throw new Error("TABLE_NAME environment variable not set.");
  };
  return tableName;
}

export const s3hook: S3Handler = async (event: S3Event) => {
  console.log("Reading options from event:\n", util.inspect(event, { depth: 5 }))

  const tableName = setDbTableEnvVariable();

  const s3BucketName: string = event.Records[0].s3.bucket.name;

  const s3FileName: string = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  const s3FileNameSubStringArray: string[] = s3FileName.split("/");
  const s3FileNameSubStringArrayFirstElement: string = s3FileNameSubStringArray[0];

  const lists3ObjectsParameters: lists3ObjectsParameters = {
    Bucket: s3BucketName,
    Prefix: s3FileNameSubStringArrayFirstElement
  };

  const s3ObjectsList = await lists3Objects(lists3ObjectsParameters);

  if (!s3ObjectsList) {
    throw new Error("Key(s) not available or undefined");
  }

  const s3KeyOne: string = s3ObjectsList[0];
  const s3KeyTwo: string = s3ObjectsList[1];
  const s3KeyThree: string = s3ObjectsList[2];

  const paramsOne: s3ObjectParameters = {
    Bucket: s3BucketName,
    Key: s3KeyOne
  };
  const paramsTwo: s3ObjectParameters = {
    Bucket: s3BucketName,
    Key: s3KeyTwo
  };
  const paramsThree: s3ObjectParameters = {
    Bucket: s3BucketName,
    Key: s3KeyThree
  };

  const stringifiedDataOne = await fetchDataFromS3AsString(paramsOne);
  const stringifiedDataTwo = await fetchDataFromS3AsString(paramsTwo);
  const stringifiedDataThree = await fetchDataFromS3AsString(paramsThree);

  const parsedCsvDataOne = csvParser(stringifiedDataOne);
  const parsedCsvDataTwo = csvParser(stringifiedDataTwo);
  const parsedCsvDataThree = csvParser(stringifiedDataThree);

  const mergedArrayOne = mergeArrayObjects(parsedCsvDataOne, parsedCsvDataTwo);
  const fullyMergedArray = mergeArrayObjects(mergedArrayOne, parsedCsvDataThree);

  await writeBatchesToDynamo({ parsedLines: fullyMergedArray, tableName: tableName });

}
