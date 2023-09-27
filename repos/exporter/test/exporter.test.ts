import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as Exporter from '../lib/exporter-stack';
import { App } from 'aws-cdk-lib';

process.env.STAGE = 'dev';

test('Empty Stack', () => {
    const app = new App();

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
