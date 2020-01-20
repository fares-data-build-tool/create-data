import { S3Handler, S3Event } from "aws-lambda";
import AWS from "aws-sdk";
import { WriteRequest } from "aws-sdk/clients/dynamodb";

import util from "util";
import csvParse from "csv-parse/lib/sync";

describe('aws handler', () =>{
    it('should call console.log', () =>{
        const event = {
            Name: "myName"
        };
        const context: Context = MockContext();
        const callback: Callback = jest.fn();
        const globalAny: any = global;
        globalAny.console = {
            log: jest.fn()
        }
        handler.s3hook(event, context, callback);
        expect(globalAny.console.log).toHaveBeenCalledWith(
            JSON.stringify(event)
        );
    });
});
