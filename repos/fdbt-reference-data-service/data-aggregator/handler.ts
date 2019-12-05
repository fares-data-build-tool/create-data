import { Handler } from "aws-lambda";

export const s3hook: Handler = async (event: any) => {
  console.log("THIS IS THE RESULT");
  console.log(JSON.stringify(event));

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
