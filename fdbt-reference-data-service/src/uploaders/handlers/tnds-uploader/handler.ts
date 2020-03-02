import omitEmpty from 'omit-empty';
import { S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';
import csvParse from 'csv-parse/lib/sync';
import { WriteRequest } from 'aws-sdk/clients/dynamodb';
import { parseString } from 'xml2js';

export type ParsedXml = TndsDynamoDBData;
export type ParsedCsv = ServicesDynamoDBData;

interface TransportService {
    FileName: string;
    LineName: string;
    ServiceDescription: string;
    ServiceStartDate: string;
    Operators: Operator[];
    StopPoints: StopPoint[];
    RawJourneyPatternSections: RawJourneyPatternSection[];
    VehicleJourneys: VehicleJourney[];
    RawJourneyPatterns: RawJourneyPattern[];
}

interface RawJourneyPattern {
    JourneyPatternSectionRefs: string[];
}

interface JourneyPatternSection {
    Id: string;
    OrderedStopPoints: StopPoint[];
    StartPoint: string;
    EndPoint: string;
}

interface Operator {
    $: {};
    NationalOperatorCode: string[];
    OperatorCode: string[];
    OperatorShortName: string[];
    OperatorNameOnLicence: string[];
    TradingName: string[];
}

interface VehicleJourney {
    PrivateCode: string[];
    VehicleJourneyCode: string[];
    ServiceRef: string[];
    LineRef: string[];
    JourneyPatternRef: string[];
    DepartureTime: string[];
}

export interface StopPoint {
    StopPointRef: string;
    CommonName: string;
}

export interface JourneyPattern {
    JourneyPatternSections: JourneyPatternSection[];
}

interface JourneyPatternTimingLinkStopPoint {
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
    From: JourneyPatternTimingLinkStopPoint[];
    To: JourneyPatternTimingLinkStopPoint[];
    RouteLinkRef: string[];
    RunTime: string[];
}

interface RawJourneyPatternSection {
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
    ServiceDescription: string;
    JourneyPatterns: JourneyPattern[];
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
    parsedXmlLines: ParsedXml[];
    tableName: string;
}

interface PushToDynamoCsvInput {
    parsedCsvLines: ParsedCsv[];
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

    return new Promise((resolve, reject) =>
        parseString(xmlWithoutFirstLine, (err, result) => {
            if (err) {
                return reject(
                    new Error(`Parsing xml failed. Error message: ${err.message} and error name: ${err.name}`),
                );
            }
            const noEmptyResult = omitEmpty(result);
            const stringified = JSON.stringify(noEmptyResult);
            return resolve(stringified);
        }),
    );
};

export const csvParser = (csvData: string): ParsedCsv[] => {
    const parsedData: ParsedCsv[] = csvParse(csvData, {
        columns: true,
        skip_empty_lines: true, // eslint-disable-line @typescript-eslint/camelcase
        delimiter: ',',
    });
    return parsedData;
};

export const formatDynamoWriteRequest = (parsedLines: ServicesDynamoDBData[]): AWS.DynamoDB.WriteRequest[][] => {
    const parsedDataToWriteRequest = (parsedDataItem: ParsedCsv): AWS.DynamoDB.DocumentClient.WriteRequest => ({
        PutRequest: {
            Item: {
                ...parsedDataItem,
                Partition: parsedDataItem?.NationalOperatorCode,
                Sort: `${parsedDataItem?.LineName}#${parsedDataItem?.StartDate}`,
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
    console.info('Number of batches to write to DynamoDB is: ', dynamoWriteRequestBatches.length);
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

                console.info(`Wrote ${count} items to DynamoDB.`);
            } catch (err) {
                console.error(`Throwing error.... ${err.name} : ${err.message}`);
                throw new Error('Could not write batch to DynamoDB');
            }
        }
    }

    try {
        await Promise.all(writePromises);

        console.info(`Wrote ${dynamoWriteRequestBatches.length} total batches to DynamoDB`);
        console.info(`Wrote ${count} total items to DynamoDB.`);
    } catch (err) {
        console.error(`Throwing error.... ${err.name} : ${err.message}`);
        throw new Error('Could not write batch to DynamoDB');
    }
};

export const writeXmlToDynamo = async ({ parsedXmlLines, tableName }: PushToDynamoXmlInput): Promise<void> => {
    const dynamodb = new AWS.DynamoDB.DocumentClient({
        convertEmptyValues: true,
    });
    console.info('Writing entries to dynamo DB.');
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
    console.info('Dynamo DB put request complete.');
};

export const findCommonNameForStop = (stopPoint: string, collectionOfStopPoints: StopPoint[]): StopPoint => {
    let mappedStopPoint = collectionOfStopPoints.find(stopPointItem => stopPointItem?.StopPointRef === stopPoint);
    if (!mappedStopPoint) {
        console.warn(`Could not map a common name to the stop point '${stopPoint}'.`);
        mappedStopPoint = {
            StopPointRef: stopPoint,
            CommonName: '',
        };
    }
    return mappedStopPoint;
};

export const getOrderedStopPointsForJourneyPatternSection = (
    journeyPatternTimingLinks: JourneyPatternTimingLink[],
    collectionOfStopPoints: StopPoint[],
): StopPoint[] => {
    const orderedListOfStops = journeyPatternTimingLinks.flatMap(journeyPatternTimingLink => [
        journeyPatternTimingLink?.From[0]?.StopPointRef[0],
        journeyPatternTimingLink?.To[0]?.StopPointRef[0],
    ]);
    const uniqueStops = [...new Set(orderedListOfStops)];
    const result = uniqueStops.map(stopPoint => findCommonNameForStop(stopPoint, collectionOfStopPoints));
    return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractJourneyInfoFromParsedXml = (parsedJson: any): TransportService => {
    const lineName: string = parsedJson?.TransXChange?.Services[0]?.Service[0]?.Lines[0]?.Line[0]?.LineName[0];
    const fileName: string = parsedJson?.TransXChange?.$?.FileName;
    let serviceDescription: string = parsedJson?.TransXChange?.Services[0]?.Service[0]?.Description[0];
    if (!serviceDescription) {
        serviceDescription = '';
    }
    const serviceStartDate: string =
        parsedJson?.TransXChange?.Services[0]?.Service[0]?.OperatingPeriod[0]?.StartDate[0];

    const rawJourneyPatterns: RawJourneyPattern[] =
        parsedJson?.TransXChange?.Services[0]?.Service[0]?.StandardService[0].JourneyPattern;
    const operators: Operator[] = parsedJson?.TransXChange?.Operators[0]?.Operator;
    const stopPoints: StopPoint[] = parsedJson?.TransXChange?.StopPoints[0]?.AnnotatedStopPointRef;
    const rawJourneyPatternSections: RawJourneyPatternSection[] =
        parsedJson?.TransXChange?.JourneyPatternSections[0]?.JourneyPatternSection;
    const vehicleJourneys: VehicleJourney[] = parsedJson?.TransXChange?.VehicleJourneys[0]?.VehicleJourney;
    return {
        FileName: fileName,
        LineName: lineName,
        ServiceDescription: serviceDescription,
        ServiceStartDate: serviceStartDate,
        Operators: operators,
        StopPoints: stopPoints,
        RawJourneyPatternSections: rawJourneyPatternSections,
        VehicleJourneys: vehicleJourneys,
        RawJourneyPatterns: rawJourneyPatterns,
    };
};

export const cleanParsedXml = (parsedXml: string): TndsDynamoDBData[] => {
    const parsedJson = JSON.parse(parsedXml);

    const extractedData = extractJourneyInfoFromParsedXml(parsedJson);
    const fileName = extractedData.FileName;
    const lineName = extractedData.LineName;
    const serviceDescription = extractedData.ServiceDescription;
    const serviceStartDate = extractedData.ServiceStartDate;
    const operators = extractedData.Operators;
    const stopPoints = extractedData.StopPoints;
    const rawJourneyPatternSections = extractedData.RawJourneyPatternSections;
    const rawJourneyPatterns = extractedData.RawJourneyPatterns;

    const stopPointsCollection: StopPoint[] = stopPoints.map(stopPointItem => ({
        StopPointRef: stopPointItem?.StopPointRef[0],
        CommonName: stopPointItem?.CommonName[0],
    }));

    const journeyPatternSections: JourneyPatternSection[] = rawJourneyPatternSections.map(rawJourneyPatternSection => {
        const sectionStopPoints = getOrderedStopPointsForJourneyPatternSection(
            rawJourneyPatternSection?.JourneyPatternTimingLink,
            stopPointsCollection,
        );
        const sectionStartPoint = sectionStopPoints[0]?.CommonName;
        const sectionEndPoint = sectionStopPoints[sectionStopPoints.length - 1]?.CommonName;
        return {
            Id: rawJourneyPatternSection?.$?.id,
            OrderedStopPoints: sectionStopPoints,
            StartPoint: sectionStartPoint,
            EndPoint: sectionEndPoint,
        };
    });

    const findOrThrow = <T>(values: T[], predicate: (value: T) => boolean): T => {
        const element = values.find(predicate);

        if (!element) {
            throw new Error('No matching element found');
        }

        return element;
    };

    const journeyPatterns: JourneyPattern[] = rawJourneyPatterns.map(
        (rawJourneyPattern): JourneyPattern => ({
            JourneyPatternSections: rawJourneyPattern?.JourneyPatternSectionRefs.map(journeyPatternSectionRef =>
                findOrThrow(journeyPatternSections, section => section?.Id === journeyPatternSectionRef),
            ),
        }),
    );

    const cleanedXmlData: TndsDynamoDBData[] = operators
        .filter((operator: Operator): string => operator?.NationalOperatorCode[0])
        .map(
            (operator: Operator): TndsDynamoDBData => ({
                Partition: operator?.NationalOperatorCode[0],
                Sort: `${lineName}#${serviceStartDate}#${fileName}`,
                LineName: lineName,
                OperatorShortName: operator?.OperatorShortName[0],
                ServiceDescription: serviceDescription,
                JourneyPatterns: journeyPatterns,
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

    console.info(`Got S3 event for key '${params.Key}' in bucket '${params.Bucket}'`);

    const fileExtension = fileExtensionGetter(params.Key);

    if (!fileExtension) {
        throw Error('File Extension could not be retrieved');
    }

    const stringifiedS3Data = await fetchDataFromS3AsString(params);

    const tableName = tableChooser(fileExtension);

    if (tableName === process.env.TNDS_TABLE_NAME) {
        const parsedXml: string = await xmlParser(stringifiedS3Data);

        if (!parsedXml) {
            throw Error('Data parsing has failed, stopping before database writing occurs.');
        }

        const cleanedXmlData = cleanParsedXml(parsedXml);

        await writeXmlToDynamo({
            tableName,
            parsedXmlLines: cleanedXmlData,
        });
    } else if (tableName === process.env.SERVICES_TABLE_NAME) {
        const parsedCsv = csvParser(stringifiedS3Data);

        if (!parsedCsv) {
            throw Error('Data parsing has failed, stopping before database writing occurs.');
        }
        await writeBatchesToDynamo({
            tableName,
            parsedCsvLines: parsedCsv,
        });
    }
};
