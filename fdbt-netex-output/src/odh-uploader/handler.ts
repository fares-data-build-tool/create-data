import { Handler, Context } from 'aws-lambda';

const s3OdhUploaderHandler: Handler = (event: any, context: Context) => {
    console.log(JSON.stringify(event));
    console.log(JSON.stringify(context));
    console.log(JSON.stringify(process.env));
};

export default s3OdhUploaderHandler;
