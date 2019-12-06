import { Handler } from 'aws-lambda';
// import { Handler, Context, Callback } from 'aws-lambda';

// export const s3hook: Handler = (event: any, context: Context, callback: Callback) => {
export const s3hook: Handler = (event: any) => {
  console.log(JSON.stringify(event));
  // console.log(JSON.stringify(context));
  // console.log(JSON.stringify(process.env));
};

// export { s3hook }