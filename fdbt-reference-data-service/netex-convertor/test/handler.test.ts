import * as handler from "../handler"
import { Context, Callback } from "aws-lambda";
import MockContext from 'aws-lambda-mock-context';

describe('aws handler', () => {
    it('should call console.log', () =>{
        const event = {
            Name: "myName"
        };
        const context: Context = MockContext();
        const callback: Callback = jest.fn();
        const globalAny: any = global;
        globalAny.console = {
            log: jest.fn()
        };
        handler.s3hook(event,context,callback);
        expect(globalAny.console.log).toHaveBeenCalledWith(JSON.stringify(event));
    })
});