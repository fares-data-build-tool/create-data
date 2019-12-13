# fares-data-build-tool

# Get Serverless to generate
`serverless create --template aws-nodejs --path <FOLDER_NAME>`
e.g.
`serverless create --template aws-nodejs --path odh-uploader`

# How trigger a function - run locally once and kill
`serverless invoke local --function function_name`


# How to convert my js lamnda to Typescript

## Initialise npm package manager for the JavaScript programming language. 
`npm init`

press enter for ALL prompt it gives you.

npm init will give you a package.json which you can then use to install librarys/modules available on the npm registries.

## Install serverless-plugin-typescript to allow use to run this locally
`npm i serverless-plugin-typescript --save-dev`
This will create a tsconfig automatically with zero configurations needed from you.
This is sufficient for backend lambdas which have no UI components or webpack config.

## Add this to the serverless.yml
Make sure you add this to the serverless yaml in the plugins section
```
plugins:
  - serverless-plugin-typescript
```
this will instruct serverless.yml to use this plugin when compiling your typescript lambda and modules.

## Install types for aws lambda and node
`npm install --save @types/aws-lambda @types/node typescript`

You may need these defaulted types, so please install just in case.

## Add typescript to the package.json so CICD tools can run npm build during a pipeline job
```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "tsc"
  },
```

## Rename the handler.js
Rename the handler.js to handler.ts

## Finally rewrite your handler.ts
Change your handler.ts to include types from 'aws-lambda' module such as Handler, Context & Callback.

`import { Handler, Context, Callback } from 'aws-lambda';

Please note that typescript uses import notation.



# How to add S3 buckets and events to serverless.yml
Please add the s3 function name and handler method name, with the bucket name and s3 event into the functions section of the serverless.yml.
See below for an example
```
functions:
  s3hook:
    handler: handler.s3hook
    events:
      - s3: fdbt-test-netex-data
        event: s3:ObjectCreated:*
```

# How to locally test S3 buckets and events to serverless.yml

## Install serverless-s3-local to add s3 local
`npm i serverless-s3-local --save-dev`


## Add this to the serverless.yml
Make sure you add this to the serverless yaml in the plugins section
```
plugins:
  - serverless-s3-local
```
this will instruct serverless.yml to use this plugin when compiling your typescript lambda and modules.


## setup s3local in your ~/.aws/credentials
Add the following to your ~/.aws/credentials

```
[s3local]
aws_access_key_id = S3RVER
aws_secret_access_key = S3RVER
```

## Setup s3local in your ~/.aws/config
Add the following to your ~/.aws/config
```
[profile s3local]
```

## Install serverless-offline to add s3 local
`npm i serverless-offline --save-dev`


## Add this to the serverless.yml
Make sure you add this to the serverless yaml in the plugins section
```
plugins:
  - serverless-offline
```
this will instruct serverless.yml to use this plugin when compiling your typescript lambda and modules.

Serverless offline must ALWAYS be last.


## How run serverless offline (aka run locally and keep it up until I manually cancel the process)
`export SLS_DEBUG='*' && serverless offline`

Please check the log output to ensure that port 4569 (the port which will be used to trigger an s3 event) is opened.

## Create a data.csv
create a file called data.csv and put some data into it.

## How to push data to your s3 serverless offline
In a seperate command prompt window run the following AWS command to put your data.csv into the serverless-offline bucket. This will trigger the lambda and run the code.

`aws --endpoint http://localhost:4569 s3api put-object --bucket <BUCKET_NAME> --key <FILENAME.EXTENSION> --body <FILE_CONTENT> --profile s3local`

e.g.

`aws --endpoint http://localhost:4569 s3api put-object --bucket fdbt-test-netex-data --key data.csv --body data.csv --profile s3local`


# How to install TSConfig and Jest for Unit Tests

## Install Typescript
npm install -g typescript

## config tsconfig.json
tsc --init

## Install the following dependancies
npm install --save-dev jest @types/jest ts-jest 

## config the ts-jest config
npx ts-jest config:init

## Add typescript to the package.json so CICD tools can run npm build during a pipeline job
```
  "scripts": {
    "build": "tsc",
    "test": "jest"
  },
```

## run test
run `npm run test`

  # How to deploy to REAL AWS
`export SLS_DEBUG='*' && serverless deploy --aws-profile tfn-test -v --stage test`