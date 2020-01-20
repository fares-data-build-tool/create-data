import { Handler } from "aws-lambda";
import csvParse from "csv-parse/lib/sync";
import * as _ from "lodash";
import fs from "fs";
import path from "path";


export const s3hook: Handler = (event: any) => {
  console.log("==== This is my event object ====");
  console.log(JSON.stringify(event));
};

type ParsedData = NOCData;

interface NOCData {
  NOCCode: string,
  OperatorPublicName: string,
  OpId: number,
  PubNmId: number,
  mode: string,
  VOSA_PSVLicenseName: string,
  TTRteEnq: string,
  FareEnq: string,
  ComplEnq: string,
  Website: string
}
  

export function csvParser(csvData: string) {
  const parsedData: ParsedData[] = csvParse(csvData, {
    columns: true,
    relax_column_count: true,
    skip_empty_lines: true,
    delimiter: ","
  });
  return parsedData;
}

export function parseCsvData(pathname: string) {
  const data = fs.readFileSync(path.join(__dirname, pathname));
  const stringifiedData = data.toString();

  console.log(stringifiedData);

  const parsedCsvData = csvParser(stringifiedData);
  console.log("parsedCsvData is: ", parsedCsvData)
  return parsedCsvData;
}


const pathStart: any = "./../../../reference-data/NOC_Tables_2020-01-14-14-35-38/"
const parsedNOCTable = parseCsvData(pathStart + "NOCTable.csv");
const parsedNocLines = parseCsvData(pathStart + "NOCLines.csv");

const arr1 = parsedNOCTable;
const arr2 = parsedNocLines;