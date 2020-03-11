const withPlugins = require('next-compose-plugins');
const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');
const withImages = require('next-images');
const withFonts = require('next-fonts');

const stage = process.env.STAGE || 'dev';

const nextConfig = {
    target: 'serverless',
    env: {
        NAPTAN_TABLE_NAME: `${stage}-Stops`,
        NAPTAN_TABLE_GSI: 'NaptanIndex',
        NOC_TABLE_NAME: `${stage}-Operators`,
        SERVICES_TABLE_NAME: `${stage}-Services`,
        TNDS_TABLE_NAME: `${stage}-TNDS`,
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        RAW_USER_DATA_BUCKET_NAME: `fdbt-raw-user-data-${stage}`,
        USER_DATA_BUCKET_NAME: `fdbt-user-data-${stage}`,
        MATCHING_DATA_BUCKET_NAME: `fdbt-matching-data-${stage}`,
    },
};

module.exports = withPlugins([[withSass], [withFonts], [withImages], [withCss], nextConfig]);
