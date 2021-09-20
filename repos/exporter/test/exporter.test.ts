import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Exporter from '../lib/exporter-stack';

process.env.STAGE = 'dev';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Exporter.ExporterStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(
        matchTemplate(
            {
                Resources: {},
            },
            MatchStyle.SUPERSET,
        ),
    );
});
