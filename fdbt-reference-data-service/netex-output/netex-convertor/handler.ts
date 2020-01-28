import { Handler, S3Event } from 'aws-lambda';
import AWS from "aws-sdk";

export interface s3ObjectParameters {
  Bucket: string;
  Key: string;
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

export async function fetchDataFromS3AsJSON(parameters: s3ObjectParameters): Promise<Object> {
  const s3 = new AWS.S3();
  let data;
  try {
    data = (await s3.getObject(parameters).promise()).Body?.valueOf;
  } catch (err) {
    throw Error(`Error in retrieving data. Error: ${err.message}`);
  }
  if (data) {
    return data;
  } else {
    throw Error("No data to return.")
  }
}

export const s3NetexHandler = async (event: S3Event) => {
  const params = setS3ObjectParams(event);
  const stringifiedData = await fetchDataFromS3AsJSON(params);
};
