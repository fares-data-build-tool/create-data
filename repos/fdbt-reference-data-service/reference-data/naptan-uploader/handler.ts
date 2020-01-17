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

export function csvParser(csvData: string) {
  const parsedData: ParsedData[] = csvParse(csvData, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ","
  });
  return parsedData;
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

  const tableName = process.env.NAPTAN_TABLE_NAME;
  if (!tableName) {
    throw new Error("TABLE_NAME environment variable not set.");
  }

  const s3BucketName: string = event.Records[0].s3.bucket.name;
  const s3FileName: string = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  ); // Object key may have spaces or unicode non-ASCII characters

  const params: s3ObjectParameters = {
    Bucket: s3BucketName,
    Key: s3FileName
  };

  const stringifiedData = await fetchDataFromS3AsString(params);

  const parsedCsvData = csvParser(stringifiedData);
  await pushToDynamo({ tableName: tableName, parsedLines: parsedCsvData });
};
