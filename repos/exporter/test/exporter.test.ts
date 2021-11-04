import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Exporter from '../lib/exporter-stack';

process.env.STAGE = 'dev';

test('Empty Stack', () => {
    const app = new cdk.App();

    // when
    const stack = new Exporter.ExporterStack(app, 'MyTestStack', {
        env: { account: '123456789012', region: 'eu-west-2' },
    });

    // then
    expectCDK(stack).to(
        matchTemplate(
            {
                Resources: {},
            },
            MatchStyle.SUPERSET,
        ),
    );
});
