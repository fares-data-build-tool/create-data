import { Handler} from 'aws-lambda';
import AWS from 'aws-sdk';

const S3 = new AWS.S3();

export const s3hook: Handler = (event:any) => {

console.log("==== This is my event object ====");
console.log(JSON.stringify(event));
};