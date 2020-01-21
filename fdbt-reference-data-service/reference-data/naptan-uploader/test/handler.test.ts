import { mockS3Event } from "./mocks/aws_mocks";

import csvParse from "csv-parse/lib/sync";

import { writeBatchesToDynamo, setS3ObjectParams } from "./../handler";

let bucketName = "fdbt-test-naptan-s3-bucket";
let fileName = "fdbt-test-naptan.csv";

describe("setS3ObjectParams", () => {
  it("sets s3BucketName from S3Event", () => {
    const s3Event = mockS3Event(bucketName, fileName);

    const s3ObjectParameters = setS3ObjectParams(s3Event);
    expect(s3ObjectParameters.Bucket).toEqual(bucketName);
  });

  it("sets S3FileName from S3Event", () => {
    const s3Event = mockS3Event(bucketName, fileName);

    const s3ObjectParameters = setS3ObjectParams(s3Event);
    expect(s3ObjectParameters.Key).toEqual(fileName);
  });

  it("removes spaces and unicode non-ASCII characters in the S3FileName", () => {
    let fileName = "fdbt%2Ftest+%3A+naptan.csv"
    const S3Event = mockS3Event(bucketName, fileName);
    const params = {
      Bucket: bucketName,
      Key: "fdbt/test : naptan.csv"
    }

    const s3ObjectParameters = setS3ObjectParams(S3Event);
    expect(s3ObjectParameters).toEqual(params);
  });
});
