import * as cdk from '@aws-cdk/core';
import { Fn, Duration } from '@aws-cdk/core';
import { Bucket, BucketEncryption, IBucket } from '@aws-cdk/aws-s3';
import { NodejsFunction, SourceMapMode } from '@aws-cdk/aws-lambda-nodejs';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { SecurityGroup, Subnet, Vpc, ISecurityGroup, IVpc, ISubnet } from '@aws-cdk/aws-ec2';
import { Topic } from '@aws-cdk/aws-sns';
import { SnsAction } from '@aws-cdk/aws-cloudwatch-actions';
import { TreatMissingData } from '@aws-cdk/aws-cloudwatch';
import { Rule, Schedule } from '@aws-cdk/aws-events';
import { LambdaFunction } from '@aws-cdk/aws-events-targets';

export class ExporterStack extends cdk.Stack {
    private readonly stage: string;
    private readonly matchingDataBucket: IBucket;
    private readonly productsBucket: IBucket;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const stage = process.env.STAGE;
        if (!stage) {
            throw new Error('Need to set STAGE');
        }
        this.stage = stage;

        const vpc = Vpc.fromLookup(this, 'vpc', { vpcName: `fdbt-vpc-${this.stage}` });
        const vpcSubnets = {
            subnets: [
                Subnet.fromSubnetId(this, 'vpc-subnet-a', Fn.importValue(`${this.stage}:PrivateSubnetA`)),
                Subnet.fromSubnetId(this, 'vpc-subnet-b', Fn.importValue(`${this.stage}:PrivateSubnetB`)),
            ],
        };
        const securityGroup = SecurityGroup.fromSecurityGroupId(
            this,
            'security-group',
            Fn.importValue(`${this.stage}:ReferenceDataUploaderLambdaSG`),
        );

        this.productsBucket = new Bucket(this, `products-data-bucket-${this.stage}`, {
            bucketName: `fdbt-products-data-${this.stage}`,
            encryption: BucketEncryption.KMS_MANAGED,
        });

        this.matchingDataBucket = Bucket.fromBucketName(
            this,
            `fdbt-matching-data-${this.stage}`,
            `fdbt-matching-data-${this.stage}`,
        );

