import netexConvertorHandler from './handler';

const event = JSON.parse(process.argv.slice(2)[0]);

process.env.SNS_ALERTS_ARN = 'arn:aws:sns:us-east-1:000000000000:AlertsTopic';
process.env.STAGE = 'dev';

netexConvertorHandler(event)
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
