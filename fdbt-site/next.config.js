const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
const withFonts = require('next-fonts');

const nextConfig = {
    target: 'server',
};

module.exports = withPlugins([[withFonts], [withImages], nextConfig]);
