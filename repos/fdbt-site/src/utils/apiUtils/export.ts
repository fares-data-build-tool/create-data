import { Lambda } from 'aws-sdk';
import { ExportLambdaBody, ZipperLambdaBody } from '../../../shared/integrationTypes';

const lambda = new Lambda({ region: 'eu-west-2' });

export const triggerExport = async (params: ExportLambdaBody): Promise<void> => {
    if (process.env.STAGE !== 'dev') {
        await lambda
            .invokeAsync({ FunctionName: `exporter-${process.env.STAGE}`, InvokeArgs: JSON.stringify(params) })
            .promise();
    }
};

export const triggerZipper = async (params: ZipperLambdaBody): Promise<void> => {
    if (process.env.STAGE !== 'dev') {
        await lambda
            .invokeAsync({ FunctionName: `zipper-${process.env.STAGE}`, InvokeArgs: JSON.stringify(params) })
            .promise();
    }
};
