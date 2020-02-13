import omitEmpty from 'omit-empty';
import { S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';
import csvParse from 'csv-parse/lib/sync';
import { WriteRequest } from 'aws-sdk/clients/dynamodb';
import { parseString } from 'xml2js';

export type ParsedXmlData = TndsDynamoDBData;
export type ParsedCsvData = ServicesDynamoDBData;

interface ExtractedDataObject {
    extractedFileName: string;
    extractedLineName: string;
    extractedDescription: string;
    extractedStartDate: string;
    extractedOperators: ExtractedOperator[];
    extractedStopPoints: ExtractedStopPoint[];
    journeyPatternSections: JourneyPatternSection[];
    vehicleJourneys: ExtractedVehicleJourney[];
}

interface ExtractedStopPoint {
    StopPointRef: string[];
    CommonName: string[];
    Indicator: string[];
    LocalityName: string[];
    LocalityQualifier: string[];
}

interface ExtractedOperator {
    $: {};
    NationalOperatorCode: string[];
    OperatorCode: string[];
    OperatorShortName: string[];
    OperatorNameOnLicence: string[];
    TradingName: string[];
}

interface ExtractedVehicleJourney {
    PrivateCode: string[];
    VehicleJourneyCode: string[];
    ServiceRef: string[];
    LineRef: string[];
    JourneyPatternRef: string[];
    DepartureTime: string[];
}

export interface StopPointObject {
    StopPointRef: string;
    CommonName: string;
}

interface JourneyPatternObject {
    JourneyPatternRef: string;
    OrderedStopPoints: StopPointObject[];
    StartPoint: string;
    EndPoint: string;
    Journey: string;
}

interface JourneyPatternFromTo {
    $: {
        SequenceNumber: string;
    };
    Activity: string[];
    StopPointRef: string[];
    TimingStatus: string[];
}

interface JourneyPatternTimingLink {
    $: {
        id: string;
    };
    From: JourneyPatternFromTo[];
    To: JourneyPatternFromTo[];
    RouteLinkRef: string[];
    RunTime: string[];
}

interface JourneyPatternSection {
    $: {
        id: string;
    };
    JourneyPatternTimingLink: JourneyPatternTimingLink[];
}

export interface S3ObjectParameters {
    Bucket: string;
    Key: string;
}
export interface TndsDynamoDBData {
    Partition?: string;
    Sort?: string;
    LineName: string;
    OperatorShortName: string;
    Description: string;
    StopPoints: StopPointObject[];
    JourneyPatterns: JourneyPatternObject[];
}

export interface ServicesDynamoDBData {
    RowId: string;
    NationalOperatorCode: string;
    Partition?: string;
    Sort?: string;
    LineName: string;
    RegionCode: string;
    RegionOperatorCode: string;
    ServiceCode: string;
    Description: string;
    StartDate: string;
}

interface PushToDynamoXmlInput {
    parsedXmlLines: ParsedXmlData[];
    tableName: string;
}

interface PushToDynamoCsvInput {
    parsedCsvLines: ParsedCsvData[];
    tableName: string;
}

export const fetchDataFromS3AsString = async (parameters: S3ObjectParameters): Promise<string> => {
    const s3 = new AWS.S3();
    const data = await s3.getObject(parameters).promise();
    const dataAsString = data.Body?.toString('utf-8') ?? '';
    return dataAsString;
};

export const fileExtensionGetter = (fileName: string): string => {
    return fileName.split('.').pop() ?? '';
};

export const tableChooser = (fileExtension: string): string => {
    if (!process.env.SERVICES_TABLE_NAME || !process.env.TNDS_TABLE_NAME) {
        throw new Error('Environment variables for table names have not been set or received.');
    }

    if (fileExtension === 'csv') {
        return process.env.SERVICES_TABLE_NAME;
    }
    if (fileExtension === 'xml') {
        return process.env.TNDS_TABLE_NAME;
    }
    console.error(`File is not of a supported format type (${fileExtension})`);
    throw new Error(`Unsupported file type ${fileExtension}`);
};

export const removeFirstLineOfString = (xmlData: string): string => {
    return xmlData.substring(xmlData.indexOf('\n') + 1);
};

export const xmlParser = (xmlData: string): Promise<string> => {
    const xmlWithoutFirstLine = removeFirstLineOfString(xmlData);

    return new Promise((resolve, reject) => {
        parseString(xmlWithoutFirstLine, (err, result) => {
            if (err) {
                return reject(
                    new Error(`Parsing xml failed. Error message: ${err.message} and error name: ${err.name}`),
                );
            }
            const noEmptyResult = omitEmpty(result);
            const stringified = JSON.stringify(noEmptyResult);
            return resolve(stringified);
        });
    });
};

export const csvParser = (csvData: string): ParsedCsvData[] => {
    const parsedData: ParsedCsvData[] = csvParse(csvData, {
        columns: true,
        skip_empty_lines: true, // eslint-disable-line @typescript-eslint/camelcase
        delimiter: ',',
    });
    return parsedData;
};

export const formatDynamoWriteRequest = (parsedLines: ServicesDynamoDBData[]): AWS.DynamoDB.WriteRequest[][] => {
    const parsedDataToWriteRequest = (parsedDataItem: ParsedCsvData): AWS.DynamoDB.DocumentClient.WriteRequest => ({
        PutRequest: {
            Item: {
                ...parsedDataItem,
                Partition: parsedDataItem?.NationalOperatorCode,
                Sort: `${parsedDataItem?.LineName}#${parsedDataItem?.RowId}`,
            },
        },
    });

    const dynamoWriteRequests = parsedLines
        .filter(parsedDataItem => parsedDataItem.NationalOperatorCode)
        .map(parsedDataToWriteRequest);
    const emptyBatch: WriteRequest[][] = [];
    const batchSize = 25;
    const dynamoWriteRequestBatches = dynamoWriteRequests.reduce((result, _value, index, array) => {
        if (index % batchSize === 0) {
            result.push(array.slice(index, index + batchSize));
        }
        return result;
    }, emptyBatch);
    return dynamoWriteRequestBatches;
};

export const writeBatchesToDynamo = async ({ parsedCsvLines, tableName }: PushToDynamoCsvInput): Promise<void> => {
    const dynamodb = new AWS.DynamoDB.DocumentClient({
        convertEmptyValues: true,
    });
    const dynamoWriteRequestBatches = formatDynamoWriteRequest(parsedCsvLines);
    console.log('Number of batches to write to DynamoDB is: ', dynamoWriteRequestBatches.length);
    let count = 0;

    let writePromises = [];

    /* eslint-disable-next-line no-restricted-syntax */
    for (const batch of dynamoWriteRequestBatches) {
        writePromises.push(
            dynamodb
                .batchWrite({
                    RequestItems: {
                        [tableName]: batch,
                    },
                })
                .promise(),
        );

        count += batch.length;

        if (writePromises.length === 100) {
            try {
                await Promise.all(writePromises); // eslint-disable-line no-await-in-loop
                writePromises = [];

                console.log(`Wrote ${count} items to DynamoDB.`);
            } catch (err) {
                console.log(`Throwing error.... ${err.name} : ${err.message}`);
                throw new Error('Could not write batch to DynamoDB');
            }
        }
    }

    try {
        await Promise.all(writePromises);

        console.log(`Wrote ${dynamoWriteRequestBatches.length} total batches to DynamoDB`);
        console.log(`Wrote ${count} total items to DynamoDB.`);
    } catch (err) {
        console.log(`Throwing error.... ${err.name} : ${err.message}`);
        throw new Error('Could not write batch to DynamoDB');
    }
};

export const writeXmlToDynamo = async ({ parsedXmlLines, tableName }: PushToDynamoXmlInput): Promise<void> => {
    const dynamodb = new AWS.DynamoDB.DocumentClient({
        convertEmptyValues: true,
    });
    console.log('Writing entries to dynamo DB.');
    const putPromises = parsedXmlLines.map(item =>
        dynamodb
            .put({
                TableName: tableName,
                Item: item,
            })
            .promise(),
    );
    try {
        await Promise.all(putPromises);
    } catch (err) {
        throw new Error(`Could not write to Dynamo: ${err.name} ${err.message}`);
    }
    console.log('Dynamo DB put request complete.');
};

export const mapCommonNameToStopPoint = (
    stopPoint: string,
    collectionOfStopPoints: StopPointObject[],
): StopPointObject => {
    let mappedStopPoint = collectionOfStopPoints.find(stopPointItem => stopPointItem?.StopPointRef === stopPoint);
    if (!mappedStopPoint) {
        console.log(`Could not map a common name to the stop point '${stopPoint}'.`);
        mappedStopPoint = {
            StopPointRef: stopPoint,
            CommonName: '',
        };
    }
    return mappedStopPoint;
};

export const createOrderedStopPointMap = (
    journeyPatternTimingLinkArray: JourneyPatternTimingLink[],
    collectionOfStopPoints: StopPointObject[],
): StopPointObject[] => {
    const orderedListOfStops = journeyPatternTimingLinkArray.flatMap(journeyPatternTimingLink => [
        journeyPatternTimingLink?.From[0]?.StopPointRef[0],
        journeyPatternTimingLink?.To[0]?.StopPointRef[0],
    ]);
    const uniqueStops = [...new Set(orderedListOfStops)];
    const mappedArrayOfOrderedStopPoints = uniqueStops.map(stopPoint =>
        mapCommonNameToStopPoint(stopPoint, collectionOfStopPoints),
    );
    return mappedArrayOfOrderedStopPoints;
};

export const extractDataFromParsedXml = (parsedJson: any): ExtractedDataObject => {
    const extractedLineName: string = parsedJson?.TransXChange?.Services[0]?.Service[0]?.Lines[0]?.Line[0]?.LineName[0];
    const extractedFileName: string = parsedJson?.TransXChange?.$?.FileName;
    const extractedDescription: string = parsedJson?.TransXChange?.Services[0]?.Service[0]?.Description[0];
    const extractedStartDate: string =
        parsedJson?.TransXChange?.Services[0]?.Service[0]?.OperatingPeriod[0]?.StartDate[0];
    const extractedOperators: ExtractedOperator[] = parsedJson?.TransXChange?.Operators[0]?.Operator;
    const extractedStopPoints: ExtractedStopPoint[] = parsedJson?.TransXChange?.StopPoints[0]?.AnnotatedStopPointRef;
    const journeyPatternSections: JourneyPatternSection[] =
        parsedJson?.TransXChange?.JourneyPatternSections[0]?.JourneyPatternSection;
    const vehicleJourneys: ExtractedVehicleJourney[] = parsedJson?.TransXChange?.VehicleJourneys[0]?.VehicleJourney;
    return {
        extractedFileName,
        extractedLineName,
        extractedDescription,
        extractedStartDate,
        extractedOperators,
        extractedStopPoints,
        journeyPatternSections,
        vehicleJourneys,
    };
};

export const cleanParsedXmlData = (parsedXmlData: string): TndsDynamoDBData[] => {
    const parsedJson = JSON.parse(parsedXmlData);

    const extractedData = extractDataFromParsedXml(parsedJson);
    const { extractedFileName } = extractedData;
    const { extractedLineName } = extractedData;
    const { extractedDescription } = extractedData;
    const { extractedStartDate } = extractedData;
    const { extractedOperators } = extractedData;
    const { extractedStopPoints } = extractedData;
    const { journeyPatternSections } = extractedData;

    const stopPointsCollection: StopPointObject[] = extractedStopPoints.map(stopPointItem => ({
        StopPointRef: stopPointItem?.StopPointRef[0],
        CommonName: stopPointItem?.CommonName[0],
    }));

    const journeyPatternToStopPointsMap: JourneyPatternObject[] = journeyPatternSections.map(journeyPatternSection => {
        const orderedStopPoints = createOrderedStopPointMap(
            journeyPatternSection?.JourneyPatternTimingLink,
            stopPointsCollection,
        );
        const journeyStartPoint = orderedStopPoints[0].CommonName;
        const journeyEndPoint = orderedStopPoints[orderedStopPoints.length - 1].CommonName;
        return {
            JourneyPatternRef: journeyPatternSection?.$?.id,
            OrderedStopPoints: orderedStopPoints,
            StartPoint: journeyStartPoint,
            EndPoint: journeyEndPoint,
            Journey: `${journeyStartPoint} to ${journeyEndPoint}`,
        };
    });

    const cleanedXmlData: TndsDynamoDBData[] = extractedOperators
        .filter((operator: ExtractedOperator): string => operator.NationalOperatorCode[0])
        .map(
            (operator: ExtractedOperator): TndsDynamoDBData => ({
                Partition: operator.NationalOperatorCode[0],
                Sort: `${extractedLineName}#${extractedStartDate}#${extractedFileName}`,
                LineName: extractedLineName,
                OperatorShortName: operator?.OperatorShortName[0],
                Description: extractedDescription,
                StopPoints: stopPointsCollection,
                JourneyPatterns: journeyPatternToStopPointsMap,
            }),
        );

    return cleanedXmlData;
};

export const setS3ObjectParams = (event: S3Event): S3ObjectParameters => {
    const s3BucketName: string = event.Records[0].s3.bucket.name;
    const s3FileName: string = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' ')); // Object key may have spaces or unicode non-ASCII characters
    const params: S3ObjectParameters = {
        Bucket: s3BucketName,
        Key: s3FileName,
    };
    return params;
};

