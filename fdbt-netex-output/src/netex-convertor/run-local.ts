import parser from 'xml2json';
import fs from "fs";

/* 
This file can be used to check the csv parsing and writeBatchesToDynamo functionality.
It will run the code locally and not actually import data from S3 or push to DynamoDB.
To run the below, make sure you install 'ts-node'. You can then navigate to the directory
containing the run-local.ts file and run the command 'ts-node run-local.ts'.
The <PATH_TO_CSV_FILE> will need to be relative to the location of run-local.ts.
*/

const streamOutputToCommandLine = async () => {
  fs.readFile("./test.xml", {encoding: "utf8"},function(err, data) {
    const message = "Hello!"
    var json = JSON.parse(parser.toJson(data, {reversible: true}));
    console.log(json);
    json["PublicationDelivery"]["Description"] = message;
    console.log(json);
    var stringified = JSON.stringify(json);
    var xml = parser.toXml(stringified);
    fs.writeFile("test-updated.xml", xml, err => {
      
    }
    );   
  };
)};

streamOutputToCommandLine();
