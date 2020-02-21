# Fares Data Build Tool Site

[![CircleCI](https://circleci.com/bb/infinityworksconsulting/fdbt-site.svg?style=svg)](https://circleci.com/bb/infinityworksconsulting/fdbt-site)

## Requirements

-   Node.js 12+
-   Localstack CLI
-   AWS CLI
-   Python 3 / Pip
-   Docker

## Installing localstack

-   To install localstack, you will need pip installed first, then you can run `pip install localstack`
-   To test it is working make sure docker is running then run `localstack`
    -- By default, localstack will try and mount in a `/private` directory into the docker container, if this is failing, you will need to navigate to Docker for Mac > Preferences > File Sharing and add in `/private` as a directory

## Running locally

-   The site depends on both DynamoDB and S3 which are ran locally using serverless-dynamodb-local and localstack respectively
-   In order to start dynamo locally navigate to the `fdbt-reference-data-service` and run `make run-dynamodb-local`, this will start dynamo and seed it with some test data
-   After that you should be able to run `make` in the root of this directory to start localstack and the site together

## Deploy your version onto AWS

-   Navigate to the `deploy/dev` folder and copy `serverless.yml.example` into a new file called `serverless.yml`.
-   Replace all instances of `${INITIALS}` with your initials eg. lj
-   In the root folder, now run `make deploy-dev STAGE=${STAGE}` where stage will need to match the stage that your desired DynamoDB tables have been deployed with.
