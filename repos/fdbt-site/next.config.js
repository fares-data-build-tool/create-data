const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
const { Amplify } = require('@aws-amplify/core');

const nextConfig = {
    target: 'server',
    poweredByHeader: false,
    webpack: config => {
        config.module.rules.push({
            test: /\.(pdf|csv)$/,
            use: {
                loader: 'file-loader',
                options: {
                    publicPath: '/_next/static/files/',
                    outputPath: '../static/files/',
                    name: '[name]-[contentHash:8].[ext]',
                    esModule: false,
                },
            },
        });

        const originalEntry = config.entry;
        config.entry = async () => {
            const entries = await originalEntry();
            Amplify.configure({
                Auth: {
                    region: 'eu-west-2',
                    userPoolId: process.env.FDBT_USER_POOL_ID,
                    userPoolWebClientId: process.env.FDBT_USER_POOL_CLIENT_ID,
                },
            });
            return entries;
        };

        return config;
    },
};

module.exports = withPlugins([[withImages]], nextConfig);
