import * as cdk from '@aws-cdk/core';
import { Fn } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { SecurityGroup, Subnet, Vpc } from '@aws-cdk/aws-ec2';

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
                RDS_HOST: Fn.importValue(`${stage}:RdsClusterInternalEndpoint`),
                STAGE: stage,
            },
            securityGroups: [
                SecurityGroup.fromSecurityGroupId(
                    this,
                    'security-group',
                    Fn.importValue(`${stage}:ReferenceDataUploaderLambdaSG`),
                ),
            ],
            vpc: Vpc.fromLookup(this, 'vpc', { vpcName: `fdbt-vpc-${stage}` }),
            vpcSubnets: {
                subnets: [
                    Subnet.fromSubnetId(this, 'vpc-subnet-a', Fn.importValue(`${stage}:PrivateSubnetA`)),
                    Subnet.fromSubnetId(this, 'vpc-subnet-b', Fn.importValue(`${stage}:PrivateSubnetB`)),
                ],
            },
        });

        exporterFunction.addToRolePolicy(new PolicyStatement({ actions: ['ssm:GetParameter'], resources: ['*'] }));

        productsBucket.grantRead(exporterFunction);
        matchingDataBucket.grantWrite(exporterFunction);
    }
}
