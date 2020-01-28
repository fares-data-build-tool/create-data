import * as s3NetexHandler from "./handler"
import { Context, Callback } from "aws-lambda";
import MockContext from 'aws-lambda-mock-context';

describe('s3NetexHandler', () => {
    it('returns the JSON data put in the bucket', () =>{
        const event = mockS3Event;
        s3NetexHandler(event);
    })
});