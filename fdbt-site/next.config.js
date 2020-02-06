const withPlugins = require('next-compose-plugins');
const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');
const withImages = require('next-images');
const withFonts = require('next-fonts');

let assetPrefix = '';

switch (process.env.NODE_ENV) {
    case 'prod':
        assetPrefix = 'https://s3.eu-west-2.amazonaws.com/fdbt-prod-static-assets';
        break;
    case 'preprod':
        assetPrefix = 'https://s3.eu-west-2.amazonaws.com/fdbt-preprod-static-assets';
        break;
    case 'test':
        assetPrefix = 'https://s3.eu-west-2.amazonaws.com/fdbt-test-static-assets';
        break;
    default:
        assetPrefix = '';
}

const nextConfig = {
    assetPrefix,
    target: 'serverless',
    env: {
        NAPTAN_TABLE_NAME: 'dev-Stops',
        NOC_TABLE_NAME: 'dev-Operators',
        SERVICES_TABLE_NAME: 'dev-Services',
        TNDS_TABLE_NAME: 'dev-TNDS',
        AWS_REGION: 'eu-west-2',
    },
};

module.exports = withPlugins([
    [withSass],
    [withFonts, { assetPrefix }],
    [withImages, { assetPrefix }],
    [withCss],
    nextConfig,
]);
