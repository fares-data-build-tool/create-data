import { Handler, Context, Callback } from 'aws-lambda';

export const s3OdhUploaderHandler: Handler = (event: any, context: Context, callback: Callback) => {
  console.log(JSON.stringify(event));
  console.log(JSON.stringify(context));
  console.log(JSON.stringify(process.env));
};

