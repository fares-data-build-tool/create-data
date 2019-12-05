import { Handler, Context, Callback } from 'aws-lambda';

const s3hook: Handler = (event: any, context: Context, callback: Callback) => {
  console.log(JSON.stringify(event));
  console.log(JSON.stringify(context));
  console.log(JSON.stringify(process.env));
};

export { s3hook }