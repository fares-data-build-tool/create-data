#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ExporterStack } from '../lib/exporter-stack';

const app = new cdk.App();
new ExporterStack(app, 'ExporterStack', {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
