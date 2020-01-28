import { S3Event, S3Handler } from "aws-lambda";
import AWS from "aws-sdk";
import csvParse from "csv-parse/lib/sync";
import { WriteRequest } from "aws-sdk/clients/dynamodb";

export type ParsedData = DynamoDBData;

export interface S3ObjectParameters {
  Bucket: string;
  Key: string;
}

interface DynamoDBData {
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

interface NocLinesData {
  NOCCODE: string;
  Mode: string;
}

interface NocTableData {
  NOCCODE: string;
  OperatorPublicName: string;
  VOSA_PSVLicenseName: string;
  OpId: number;
  PubNmId: number;
}

interface PublicNameData {
  // OperatorPublicName: string;
  PubNmId: number;
  TTRteEnq: string;
  FareEnq: string;
  ComplEnq: string;
  Website: string;
}

interface PushToDyanmoInput {
  parsedLines: ParsedData[];
  tableName: string;
}

export interface Lists3ObjectsParameters {
  Bucket: string;
  Prefix: string;
}

export async function lists3Objects(
  parameters: Lists3ObjectsParameters
): Promise<string[]> {
  let objlist: string[] = [];
  const s3 = new AWS.S3();
  const data = await s3
    .listObjectsV2(parameters, function(err, data) {
      if (err) {
        throw new Error(
          "Could not list objects, error message: " +
            err.message +
            " error name: " +
            err.name
        );
      } else {
        return data;
      }
    })
    .promise();
  const contents = data.Contents!;
  let itemOne = "";
  let itemTwo = "";
  let itemThree = "";
  try {
    itemOne = contents[0]["Key"]!;
    itemTwo = contents[1]["Key"]!;
    itemThree = contents[2]["Key"]!;
  } catch (Error) {
    return [];
  }
  objlist.push(itemOne, itemTwo, itemThree);
  return objlist;
}

export async function fetchDataFromS3AsString(
  parameters: S3ObjectParameters
): Promise<string> {
  const s3 = new AWS.S3();
  const data = await s3.getObject(parameters).promise();
  const dataAsString = data.Body?.toString("utf-8")!;
  return dataAsString;
}

export function csvParser(csvData: string): any {
  const parsedData: any = csvParse(csvData, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ","
  });
  return parsedData;
}

export function mergeArrayObjects(
  nocLinesArray: NocLinesData[],
  nocTableArray: NocTableData[],
  publicNameArray: PublicNameData[]
): ParsedData[] {
  const firstMerge: (NocLinesData & NocTableData)[] = nocTableArray.map(x =>
    Object.assign(
      x,
      nocLinesArray.find(y => y.NOCCODE == x.NOCCODE)
    )
  );
  const secondMerge: ParsedData[] = publicNameArray.map(x =>
    Object.assign(
      x,
      firstMerge.find(y => y.PubNmId == x.PubNmId)
    )
  );
  return secondMerge;
}

export function formatDynamoWriteRequest(
  parsedLines: DynamoDBData[]
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
      console.log("Throwing error....");
      throw new Error("Could not write batch to DynamoDB");
    }
    let batchLength = batch.length;
    console.log(`Wrote batch of ${batchLength} items to Dynamo DB.`);
    count += batchLength;
  }
  console.log(`Wrote ${dynamoWriteRequestBatches.length} batches to DynamoDB.`);
  console.log(`Wrote ${count} total items to DynamoDB.`);
}

export function setDbTableEnvVariable(): string {
  const tableName: string | undefined = process.env.NOC_TABLE_NAME;
  if (!tableName) {
    throw new Error("TABLE_NAME environment variable not set.");
  }
  return tableName;
}

export const s3NocHandler = async (event: S3Event) => {
  const tableName = setDbTableEnvVariable();

  const s3BucketName: string = event.Records[0].s3.bucket.name;

  const s3FileName: string = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  const s3FileNameSubStringArray: string[] = s3FileName.split("/");
  const s3FileNameSubStringArrayFirstElement: string =
    s3FileNameSubStringArray[0];

  const Lists3ObjectsParameters: Lists3ObjectsParameters = {
    Bucket: s3BucketName,
    Prefix: s3FileNameSubStringArrayFirstElement
  };

  const s3ObjectsList = await lists3Objects(Lists3ObjectsParameters);

  if (!s3ObjectsList) {
    throw new Error("Key(s) not available or undefined");
  }

  const filenameKeys = [
    s3FileNameSubStringArrayFirstElement + "/NOCLines.csv",
    s3FileNameSubStringArrayFirstElement + "/NOCTable.csv",
    s3FileNameSubStringArrayFirstElement + "/PublicName.csv"
  ];

  const nocLineParams: S3ObjectParameters = {
    Bucket: s3BucketName,
    Key: filenameKeys[0]
  };
  const nocTableParams: S3ObjectParameters = {
    Bucket: s3BucketName,
    Key: filenameKeys[1]
  };
  const publicNameParams: S3ObjectParameters = {
    Bucket: s3BucketName,
    Key: filenameKeys[2]
  };

  const nocLineStringifiedData = await fetchDataFromS3AsString(nocLineParams);
  const nocTableStringifiedData = await fetchDataFromS3AsString(nocTableParams);
  const publicNameStringifiedData = await fetchDataFromS3AsString(
    publicNameParams
  );

  const nocLineParsedCsv: NocLinesData[] = csvParser(nocLineStringifiedData);
  const nocTableParsedCsv: NocTableData[] = csvParser(nocTableStringifiedData);
  const publicNameParsedCsv: PublicNameData[] = csvParser(
    publicNameStringifiedData
  );

  const mergedArray = mergeArrayObjects(
    nocLineParsedCsv,
    nocTableParsedCsv,
    publicNameParsedCsv
  );

  await writeBatchesToDynamo({
    parsedLines: mergedArray,
    tableName: tableName
  });
};
