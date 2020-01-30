import { testXml, isJSON } from "./test-data/test-data";
import {
  xmlParser,
  fetchDataFromS3AsString,
  formatDynamoWriteRequest,
  ParsedCsvData,
  fileExtensionGetter,
  tableChooser,
  removeFirstLineOfString,
  writeXmlToDynamo,
  cleanParsedXmlData,
  s3ObjectParameters,
  writeCsvBatchesToDynamo,
  setS3ObjectParams
} from "./handler";
import { csvParser } from "../naptan-uploader/handler";
let AWS = require("aws-sdk");
import * as mocks from "./test-data/test-data";

describe("fetchDataFromS3AsAString", () => {
  const mockS3GetObject = jest.fn();
  const s3Params: s3ObjectParameters = {
    Bucket: "thisIsMyBucket",
    Key: "andThisIsTheNameOfTheThing"
  };

  beforeEach(() => {
    mockS3GetObject.mockReset();

    AWS.S3 = jest.fn().mockImplementation(() => {
      return {
        getObject: mockS3GetObject
      };
    });

    mockS3GetObject.mockImplementation(() => ({
      promise() {
        return Promise.resolve({ Body: mocks.testCsv });
      }
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns a string", async () => {
    const fetchedData = await fetchDataFromS3AsString(s3Params);
    expect(fetchedData).toBe(mocks.testCsv);
  });

  it("calls get object from S3 using params provided", async () => {
    await fetchDataFromS3AsString(s3Params);
    expect(mockS3GetObject).toHaveBeenCalledWith(s3Params);
  });
});

describe("csvParser and xmlParsers", () => {
  it("parses CSV into JSON", () => {
    const returnedValue = csvParser(mocks.testCsv);
    expect(isJSON(returnedValue)).toBeTruthy;
  });

  it("parses XML into JSON", async () => {
    const result = await xmlParser(testXml);
    expect(isJSON(result)).toBeTruthy;
  });
});

describe("fileExtensionGetter", () => {
  it("returns a file extension", () => {
    const resultOne = fileExtensionGetter("thisIsAFileName.xml");
    const resultTwo = fileExtensionGetter("thisIsAFileName.csv");

    expect(resultOne).toBe("xml");
    expect(resultTwo).toBe("csv");
  });
});

describe("tableChooser", () => {
  it("sets the table name according to the file extension", () => {
    expect(() => {
      tableChooser("xml");
    }).toThrow(Error);
  });

  it("sets the table name according to the file extension", () => {
    process.env.SERVICES_TABLE_NAME = "TestServicesTable";
    process.env.TNDS_TABLE_NAME = "TestTndsTable";

    const xmlResult = tableChooser("xml");
    const csvResult = tableChooser("csv");

    expect(xmlResult).toBe(process.env.TNDS_TABLE_NAME);
    expect(csvResult).toBe(process.env.SERVICES_TABLE_NAME);
  });

  it("sets the table name according to the file extension", () => {
    process.env.SERVICES_TABLE_NAME = "TestServicesTable";
    process.env.TNDS_TABLE_NAME = "TestTndsTable";

    expect(() => {
      tableChooser("pdf");
    }).toThrow(Error);
  });
});

describe("xmlFirstLineRemover", () => {
  it("removes the first line of a string", () => {
    const result = removeFirstLineOfString("A\n" + "B\n" + "C\n" + "D\n");
    expect(result).toBe("B\n" + "C\n" + "D\n");
  });
});

describe("XML to dynamo writer", () => {
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

  it("sends a put request to dynamo", async () => {
    const parsedData = cleanParsedXmlData(await xmlParser(testXml));

    writeXmlToDynamo({ tableName: "tableName", parsedXmlLines: parsedData });

    expect(mockDynamoPut).toBeCalled();
  });
});

describe("cleanParsedXmlData", () => {
  it("changes the XML to be of the format required", async () => {
    const xmlToBeCleaned = await xmlParser(testXml);

    const cleanedXml = cleanParsedXmlData(xmlToBeCleaned);
    expect(cleanedXml).toEqual(mocks.mockCleanedXmlData);
  });
});

it("returns cleanedXmlData which contains the right OperatorShortNames", async () => {
  const expectedOperatorShortNames = ["Dews Coaches", "Dannys Coaches"];
  const xmlToBeCleaned = await xmlParser(testXml);
  const cleanedXml = cleanParsedXmlData(xmlToBeCleaned);
  const operatorShortNames = cleanedXml["OperatorShortName"];
  expect.assertions(2);
  expect(operatorShortNames).toHaveLength(2);
  expect(operatorShortNames).toEqual(expectedOperatorShortNames);
});

it("returns cleanedXmlData which contains the right StopPointRefs and CommonNames", async () => {
  const expectedStopPoints = [
    { StopPointRef: "0500SBARH011", CommonName: "Superstore" },
    { StopPointRef: "0500HFENS007", CommonName: "Rookery Way" },
    { StopPointRef: "0500HFENS006", CommonName: "Swan Road" },
    { StopPointRef: "0500HFENS003", CommonName: "Chequer Street" },
    { StopPointRef: "0500SSWAV013", CommonName: "The Farm" }
  ];
  const xmlToBeCleaned = await xmlParser(testXml);
  const cleanedXml = cleanParsedXmlData(xmlToBeCleaned);
  const stopPoints = cleanedXml["StopPoints"];
  expect.assertions(2);
  expect(stopPoints).toHaveLength(5);
  expect(stopPoints).toEqual(expectedStopPoints);
});

describe("formatDynamoWriteRequest", () => {
  it("should return data in correct format as a DynamoDB WriteRequest", () => {
    const batch: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(
      1,
      mocks.mockServicesData
    );
    const arrayOfBatches: AWS.DynamoDB.WriteRequest[][] = [];
    arrayOfBatches.push(batch);
    const testArrayOfItems: ParsedCsvData[] = mocks.createArray(
      1,
      mocks.mockServicesData
    );
    const result = formatDynamoWriteRequest(testArrayOfItems);
    expect(result).toEqual(arrayOfBatches);
  });

  it("should return an array of <25 when given <25 items", () => {
    const batch: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(
      23,
      mocks.mockServicesData
    );
    const arrayOfBatches: AWS.DynamoDB.WriteRequest[][] = [];
    arrayOfBatches.push(batch);
    const testArrayOfItems: ParsedCsvData[] = mocks.createArray(
      23,
      mocks.mockServicesData
    );
    const result = formatDynamoWriteRequest(testArrayOfItems);
    expect(result).toEqual(arrayOfBatches);
  });

  it("should return an array of >25 when given >25 items", () => {
    const batch1: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(
      25,
      mocks.mockServicesData
    );
    const batch2: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(
      7,
      mocks.mockServicesData
    );
    const arrayOfBatches: AWS.DynamoDB.WriteRequest[][] = [];
    arrayOfBatches.push(batch1, batch2);
    const testArrayOfItems: ParsedCsvData[] = mocks.createArray(
      32,
      mocks.mockServicesData
    );
    const result = formatDynamoWriteRequest(testArrayOfItems);
    expect(result).toEqual(arrayOfBatches);
  });
});

describe("writeCsvBatchesToDynamo", () => {
  // Arrange
  const tableName = "mockTableName";
  const parsedCsvLines: ParsedCsvData[] = [mocks.mockServicesData];
  const mockDynamoDbBatchWrite = jest.fn();

  beforeEach(() => {
    mockDynamoDbBatchWrite.mockReset();
    (AWS.DynamoDB.DocumentClient as any) = jest.fn(() => {
      return { batchWrite: mockDynamoDbBatchWrite };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("calls dynamodb.batchwrite() only once for a batch size of 25 or less", async () => {
    // Arrange
    mockDynamoDbBatchWrite.mockImplementation(() => ({
      promise() {
        return Promise.resolve({});
      }
    }));
    // Act
    await writeCsvBatchesToDynamo({ parsedCsvLines, tableName });
    // Assert
    expect(mockDynamoDbBatchWrite).toHaveBeenCalledTimes(1);
  });

  it("calls dynamodb.batchwrite() more than once for a batch size greater than 25", async () => {
    // Arrange
    mockDynamoDbBatchWrite.mockImplementation(() => ({
      promise() {
        return Promise.resolve({});
      }
    }));
    const parsedCsvLines = mocks.createArray(26, mocks.mockServicesData);
    // Act
    await writeCsvBatchesToDynamo({ parsedCsvLines, tableName });
    // Assert
    expect(mockDynamoDbBatchWrite).toHaveBeenCalledTimes(2);
  });

  it("throws an error if it cannot write to DynamoDB", async () => {
    // Arrange
    const parsedCsvLines = mocks.createArray(2, mocks.mockServicesData);
    mockDynamoDbBatchWrite.mockImplementation(() => ({
      promise() {
        return Promise.reject({});
      }
    }));
    // Act & Assert
    expect.assertions(1);
    await expect(
      writeCsvBatchesToDynamo({ parsedCsvLines, tableName })
    ).rejects.toThrow("Could not write batch to DynamoDB");
  });
});

describe("setS3ObjectParams", () => {
  // Arrange
  const bucketName = "fdbt-test-naptan-s3-bucket";
  const fileName = "fdbt-test-naptan.csv";
  const s3Event = mocks.mockS3Event(bucketName, fileName);

  it("sets s3BucketName from S3Event", () => {
    // Act
    const s3ObjectParameters = setS3ObjectParams(s3Event);
    // Assert
    expect(s3ObjectParameters.Bucket).toEqual(bucketName);
  });

  it("sets S3FileName from S3Event", () => {
    // Act
    const s3ObjectParameters = setS3ObjectParams(s3Event);
    // Assert
    expect(s3ObjectParameters.Key).toEqual(fileName);
  });

  it("removes spaces and unicode non-ASCII characters in the S3FileName", () => {
    // Arrange
    const fileName = "fdbt%2Ftest+%3A+naptan.csv";
    const S3Event = mocks.mockS3Event(bucketName, fileName);
    const params = {
      Bucket: bucketName,
      Key: "fdbt/test : naptan.csv"
    };
    // Act
    const s3ObjectParameters = setS3ObjectParams(S3Event);
    // Arrange
    expect(s3ObjectParameters).toEqual(params);
  });
});
