import { Handler } from 'aws-lambda';

export const s3hook: Handler = async (event: any) => {

  console.log("THIS IS MY RESULT ");
  console.log(JSON.stringify(event));

};
