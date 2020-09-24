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
- You should now be able to navigate the site without authenticating

## Running ClamAV virus scanning tool locally

There are two pages on the fdbt site which accept file uploads. Upon file upload, the site will run the ClamAV virus scanning tool (see [https://www.npmjs.com/package/clamscan](https://www.npmjs.com/package/clamscan) for more info) to validate that the uploaded file does no contain any viruses. When running the site locally, the ClamAV virus scanning tool will NOT run by default. If virus scanning is enabled, there are a couple of steps required to get set up and allow the tool to run. The below steps detail how to get ClamAV set up on MacOS:

- The easiest way to get the ClamAV package is by running 'brew install clamav'
- You will then need to create a 'freshclam.conf' file. This file will allow you to obtain a copy of the ClamAV databases. The file should be added to '/usr/local/etc/clamav/freshclam.conf' and should contain the following:
    'Database Mirror database.clamav.net'
- You can then run 'freshclam -v' to download the ClamAV databases.
- Next, you will need to create a 'clamd.conf' file. This file should be added to '/usr/local/etc/clamav/clamd.conf' and should contain the following:
    '# /usr/local/var/run/clamav'
- Finally, you will need to ensure the socket directory exists by running 'mkdir /usr/local/var/run/clamav'.
- You should now be able to run 'clamdscan' to run the virus scanning tool. Pointing the tool to a file will run the ClamAV virus scanning tool against the file.

Once set up, and with the site running locally, the file upload pages can now successfully run the virus scanning tool. The site contains config which will point to the local clamdscan binary that has been set up above.
