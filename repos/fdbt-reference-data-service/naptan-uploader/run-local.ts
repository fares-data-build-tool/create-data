import { csvParser, formatDynamoWriteRequest, writeCsvBatchesToDynamo } from "./../tnds-uploader/handler";
import fs from "fs";
import path from "path";

/* 
This file can be used to check the csv parsing and writeBatchesToDynamo functionality.
It will run the code locally and not actually import data from S3 or push to DynamoDB.
To run the below, make sure you install 'ts-node'. You can then navigate to the directory
containing the run-local.ts file and run the command 'ts-node run-local.ts'.
The <PATH_TO_CSV_FILE> will need to be relative to the location of run-local.ts.
*/

const streamOutputToCommandLine = async () => {
  const data = fs.readFileSync(path.join(__dirname, "./../tnds-uploader/test-data/data.csv"));
  const stringifiedData = data.toString();

  const parsedCsvData = await csvParser(stringifiedData);
  console.log(parsedCsvData)
  console.log("-----------------------------------------")
  const dynamoWriteRequestBatches = formatDynamoWriteRequest(parsedCsvData);

};

streamOutputToCommandLine();
