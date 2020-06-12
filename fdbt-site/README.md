# Fares Data Build Tool Site

[![CircleCI](https://circleci.com/gh/fares-data-build-tool/fdbt-site.svg?style=svg)](https://circleci.com/gh/fares-data-build-tool/fdbt-site)

This is the main site for the Fares Data Build Tool. It is built using Next.js and deployed into AWS Fargate.
The site follows the gov.uk design system using govuk-frontend for styling.

## Running locally

To run the site locally, checkout the [fdbt-dev](https://github.com/fares-data-build-tool/fdbt-dev) repo and follow the instructions to run the site within docker. The site can be ran directly but requires LocalStack and MySQL which are also brought up by the dev repo scripts.

## Assets

All assets should be placed into an appropriate folder in `src/assets` and imported into the component they need to be used in.

## Disable Authentication

The site runs middleware to require an auth session against AWS Cognito, if you want to disable this for testing purposes you will need to do the following:

- If NODE_ENV is not 'development', you will need to set the environment variable `ALLOW_DISABLE_AUTH` to be `'1'`. If on the development env, you do not need to set this.
- Hit the homepage with the query string `?disableAuth=true` appended to the URL
- You should now be able to navbigate the site without authenticating
