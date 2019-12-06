import { Handler} from 'aws-lambda';

export const s3hook: Handler = (event:any) => {

console.log("==== This is my event object ====");
console.log(JSON.stringify(event));

// console.log("==== This is my context object ====");
// console.log(JSON.stringify(context));

// console.log("==== This is my process.env object ====");
// console.log(JSON.stringify(process.env));
};

// export { s3hook};
