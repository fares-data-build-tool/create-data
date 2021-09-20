import { Handler } from 'aws-lambda';

export const handler: Handler<{ paths: string[]; exportPrefix: string }> = () => {
    // populate the values from global settings using the IDs and write to matching data bucket
    console.log('triggered export lambda... Not implemented');
};
