/* eslint-disable @typescript-eslint/no-explicit-any */

import { Callback } from 'aws-lambda';
import s3OdhUploaderHandler from './handler';

describe('aws handler', () => {
    it('should call console.log', () => {
        const event = {
            Name: 'myName',
        };
        const context: any = {};
        const callback: Callback = jest.fn();
        const globalAny: any = global;
        globalAny.console = {
            log: jest.fn(),
        };
        s3OdhUploaderHandler(event, context, callback);
        expect(globalAny.console.log).toHaveBeenCalledWith(JSON.stringify(event));
    });
});
