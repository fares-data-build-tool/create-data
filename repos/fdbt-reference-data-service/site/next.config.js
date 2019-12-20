const withPlugins = require('next-compose-plugins');
const withSass = require('@zeit/next-sass');
const withCss = require("@zeit/next-css");
const withImages = require('next-images');
const withFonts = require('next-fonts');

const assetPrefix = process.env.NODE_ENV == "prod" ? "https://s3.eu-west-2.amazonaws.com/fdbt-prod-static-assets" :
process.env.NODE_ENV == "preprod" ? "https://s3.eu-west-2.amazonaws.com/fdbt-preprod-static-assets" :
process.env.NODE_ENV == "test" ? "https://s3.eu-west-2.amazonaws.com/fdbt-test-static-assets" : "" ;

const nextConfig = {
  assetPrefix: assetPrefix,
  target: 'serverless'
};

module.exports = withPlugins([
  [withSass],[withFonts, {assetPrefix} ],[withImages, { assetPrefix }], [withCss],  nextConfig
]);
