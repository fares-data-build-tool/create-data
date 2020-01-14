import * as handler from '../handler';
import { Context, Callback } from 'aws-lambda';
import MockContext from 'aws-lambda-mock-context';

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
    
    it('should send an async request for data using the bucket name and event key', () =>{
        const event = {
            Name: "myName"
        };
        
    })

    it('should convert the data to a string using utf-8', () =>{

    })

    it('should log out the data it gets back from the request', () =>{

    })

    it('should return the dataAsAString variable, and it should be a string', () =>{

    })

    it('should catch the error when one is thrown and print out the error message', () =>{

    })

});
