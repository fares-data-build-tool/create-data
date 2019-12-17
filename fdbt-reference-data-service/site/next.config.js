const withPlugins = require('next-compose-plugins');
const withSass = require('@zeit/next-sass');
const withCss = require("@zeit/next-css");
const withImages = require('next-images');
 
module.exports = withPlugins([
  [withSass], [withCss], [withImages] , [{target: 'serverless'}]
]);
