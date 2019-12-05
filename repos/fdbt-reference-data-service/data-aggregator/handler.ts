import { Handler } from "aws-lambda";

export const s3hook: Handler = async (event: any) => {
  console.log("THIS IS THE RESULT OF THE EVENT");
  console.log(JSON.stringify(event));
};
