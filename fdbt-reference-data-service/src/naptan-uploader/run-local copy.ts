import fs from 'fs';
import path from 'path';
import { xmlParser } from '../tnds-uploader/handler';

/* 
This file can be used to check the csv parsing and writeBatchesToDynamo functionality.
It will run the code locally and not actually import data from S3 or push to DynamoDB.
To run the below, make sure you install 'ts-node'. You can then navigate to the directory
containing the run-local.ts file and run the command 'ts-node run-local.ts'.
The <PATH_TO_CSV_FILE> will need to be relative to the location of run-local.ts.
*/

interface JourneyPatternSection {
    $: {
        id: string;
    };
    JourneyPatternTimingLink: {
        $: {
            id: string;
        };
        From: {
            $: {
                SequenceNumber: string;
            };
            Activity: string[];
            StopPointRef: string[];
            TimingStatus: string[];
        }[];
        To: {
            $: {
                SequenceNumber: string;
            };
            Activity: string[];
            StopPointRef: string[];
            TimingStatus: string[];
        }[];
        RouteLinkRef: string[];
        RunTime: string[];
    }[];
}

// const mapCommonNameToStopPoint = (stopPointObject: any, stopPoint: string): string => {
//     if (stopPointObject.hasOwnProperty(stopPoint)) { // eslint-disable-line no-prototype-builtins
//         return stopPointObject?.CommonName;
//     }
//     return '';
// };

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
        path.join(__dirname, './../../../../REAL_REF_DATA/TNDSV2.5/EA/ea_20-4-_-y08-1.xml'),
    );
    const xmlStringifiedData = xmlData.toString();
    const parsedXmlData = await xmlParser(xmlStringifiedData);
    const jsonifiedData = JSON.parse(parsedXmlData);

    const extractedStopPoints: any[] = jsonifiedData?.TransXChange?.StopPoints[0]?.AnnotatedStopPointRef;
    const stopPointsCollection: any[] = extractedStopPoints.map(stopPointItem => ({
        StopPointRef: stopPointItem?.StopPointRef[0],
        CommonName: stopPointItem?.CommonName[0],
    }));

    const journeyPatternSections: JourneyPatternSection[] =
        jsonifiedData?.TransXChange?.JourneyPatternSections[0]?.JourneyPatternSection;

    const mapCommonNameToStopPoint = (stopPoint: any, collectionOfStopPoints: any): any => {
        const mappedStopPoint = collectionOfStopPoints.find((stopPointItem: any) => stopPointItem.StopPointRef === stopPoint)
        return mappedStopPoint;
    }

    const createOrderedStopPointSet = (journeyPatternSection: any, collectionOfStopPoints: any): any => {
        const orderedListOfStops = journeyPatternSection.flatMap((journeyPatternTimingLink: any) => ([
            journeyPatternTimingLink.From[0].StopPointRef[0],
            journeyPatternTimingLink.To[0].StopPointRef[0],
        ]))
        const uniqueStops = [...new Set(orderedListOfStops)]
        const mappedArrayOfOrderedStopPoints = uniqueStops.map(stopPoint => mapCommonNameToStopPoint(stopPoint, collectionOfStopPoints))
        return mappedArrayOfOrderedStopPoints
    };

    const journeyPatternObjects = journeyPatternSections.map(journeyPatternSection => ({
        JouneryPatternRef: journeyPatternSection.$.id,
        OrderedStopPoints: createOrderedStopPointSet(journeyPatternSection.JourneyPatternTimingLink, stopPointsCollection),
    }));
    console.log(journeyPatternObjects[0]);

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
