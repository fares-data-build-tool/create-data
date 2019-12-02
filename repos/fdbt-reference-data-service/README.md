# fares-data-build-tool

## Creating a Serverless template

- To install the [Serverless](https://serverless.com/) application framework, run:

```
npm install -g serverless
```

- To create a serverless template using the serverless application framework, run:

```
serverless create --template aws-nodejs --path <FOLDER_NAME>
```

This will create a directory with the name <FOLDER_NAME> which contains a .gitignore, handler.js and serverless.yml file for a Node.js serverless template for AWS.
