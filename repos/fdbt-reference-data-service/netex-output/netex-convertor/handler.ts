import { Handler } from 'aws-lambda';

export const s3NetexConvertorHandler: Handler = (event: any) => {
  const tableName = process.env.NAPTAN_TABLE_NAME;
  console.log(tableName);
  console.log("THIS IS MY RESULT ");
  console.log(JSON.stringify(event));
};
