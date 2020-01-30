import { xmlParser, cleanParsedXmlData } from "./../tnds-uploader/handler";
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
  const data = fs.readFileSync(path.join(__dirname, "./../../../reference-data/TNDSV2.5/EA/ea_20-1A-A-y08-1.xml"));
  const stringifiedData = data.toString();

  const parsedXmlData = await xmlParser(stringifiedData);
  console.log(parsedXmlData)

  const cleanedXmlData = cleanParsedXmlData(parsedXmlData);
  console.log(cleanedXmlData);

};

streamOutputToCommandLine();
