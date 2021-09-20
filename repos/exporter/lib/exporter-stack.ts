import * as cdk from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';

export class ExporterStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const stage = process.env.STAGE;
        if (!stage) {
            throw new Error('Need to set STAGE');
        }

        const productsBucket = new Bucket(this, `products-data-bucket-${stage}`, {
            bucketName: `fdbt-products-data-${stage}`,
        });

        const matchingDataBucket = Bucket.fromBucketName(
            this,
            `fdbt-matching-data-${stage}`,
            `fdbt-matching-data-${stage}`,
        );

        const exporterFunction = new NodejsFunction(this, `exporter-${stage}`, {
            functionName: `exporter-${stage}`,
            entry: './lib/handler.ts',
            environment: {
                PRODUCTS_BUCKET: productsBucket.bucketName,
                MATCHING_DATA_BUCKET: matchingDataBucket.bucketName,
            },
        });

        productsBucket.grantRead(exporterFunction);
        matchingDataBucket.grantWrite(exporterFunction);
    }
}
