import { testXml, isJSON } from './helperMethods';
import { xmlParser, fetchDataFromS3AsString, servicesDynamoDBData, ParsedCsvData, fileExtensionGetter, tableChooser, removeFirstLineOfString, writeXmlToDynamo, cleanParsedXmlData } from '../../tnds-uploader/handler';
import { csvParser } from '../../naptan-uploader/handler';
let AWS = require('aws-sdk');
let { csvParse } = require('csv-parse/lib/sync');
const { testCsv } = require('../test/helperMethods');
const { s3Params } = require('../test/helperMethods');


describe('fetchDataFromS3AsAString', () => {
    const mockS3GetObject = jest.fn();

    beforeEach(() => {
        mockS3GetObject.mockReset();

        AWS.S3 = jest.fn().mockImplementation(() => {
            return {
                getObject: mockS3GetObject
            }
        });

        mockS3GetObject.mockImplementation(() => ({
            promise() {
                return Promise.resolve({ Body: testCsv })
            }
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('returns a string', async () => {
        const fetchedData = await fetchDataFromS3AsString(s3Params);
        expect(fetchedData).toBe(testCsv);
    })

    it('calls get object from S3 using params provided', async () => {
        await fetchDataFromS3AsString(s3Params);
        expect(mockS3GetObject).toHaveBeenCalledWith(s3Params);
    })
})

describe('csvParser and xmlParsers', () => {

    it('parses CSV into JSON', () => {
        const returnedValue = csvParser(testCsv);
        expect(isJSON(returnedValue)).toBeTruthy;
    })


    it('parses XML into JSON', async () => {
        const result = await xmlParser(testXml);
        expect(isJSON(result)).toBeTruthy;
    })
})

describe('fileExtensionGetter', () => {

    it('returns a file extension', () => {
        const resultOne = fileExtensionGetter('thisIsAFileName.xml');
        const resultTwo = fileExtensionGetter('thisIsAFileName.csv');

        expect(resultOne).toBe('xml');
        expect(resultTwo).toBe('csv');
    })
})

describe('tableChooser', () => {

    it('sets the table name according to the file extension', () => {
        expect(() => {
            tableChooser("xml")
        }).toThrow(Error)
    })

    it('sets the table name according to the file extension', () => {

        process.env.SERVICES_TABLE_NAME = "TestServicesTable"
        process.env.TNDS_TABLE_NAME = "TestTndsTable"

        const xmlResult = tableChooser("xml");
        const csvResult = tableChooser("csv");

        expect(xmlResult).toBe(process.env.TNDS_TABLE_NAME);
        expect(csvResult).toBe(process.env.SERVICES_TABLE_NAME);

    })

    it('sets the table name according to the file extension', () => {
        process.env.SERVICES_TABLE_NAME = "TestServicesTable"
        process.env.TNDS_TABLE_NAME = "TestTndsTable"

        expect(() => {
            tableChooser("pdf")
        }).toThrow(Error)
    })

})

describe('xmlFirstLineRemover', () => {
    it('removes the first line of a string', () => {
        const result = removeFirstLineOfString("A\n" + "B\n" + "C\n" + "D\n");
        expect(result).toBe("B\n" + "C\n" + "D\n");
    })
})

describe('XML to dynamo writer', () => {
    const mockDynamoPut = jest.fn();

    beforeEach(() => {
        mockDynamoPut.mockReset();
        (AWS.DynamoDB.DocumentClient as any) = jest.fn(() => {
            return { put: mockDynamoPut };
        });
        mockDynamoPut.mockImplementation(() => ({
            promise() {
                return Promise.resolve({});
            }
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('sends a put request to dynamo', async () => {
        const parsedData = cleanParsedXmlData(await xmlParser(testXml));

        writeXmlToDynamo({ tableName: "tableName", parsedXmlLines: parsedData });

        expect(mockDynamoPut).toBeCalled();
    })
})

describe('XML data cleaner', () => {
    it('changes the XML to be of the format required', async () => {

        const xmlToBeCleaned = await xmlParser(testXml);

        const cleanedXml = cleanParsedXmlData(xmlToBeCleaned);

        expect(cleanedXml.FileName).toContain("SVRYHAO999"+"_");
        expect(!!cleanedXml.Data && cleanedXml.Data).toBe(xmlToBeCleaned);
    })
})


