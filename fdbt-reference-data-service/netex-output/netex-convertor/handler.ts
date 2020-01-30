import { S3Event } from "aws-lambda";
import AWS from "aws-sdk";

export interface s3ObjectParameters {
  Bucket: string;
  Key: string;
}

export interface fetchedData {
  Data: {};
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

export async function fetchDataFromS3AsJSON(parameters: s3ObjectParameters): Promise<JSON> {
  const s3: AWS.S3 = new AWS.S3();
  try {
    let dataAsString: string = (await s3.getObject(parameters).promise()).Body?.toString("utf-8")!;
    const dataAsJson: JSON = JSON.parse(dataAsString);
    return dataAsJson;
  } catch (err) {
    throw Error(`Error in retrieving data. Error: ${err.message}`);
  }
}

export const s3NetexHandler = async (event: S3Event) => {
  const params = setS3ObjectParams(event);
  const s3Key: string = params.Key;
  const uuid = s3Key.split("_")[0];
  const JsonData = await fetchDataFromS3AsJSON(params);
  return JsonData;
};
