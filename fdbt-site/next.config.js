const withPlugins = require('next-compose-plugins');
const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');
const withImages = require('next-images');
const withFonts = require('next-fonts');

let assetPrefix = '';

switch (process.env.NODE_ENV) {
    case 'production':
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
};

module.exports = withPlugins([
    [withSass],
    [withFonts, { assetPrefix }],
    [withImages, { assetPrefix }],
    [withCss],
    nextConfig,
]);
