import { Handler} from 'aws-lambda';

export const s3hook: Handler = (event:any) => {

console.log("==== This is my event object ====");
console.log(JSON.stringify(event));
};