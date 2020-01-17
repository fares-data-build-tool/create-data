import { Context, Callback } from 'aws-lambda';
import MockContext from 'aws-lambda-mock-context';
const {testEvent} = require('../__mocks__/testEventData')
jest.mock('../__mocks__/handler.ts')
const handler = require('../__mocks__/handler')

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
        const event = testEvent;
        const context: Context = MockContext();
        const callback: Callback = jest.fn();
        handler.s3hook(event, context, callback);
        expect().toHaveBeenCalledWith({
            Bucket:'fdbt-test-tnds-data',
            Key: 'data.csv'
        })
    })

    it('', () =>{

    })

    it('', () =>{

    })

    it('', () =>{

    })

    it('', () =>{

    })
});
