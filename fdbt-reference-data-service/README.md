# Fares Data Build Tool Reference Data Service

[![CircleCI](https://circleci.com/gh/fares-data-build-tool/fdbt-reference-data-service.svg?style=svg)](https://circleci.com/gh/fares-data-build-tool/fdbt-reference-data-service)

Code for the lambdas responible for retrieving the reference data for the Fares Data Build Tool and uploading it to a MySQL Database. This includes NaPTAN, NOC, TNDS and BODS data.

The code is separated into Retrievers and Uploaders.

## Retrievers Description

Python lambdas which are triggered by a CloudWatch Event Cron schedule. The lamdas will retrieve the data from various sources either by HTTP (NaPTAN, NOC, BODS) or by FTP (TNDS), unzip it, and then store the data in S3. Due to the size of the TNDS data set, the unzippng process has been split out into its own Lambda which triggers after the data has been retrieved.

## Uploaders Description

Python lambdas which are triggered after the retrievers have stored the reference data in S3

To import CSV data, the Lambdas run a SQL import script which uses a feature of RDS Aurora to import data directly from S3 into the database, see [here for details](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Integrating.LoadFromS3.html).

To import TransXChange data, the Lambda first parses the XML and then imports the data as necessary into the database.

## Deploying

### Retrievers

In the root directory, run:

```bash
cd src/retrievers
sls deploy --stage={STAGE_TO_DEPLOY_TO}
```

### Uploaders

Navigate to the `serverless.yml` in `src/uploaders/handlers/` and update the custom parameter `dockerizePip` to be `true`, this will allow Serverless to build the dependencies using docker to prevent issues when the code runs in AWS.

After this, in the root directory, run the following:

```bash
cd src/uploaders/handlers
npm install
sls deploy --stage={STAGE_TO_DEPLOY_TO}
```

## Testing

Install the required dependencies for the tests:

```bash
cd ${FDBT_ROOT}/repos/fdbt-reference-data-service/src/uploaders
pip install -r requirements.test.txt
```

Run the tests:

```bash
cd ${FDBT_ROOT}/repos/fdbt-reference-data-service/src/uploaders
python3 -m pytest tests/
```
