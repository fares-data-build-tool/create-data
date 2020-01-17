import { Handler } from "aws-lambda";
import csvParse from "csv-parse/lib/sync";
import fs from "fs";
import path from "path";


export const s3hook: Handler = (event: any) => {
  console.log("==== This is my event object ====");
  console.log(JSON.stringify(event));
};

type ParsedData = NOCData;

interface NOCData {
    ATCOCode: string;
    NaptanCode: string;
    CommonName: string;
    Street: string;
    Indicator: string;
    IndicatorLang: string;
    Bearing: string;
    NptgLocalityCode: string;
    LocalityName: string;
    ParentLocalityName: string;
    LocalityCentre: number;
    GridType: string;
    Easting: number;
    Northing: number;
    Longitude: number;
    Latitude: number;
    StopType: string;
    BusStopType: string;
    TimingStatus: string;
  }
  

export function csvParser(csvData: string) {
  const parsedData: ParsedData[] = csvParse(csvData, {
    columns: true,
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
  return parsedCsvData;
}

const pathStart: any = "./../../../reference-data/NOC_Tables_2020-01-14-14-35-38/"
const parsedNOCTable = parseCsvData(pathStart + "NOCTable.csv");
const parsedNocLines = parseCsvData(pathStart + "NOCLines.csv");

const arr1 = parsedNOCTable;
const arr2 = parsedNocLines;