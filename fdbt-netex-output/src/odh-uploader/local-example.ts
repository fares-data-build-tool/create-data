/* eslint-disable no-plusplus */
import fs from 'fs';
import path from 'path';
import csvParse from 'csv-parse/lib/sync';

const streamOutputToCommandLine = (): any => {
    const csvParser = (stringifiedCsvData: string): any => {
        const parsedData = csvParse(stringifiedCsvData, {
            columns: true,
            delimiter: ',',
        });
        return parsedData;
    };
    const csvData = fs.readFileSync(path.join(__dirname, './Fare-Zone-Example.csv'));
    const csvStringifiedData = csvData.toString();
    const parsedcsvData = csvParser(csvStringifiedData);
    console.log({ parsedcsvData });

    const zoneName = parsedcsvData[0].FareZoneName;
    console.log({ zoneName });

    const naptanArray = parsedcsvData.map((csvRow: any) => (csvRow.NAPTAN));
    const atcoArray = parsedcsvData.map((csvRow: any) => (csvRow.ATCO));
    console.log({naptanArray});
    console.log({atcoArray});

    // for (let i = 0; i < parsedcsvData.length; i++) {
    //     const zoneName = parsedcsvData[i].FareZoneName;
    // }
};


streamOutputToCommandLine();
