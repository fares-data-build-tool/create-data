import * as cdk from '@aws-cdk/core';
import { Fn, Duration } from '@aws-cdk/core';
import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import { NodejsFunction, SourceMapMode } from '@aws-cdk/aws-lambda-nodejs';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { SecurityGroup, Subnet, Vpc } from '@aws-cdk/aws-ec2';
import { Topic } from '@aws-cdk/aws-sns';
import { SnsAction } from '@aws-cdk/aws-cloudwatch-actions';
import { TreatMissingData } from '@aws-cdk/aws-cloudwatch';

export class ExporterStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const stage = process.env.STAGE;
        if (!stage) {
            throw new Error('Need to set STAGE');
        }

        const productsBucket = new Bucket(this, `products-data-bucket-${stage}`, {
            bucketName: `fdbt-products-data-${stage}`,
            encryption: BucketEncryption.KMS_MANAGED,
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
            bundling: {
                sourceMap: true,
                sourceMapMode: SourceMapMode.DEFAULT,
            },
            timeout: Duration.minutes(5),
        });

        const alarmTopicArn = Fn.importValue(`${stage}:SlackAlertsTopicArn`);
        const alarmTopic = Topic.fromTopicArn(this, 'alarm-topic', alarmTopicArn);
        const snsAction = new SnsAction(alarmTopic);

        const errorsAlarm = exporterFunction
            .metricErrors({ period: Duration.minutes(1) })
            .createAlarm(this, 'exporter-errors-alarm', {
                threshold: 1,
                evaluationPeriods: 1,
                treatMissingData: TreatMissingData.NOT_BREACHING,
            });
        const durationAlarm = exporterFunction
            .metricDuration({ period: Duration.minutes(1), statistic: 'max' })
            .createAlarm(this, 'exporter-duration-alarm', {
                threshold: 30000,
                evaluationPeriods: 1,
                treatMissingData: TreatMissingData.NOT_BREACHING,
            });

        durationAlarm.addAlarmAction(snsAction);
        durationAlarm.addInsufficientDataAction(snsAction);
        durationAlarm.addOkAction(snsAction);

        errorsAlarm.addAlarmAction(snsAction);
        errorsAlarm.addInsufficientDataAction(snsAction);
        errorsAlarm.addOkAction(snsAction);

        exporterFunction.addToRolePolicy(new PolicyStatement({ actions: ['ssm:GetParameter'], resources: ['*'] }));

        productsBucket.grantRead(exporterFunction);
        matchingDataBucket.grantWrite(exporterFunction);
    }
}
