import { S3Handler, S3Event } from "aws-lambda";
import AWS from "aws-sdk";
import { WriteRequest } from "aws-sdk/clients/dynamodb";

import util from "util";
import csvParse from "csv-parse/lib/sync";

export type ParsedData = dynamoDBData;

export interface s3ObjectParameters {
  Bucket: string;
  Key: string;
}

interface dynamoDBData {
  ATCOCode: string;
  NaptanCode: string;
  CommonName: string;
  Street: string;
  Indicator: string;
  IndicatorLang: string;
  Bearing: string;
  NptgLocalityCode: string;
  LocalityName: string;
  ParentLocalityName: string;
  LocalityCentre: number;
  GridType: string;
  Easting: number;
  Northing: number;
  Longitude: number;
  Latitude: number;
  StopType: string;
  BusStopType: string;
  TimingStatus: string;
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

export function csvParser(csvData: string): ParsedData[] {
  const parsedData: ParsedData[] = csvParse(csvData, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ","
  });
  return parsedData;
}

export function formatDynamoWriteRequest(
  parsedLines: dynamoDBData[]
): AWS.DynamoDB.WriteRequest[][] {
  const parsedDataMapper = (parsedDataItem: ParsedData): WriteRequest => ({
    PutRequest: { Item: parsedDataItem as any }
  });
  const dynamoWriteRequests = parsedLines.map(parsedDataMapper);

  const emptyBatch: WriteRequest[][] = [];
  const batchSize = 25;
  const dynamoWriteRequestBatches = dynamoWriteRequests.reduce(function(
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

export async function writeBatchesToDynamo({
  parsedLines,
  tableName
}: PushToDyanmoInput) {
  const dynamodb = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
  });

  const dynamoWriteRequestBatches = formatDynamoWriteRequest(parsedLines);

  let count = 0;
  for (const batch of dynamoWriteRequestBatches) {
    console.log("Writing to DynamoDB...");
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

export function setDbTableEnvVariable () : string {
  const tableName: string | undefined = process.env.NAPTAN_TABLE_NAME;
  if (!tableName) {
    throw new Error("TABLE_NAME environment variable not set.");
  };
  return tableName;
}

export const s3hook: S3Handler = async (event) => {
  console.log(
    "Reading options from event:\n",
    util.inspect(event, { depth: 5 })
  );

  const tableName = setDbTableEnvVariable();

  const params = setS3ObjectParams(event);
  const stringifiedData = await fetchDataFromS3AsString(params);
  const parsedCsvData = csvParser(stringifiedData);
  await writeBatchesToDynamo({
    tableName: tableName,
    parsedLines: parsedCsvData
  });
};
