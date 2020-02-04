import { Handler } from 'aws-lambda';

const s3NptgHandler: Handler = (event: any) => {
    console.log('==== This is my event object ====');
    console.log(JSON.stringify(event));
};

export default s3NptgHandler;
