import { Handler, Context, Callback } from "aws-lambda";
import AWS from "aws-sdk";
import util from "util";
import csvParse from "csv-parse/lib/sync";
import { parse } from "path";

interface s3ObjectParameters {
  Bucket: string;
  Key: string;
}

interface dynamoDBData {
  ATCOCode: number;
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

export async function fetchDataFromS3AsString(
  parameters: s3ObjectParameters
): Promise<string> {
  const s3 = new AWS.S3();
  const data = await s3
    .getObject(parameters, function(err, data) {
      if (err) {
        console.log(
          "Failed to retrieve object from S3 with response code: " +
            err.statusCode +
            " and error message: " +
            err.message
        );
      } else {
        console.log("Object returned from S3: " + data.Body?.toString("utf-8"));
      }
    })
    .promise();
  const dataAsString = data.Body?.toString("utf-8")!;
  return dataAsString;
}

export function csvParser(csvData: string) {
  const parsedData = csvParse(csvData, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ","
  });
  console.log("parsedData is: ", parsedData);
  return parsedData;
}

export function pushToDynamo(parsedLines: any[]) {
  const dynamodb = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
  });
  let count = 0;
  console.log("parsedLines length before our while loop is: ", parsedLines.length)
  while (parsedLines.length > 25) {
    console.log("parsedLines length inside the while loop is: ", parsedLines.length)
    let arrayToPushToDynamo = [];
    for (let i = 0; i < 25; i++) {
      arrayToPushToDynamo.push(parsedLines[i]);
      parsedLines.shift();
      console.log("parsedLines after shift is ", parsedLines.length)
    }
    console.log("arrayToPushToDynamo should be 25 items. arrayToPushToDynamo and its length is: ", arrayToPushToDynamo.length, arrayToPushToDynamo)
    dynamodb.batchWrite({
      RequestItems: {
        Stops: arrayToPushToDynamo
      }
    });
    count+= 25;
  }
  count+= parsedLines.length;
  console.log("parsedLines should now be <25 items. parsedLines and its length is: ", parsedLines.length, parsedLines)
  dynamodb.batchWrite({
    RequestItems: {
      Stops: parsedLines
    }
  });
  return count;
}

export const s3hook: Handler = async (
  event: any,
  context: Context,
  callback: Callback
) => {
  console.log(
    "Reading options from event:\n",
    util.inspect(event, { depth: 5 })
  );

  const s3BucketName: string = event.Records[0].s3.bucket.name;
  const s3FileName: string = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  ); // Object key may have spaces or unicode non-ASCII characters
  console.log("s3BucketName is: ", s3BucketName);
  console.log("s3FileName is: ", s3FileName);

  const params: s3ObjectParameters = {
    Bucket: s3BucketName,
    Key: s3FileName
  };
  console.log("params is: ", params);

  const stringifiedData = await fetchDataFromS3AsString(params);
  console.log("s3DataAsString is: ", stringifiedData);

  const parsedCsvData = csvParser(stringifiedData);

  const itemsWrittenToDynamo = pushToDynamo(parsedCsvData);
  console.log(itemsWrittenToDynamo);
};