export const s3TndsHandler = async (event: S3Event): Promise<void> => {
    const params = setS3ObjectParams(event);

    console.log(`Got S3 event for key '${params.Key}' in bucket '${params.Bucket}'`);

    const fileExtension = fileExtensionGetter(params.Key);

    if (!fileExtension) {
        throw Error('File Extension could not be retrieved');
    }

    const stringifiedS3Data = await fetchDataFromS3AsString(params);

    const tableName = tableChooser(fileExtension);

    if (tableName === process.env.TNDS_TABLE_NAME) {
        const parsedXmlData: string = await xmlParser(stringifiedS3Data);

        if (!parsedXmlData) {
            throw Error('Data parsing has failed, stopping before database writing occurs.');
        }

        const cleanedXmlData = cleanParsedXmlData(parsedXmlData);

        await writeXmlToDynamo({
            tableName,
            parsedXmlLines: cleanedXmlData,
        });
    } else if (tableName === process.env.SERVICES_TABLE_NAME) {
        const parsedCsvData = csvParser(stringifiedS3Data);

        if (!parsedCsvData) {
            throw Error('Data parsing has failed, stopping before database writing occurs.');
        }
        await writeBatchesToDynamo({
            tableName,
            parsedCsvLines: parsedCsvData,
        });
    }
};
