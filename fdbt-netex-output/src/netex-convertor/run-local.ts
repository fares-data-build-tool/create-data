import matchingdata from './matchingdata';

/* eslint-disable no-plusplus */
/* 
This file can be used to check the csv parsing and writeBatchesToDynamo functionality.
It will run the code locally and not actually import data from S3 or push to DynamoDB.
To run the below, make sure you install 'ts-node'. You can then navigate to the directory
containing the run-local.ts file and run the command 'ts-node run-local.ts'.
The <PATH_TO_CSV_FILE> will need to be relative to the location of run-local.ts.
*/

interface Stop {
  stopName: string;
  naptanCode: string;
  atcoCode: string;
  localityCode: string;
  localityName: string;
  qualifierName: string;
}

// const testArr: string[] = ['stop1', 'stop2', 'stop3', 'stop4', 'stop5', 'stop6', 'stop7'];
const stops: Stop[] = matchingdata.fareZones.flatMap(zone => zone.stops);


export default function streamOutputToCommandLine(arr: Stop[]): string [] {
    const newArr: string[] = [];
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            const firstElt = arr[i].stopName;
            const secondElt = arr[j].stopName;
            newArr.push(firstElt, secondElt);
        }
    }
    console.log(newArr);
    return newArr;
}

streamOutputToCommandLine(stops);
