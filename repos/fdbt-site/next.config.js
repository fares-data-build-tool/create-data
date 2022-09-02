const nextConfig = {
    poweredByHeader: false,
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
            config.resolve = {
                ...config.resolve,
                fallback: {
                    fs: 'empty'
                }
            };
        }

        return config;
    },
};


module.exports = () => {
    const plugins = [] // any plugins we might add
    return plugins.reduce((acc, next) => next(acc), nextConfig);
};