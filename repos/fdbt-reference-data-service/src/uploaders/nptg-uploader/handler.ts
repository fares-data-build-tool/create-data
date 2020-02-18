import { Handler, S3Event } from 'aws-lambda';

const s3NptgHandler: Handler = (event: S3Event) => {
    console.log('==== This is my event object ====');
    console.log(JSON.stringify(event));
};

export default s3NptgHandler;
