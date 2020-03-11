const withPlugins = require('next-compose-plugins');
const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');
const withImages = require('next-images');
const withFonts = require('next-fonts');

const nextConfig = {
    target: 'server',
};

module.exports = withPlugins([[withSass], [withFonts], [withImages], [withCss], nextConfig]);