        this.addNeedsAttentionLambda(securityGroup, vpc, vpcSubnets);
        this.addReferenceDataLambdas(securityGroup, vpc, vpcSubnets);
        this.addBastionTerminatorLambda();
        this.addExporterLambdas(securityGroup, vpc, vpcSubnets);
    }

    private addNeedsAttentionLambda(securityGroup: ISecurityGroup, vpc: IVpc, vpcSubnets: { subnets: ISubnet[] }) {
        const atcoCodeCheckerFunction = new NodejsFunction(this, `atco-code-checker-${this.stage}`, {
            functionName: `atco-code-checker-${this.stage}`,
            entry: './lib/atcoCheckerHandler.ts',
            environment: {
                PRODUCTS_BUCKET: this.productsBucket.bucketName,
                MATCHING_DATA_BUCKET: this.matchingDataBucket.bucketName,
                RDS_HOST: Fn.importValue(`${this.stage}:RdsClusterInternalEndpoint`),
                STAGE: this.stage,
            },
            securityGroups: [securityGroup],
            vpc: vpc,
            vpcSubnets: vpcSubnets,
            bundling: {
                sourceMap: true,
                sourceMapMode: SourceMapMode.DEFAULT,
            },
            timeout: Duration.minutes(15),
            logRetention: 180,
        });

        this.addAlarmsToLambda(atcoCodeCheckerFunction, `atcoCodeCheckerFunction-${this.stage}`, 420000);

        atcoCodeCheckerFunction.addToRolePolicy(
            new PolicyStatement({ actions: ['ssm:GetParameter', 's3:GetObject'], resources: ['*'] }),
        );

        new Rule(this, `atco-code-checker-rule-${this.stage}`, {
            schedule: Schedule.cron({ minute: '0', hour: '6' }), // every day at 6am
            targets: [new LambdaFunction(atcoCodeCheckerFunction)],
        });
    }

    private addExporterLambdas(securityGroup: ISecurityGroup, vpc: IVpc, vpcSubnets: { subnets: ISubnet[] }) {
        const exporterFunction = new NodejsFunction(this, `exporter-${this.stage}`, {
            functionName: `exporter-${this.stage}`,
            entry: './lib/handler.ts',
            environment: {
                PRODUCTS_BUCKET: this.productsBucket.bucketName,
                MATCHING_DATA_BUCKET: this.matchingDataBucket.bucketName,
                RDS_HOST: Fn.importValue(`${this.stage}:RdsClusterInternalEndpoint`),
                STAGE: this.stage,
            },
            securityGroups: [securityGroup],
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

        this.addAlarmsToLambda(exporterFunction, `exporter-${this.stage}`, 300000);

        exporterFunction.addToRolePolicy(new PolicyStatement({ actions: ['ssm:GetParameter'], resources: ['*'] }));

        this.productsBucket.grantRead(exporterFunction);
        this.matchingDataBucket.grantWrite(exporterFunction);

        const netexBucket = Bucket.fromBucketName(this, 'netex-bucket', `fdbt-netex-data-${this.stage}`);
        const zipperFunction = new NodejsFunction(this, `zipper-${this.stage}`, {
            functionName: `zipper-${this.stage}`,
            entry: './lib/zipperHandler.ts',
            environment: {
                NETEX_BUCKET: netexBucket.bucketName,
                MATCHING_DATA_BUCKET: this.matchingDataBucket.bucketName,
                STAGE: this.stage,
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

        this.addAlarmsToLambda(zipperFunction, `zipper-${this.stage}`, 60000);
    }

    private addBastionTerminatorLambda() {
        const bastionTerminatorFunction = new NodejsFunction(this, `bastion-terminator-${this.stage}`, {
            functionName: `bastion-terminator-${this.stage}`,
            entry: './lib/bastionTerminator.ts',
            bundling: {
                sourceMap: true,
                sourceMapMode: SourceMapMode.DEFAULT,
            },
            timeout: Duration.minutes(1),
            logRetention: 180,
        });

        this.addAlarmsToLambda(bastionTerminatorFunction, `bastion-terminator-${this.stage}`, 30000);

        bastionTerminatorFunction.addToRolePolicy(
            new PolicyStatement({ actions: ['ec2:TerminateInstances', 'ec2:DescribeInstances'], resources: ['*'] }),
        );

        new Rule(this, `bastion-terminator-rule-${this.stage}`, {
            schedule: Schedule.cron({ weekDay: 'MON', minute: '0', hour: '6' }), // every monday at 6am
            targets: [new LambdaFunction(bastionTerminatorFunction)],
        });
    }

    private addReferenceDataLambdas(securityGroup: ISecurityGroup, vpc: IVpc, vpcSubnets: { subnets: ISubnet[] }) {
        const tableRenameFunction = new NodejsFunction(this, `table-rename-${this.stage}`, {
            functionName: `table-rename-${this.stage}`,
            entry: './lib/referenceData/tableRenameHandler.ts',
            environment: {
                RDS_HOST: Fn.importValue(`${this.stage}:RdsClusterInternalEndpoint`),
                STAGE: this.stage,
            },
            securityGroups: [securityGroup],
            vpc: vpc,
            vpcSubnets: vpcSubnets,
            bundling: {
                sourceMap: true,
                sourceMapMode: SourceMapMode.DEFAULT,
            },
            timeout: Duration.minutes(15),
            logRetention: 180,
        });

        this.addAlarmsToLambda(tableRenameFunction, `tableRenameFunction-${this.stage}`, 420000);

        tableRenameFunction.addToRolePolicy(new PolicyStatement({ actions: ['ssm:GetParameter'], resources: ['*'] }));

        new Rule(this, `table-rename-rule-${this.stage}`, {
            schedule: Schedule.cron({ minute: '30', hour: '5' }), // every day at 5:30am
            targets: [new LambdaFunction(tableRenameFunction)],
        });
    }

    private addAlarmsToLambda(lambdaFn: NodejsFunction, id: string, durationThreshold: number) {
        const alarmTopicArn = Fn.importValue(`${this.stage}:SlackAlertsTopicArn`);
        const alarmTopic = Topic.fromTopicArn(this, `${id}-alarm-topic-${this.stage}`, alarmTopicArn);
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
