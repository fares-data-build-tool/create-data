import fs from 'fs';
import path from 'path';
import { xmlParser, cleanParsedXmlData } from '../tnds-uploader/handler';

/* 
This file can be used to check the csv parsing and writeBatchesToDynamo functionality.
It will run the code locally and not actually import data from S3 or push to DynamoDB.
To run the below, make sure you install 'ts-node'. You can then navigate to the directory
containing the run-local.ts file and run the command 'ts-node run-local.ts'.
The <PATH_TO_CSV_FILE> will need to be relative to the location of run-local.ts.
*/

const streamOutputToCommandLine = async () => {
    // NAPTAN UPLOADER

    // NOC UPLOADER

    // const nocLinesData = fs.readFileSync(path.join(__dirname, "./../noc-uploader/test-data/mock-data/NOCLines.csv"));
    // const nocLineStringifiedData = nocLinesData.toString();

    // const nocTablesData = fs.readFileSync(path.join(__dirname, "./../noc-uploader/test-data/mock-data/NOCTable.csv"));
    // const nocTableStringifiedData = nocTablesData.toString();

    // const publicNameData = fs.readFileSync(path.join(__dirname, "./../noc-uploader/test-data/mock-data/PublicName.csv"));
    // const publicNameStringifiedData = publicNameData.toString();

    // const nocLineParsedCsv = csvParser(nocLineStringifiedData);
    // const nocTableParsedCsv = csvParser(nocTableStringifiedData);
    // const publicNameParsedCsv = csvParser(
    //     publicNameStringifiedData
    // );

    // const mergedArray = mergeArrayObjects(
    //     nocLineParsedCsv,
    //     nocTableParsedCsv,
    //     publicNameParsedCsv
    // );
    // const writeRequestBatches = formatDynamoWriteRequest(mergedArray);
    // console.log(writeRequestBatches[0][0])

    // TNDS UPLOADER

    const xmlData = fs.readFileSync(
        path.join(__dirname, './../../../../REAL_REF_DATA/TNDS/EA/ea_20-5C-_-y08-1.xml'),
    );
    const xmlStringifiedData = xmlData.toString();
    const parsedXmlData = await xmlParser(xmlStringifiedData);
    
    const tndsObject = cleanParsedXmlData(parsedXmlData);
    console.log({tndsObject})

    // const csvData = fs.readFileSync(path.join(__dirname, "./../../../../REAL_REF_DATA/TNDSV2.5/servicereport.csv"));
    // const csvStringifiedData = csvData.toString();
    // const parsedcsvData = csvParser(csvStringifiedData);

    // let count = 0;
    // for (let i = 0; i < parsedcsvData.length; i+=1) {
    //     const item = parsedcsvData[i]
    //     if (!item.RowId || !item.NationalOperatorCode) {
    //         console.log(`Item is missing primary/sort keys! item is: ${item}, item.RowId is: ${item.RowId}, item.NationalOperatorCode is: ${item.NationalOperatorCode}`)
    //         count+=1
    //     }
    // }
    // console.log({count})
};

streamOutputToCommandLine();
