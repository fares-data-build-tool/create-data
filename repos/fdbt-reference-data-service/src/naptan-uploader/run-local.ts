import fs from "fs";
import path from "path";
import { csvParser, mergeArrayObjects, formatDynamoWriteRequest } from "../noc-uploader/handler";

/* 
This file can be used to check the csv parsing and writeBatchesToDynamo functionality.
It will run the code locally and not actually import data from S3 or push to DynamoDB.
To run the below, make sure you install 'ts-node'. You can then navigate to the directory
containing the run-local.ts file and run the command 'ts-node run-local.ts'.
The <PATH_TO_CSV_FILE> will need to be relative to the location of run-local.ts.
*/

const streamOutputToCommandLine = async () => {
    const nocLinesData = fs.readFileSync(path.join(__dirname, "./../noc-uploader/test-data/nocLines.csv"));
    const nocLineStringifiedData = nocLinesData.toString();

    const nocTablesData = fs.readFileSync(path.join(__dirname, "./../noc-uploader/test-data/nocTables.csv"));
    const nocTableStringifiedData = nocTablesData.toString();

    const publicNameData = fs.readFileSync(path.join(__dirname, "./../noc-uploader/test-data/publicName.csv"));
    const publicNameStringifiedData = publicNameData.toString();
  
    const nocLineParsedCsv = csvParser(nocLineStringifiedData);
    const nocTableParsedCsv = csvParser(nocTableStringifiedData);
    const publicNameParsedCsv = csvParser(
        publicNameStringifiedData
    );

    const mergedArray = mergeArrayObjects(
        nocLineParsedCsv,
        nocTableParsedCsv,
        publicNameParsedCsv
    );
    const writeRequestBatches = formatDynamoWriteRequest(mergedArray);
    console.log(writeRequestBatches[0][0])
};

streamOutputToCommandLine();