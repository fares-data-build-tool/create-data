const withImages = require('next-images');

/** @type {import('next').NextConfig} */
const nextConfig = withImages({
    target: "server",
    poweredByHeader: false,
    images: {
        disableStaticImages: true
    },
    webpack: (config, { isServer }) => {
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

        config.resolve = { ...config.resolve, symlinks: false };

        if (!isServer) {
            config.resolve.fallback.fs = false;
        }

        return config;
    },
});
  
module.exports = nextConfig

