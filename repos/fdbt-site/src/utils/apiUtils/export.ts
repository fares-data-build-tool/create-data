import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { ExportLambdaBody, ZipperLambdaBody } from '../../interfaces/integrationTypes';

const lambda = new LambdaClient({
    region: 'eu-west-2',
});

export const triggerExport = async (params: ExportLambdaBody): Promise<void> => {
    if (process.env.STAGE !== 'dev') {
        await lambda.send(
            new InvokeCommand({
                FunctionName: `exporter-${process.env.STAGE}`,
                Payload: JSON.stringify(params),
                InvocationType: 'Event',
            }),
        );
    }
};

export const triggerZipper = async (params: ZipperLambdaBody): Promise<void> => {
    if (process.env.STAGE !== 'dev') {
        await lambda.send(
            new InvokeCommand({
                FunctionName: `zipper-${process.env.STAGE}`,
                Payload: JSON.stringify(params),
                InvocationType: 'Event',
            }),
        );
    }
};
