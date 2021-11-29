import * as cdk from '@aws-cdk/core';
import { Fn, Duration } from '@aws-cdk/core';
import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import { NodejsFunction, SourceMapMode } from '@aws-cdk/aws-lambda-nodejs';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { SecurityGroup, Subnet, Vpc } from '@aws-cdk/aws-ec2';
import { Topic } from '@aws-cdk/aws-sns';
import { SnsAction } from '@aws-cdk/aws-cloudwatch-actions';
import { TreatMissingData } from '@aws-cdk/aws-cloudwatch';
import { Rule, Schedule } from '@aws-cdk/aws-events';
import { LambdaFunction } from '@aws-cdk/aws-events-targets';

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

        const vpc = Vpc.fromLookup(this, 'vpc', { vpcName: `fdbt-vpc-${stage}` });
        const vpcSubnets = {
            subnets: [
                Subnet.fromSubnetId(this, 'vpc-subnet-a', Fn.importValue(`${stage}:PrivateSubnetA`)),
                Subnet.fromSubnetId(this, 'vpc-subnet-b', Fn.importValue(`${stage}:PrivateSubnetB`)),
            ],
        };

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
            vpc: vpc,
            vpcSubnets: vpcSubnets,
            bundling: {
                sourceMap: true,
                sourceMapMode: SourceMapMode.DEFAULT,
            },
            timeout: Duration.minutes(15),
            logRetention: 180,
            memorySize: 2048,
            reservedConcurrentExecutions: 5,
        });

        this.addAlarmsToLambda(stage, exporterFunction, `exporter-${stage}`, 300000);

        exporterFunction.addToRolePolicy(new PolicyStatement({ actions: ['ssm:GetParameter'], resources: ['*'] }));

        productsBucket.grantRead(exporterFunction);
        matchingDataBucket.grantWrite(exporterFunction);

        const atcoCodeCheckerFunction = new NodejsFunction(this, `atco-code-checker-${stage}`, {
            functionName: `atco-code-checker-${stage}`,
            entry: './lib/atcoCheckerHandler.ts',
            environment: {
                PRODUCTS_BUCKET: productsBucket.bucketName,
                MATCHING_DATA_BUCKET: matchingDataBucket.bucketName,
                RDS_HOST: Fn.importValue(`${stage}:RdsClusterInternalEndpoint`),
                STAGE: stage,
            },
            securityGroups: [
                SecurityGroup.fromSecurityGroupId(
                    this,
                    'atco-code-checker-security-group',
                    Fn.importValue(`${stage}:ReferenceDataUploaderLambdaSG`),
                ),
            ],
            vpc: vpc,
            vpcSubnets: vpcSubnets,
            bundling: {
                sourceMap: true,
                sourceMapMode: SourceMapMode.DEFAULT,
            },
            timeout: Duration.minutes(15),
            logRetention: 180,
        });

        this.addAlarmsToLambda(stage, atcoCodeCheckerFunction, `atcoCodeCheckerFunction-${stage}`, 420000);

        atcoCodeCheckerFunction.addToRolePolicy(
            new PolicyStatement({ actions: ['ssm:GetParameter', 's3:GetObject'], resources: ['*'] }),
        );

        new Rule(this, `atco-code-checker-rule-${stage}`, {
            schedule: Schedule.cron({ minute: '0', hour: '6' }), // every day at 6am
            targets: [new LambdaFunction(atcoCodeCheckerFunction)],
        });

        const tableRenameFunction = new NodejsFunction(this, `table-rename-${stage}`, {
            functionName: `table-rename-${stage}`,
            entry: './lib/tableRenameHandler.ts',
            environment: {
                RDS_HOST: Fn.importValue(`${stage}:RdsClusterInternalEndpoint`),
                STAGE: stage,
            },
            securityGroups: [
                SecurityGroup.fromSecurityGroupId(
                    this,
                    'table-rename-security-group',
                    Fn.importValue(`${stage}:ReferenceDataUploaderLambdaSG`),
                ),
            ],
            vpc: vpc,
            vpcSubnets: vpcSubnets,
            bundling: {
                sourceMap: true,
                sourceMapMode: SourceMapMode.DEFAULT,
            },
            timeout: Duration.minutes(15),
            logRetention: 180,
        });

        this.addAlarmsToLambda(stage, tableRenameFunction, `tableRenameFunction-${stage}`, 420000);

        tableRenameFunction.addToRolePolicy(new PolicyStatement({ actions: ['ssm:GetParameter'], resources: ['*'] }));

        new Rule(this, `table-rename-rule-${stage}`, {
            schedule: Schedule.cron({ minute: '30', hour: '5' }), // every day at 5:30am
            targets: [new LambdaFunction(tableRenameFunction)],
        });

        const bastionTerminatorFunction = new NodejsFunction(this, `bastion-terminator-${stage}`, {
            functionName: `bastion-terminator-${stage}`,
            entry: './lib/bastionTerminator.ts',
            bundling: {
                sourceMap: true,
                sourceMapMode: SourceMapMode.DEFAULT,
            },
            timeout: Duration.minutes(1),
            logRetention: 180,
        });

        this.addAlarmsToLambda(stage, bastionTerminatorFunction, `bastion-terminator-${stage}`, 30000);

        bastionTerminatorFunction.addToRolePolicy(
            new PolicyStatement({ actions: ['ec2:TerminateInstances', 'ec2:DescribeInstances'], resources: ['*'] }),
        );

        new Rule(this, `bastion-terminator-rule-${stage}`, {
            schedule: Schedule.cron({ weekDay: 'MON', minute: '0', hour: '6' }), // every monday at 6am
            targets: [new LambdaFunction(bastionTerminatorFunction)],
        });

        const netexBucket = Bucket.fromBucketName(this, 'netex-bucket', `fdbt-netex-data-${stage}`);
        const zipperFunction = new NodejsFunction(this, `zipper-${stage}`, {
            functionName: `zipper-${stage}`,
            entry: './lib/zipperHandler.ts',
            environment: {
                NETEX_BUCKET: netexBucket.bucketName,
                MATCHING_DATA_BUCKET: matchingDataBucket.bucketName,
                STAGE: stage,
            },
            bundling: {
                sourceMap: true,
                sourceMapMode: SourceMapMode.DEFAULT,
            },
            timeout: Duration.minutes(15),
            logRetention: 180,
            memorySize: 2048,
        });

        netexBucket.grantReadWrite(zipperFunction);

        this.addAlarmsToLambda(stage, zipperFunction, `zipper-${stage}`, 60000);
    }

    private addAlarmsToLambda(stage: string, lambdaFn: NodejsFunction, id: string, durationThreshold: number) {
        const alarmTopicArn = Fn.importValue(`${stage}:SlackAlertsTopicArn`);
        const alarmTopic = Topic.fromTopicArn(this, `${id}-alarm-topic-${stage}`, alarmTopicArn);
        const snsAction = new SnsAction(alarmTopic);

        const errorsAlarm = lambdaFn
            .metricErrors({ period: Duration.minutes(1) })
            .createAlarm(this, `${id}-errors-alarm`, {
                threshold: 1,
                evaluationPeriods: 1,
                treatMissingData: TreatMissingData.NOT_BREACHING,
            });
        const durationAlarm = lambdaFn
            .metricDuration({ period: Duration.minutes(1), statistic: 'max' })
            .createAlarm(this, `${id}-duration-alarm`, {
                threshold: durationThreshold,
                evaluationPeriods: 1,
                treatMissingData: TreatMissingData.NOT_BREACHING,
            });

        durationAlarm.addAlarmAction(snsAction);
        durationAlarm.addInsufficientDataAction(snsAction);
        durationAlarm.addOkAction(snsAction);

        errorsAlarm.addAlarmAction(snsAction);
        errorsAlarm.addInsufficientDataAction(snsAction);
        errorsAlarm.addOkAction(snsAction);
    }
}
