import { Handler, Context, S3Event } from 'aws-lambda';

export const s3OdhUploaderHandler: Handler = (event: S3Event, context: Context) => {
    console.log(JSON.stringify(event));
    console.log(JSON.stringify(context));
    console.log(JSON.stringify(process.env));
};

export default s3OdhUploaderHandler;
