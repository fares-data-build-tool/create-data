import { S3Event } from 'aws-lambda';
import { ParsedCsv } from '../handler';

export const mockS3Event = (bucketName: string, fileName: string): S3Event => ({
    Records: [
        {
            eventVersion: '',
            eventSource: '',
            awsRegion: '',
            eventTime: '',
            eventName: '',
            userIdentity: {
                principalId: '',
            },
            requestParameters: {
                sourceIPAddress: '',
            },
            responseElements: {
                'x-amz-request-id': '',
                'x-amz-id-2': '',
            },
            s3: {
                s3SchemaVersion: '',
                configurationId: '',
                bucket: {
                    name: bucketName,
                    ownerIdentity: {
                        principalId: '',
                    },
                    arn: '',
                },
                object: {
                    key: fileName,
                    size: 1,
                    eTag: '',
                    versionId: '',
                    sequencer: '',
                },
            },
            glacierEventData: {
                restoreEventData: {
                    lifecycleRestorationExpiryTime: '',
                    lifecycleRestoreStorageClass: '',
                },
            },
        },
    ],
});

export const getMockServicesData = (rowId: number, yearModifier: number): ParsedCsv => ({
    RowId: `${rowId}`,
    NationalOperatorCode: 'A2BR',
    LineName: '32',
    RegionCode: 'EA',
    RegionOperatorCode: 'A2BR',
    Description: 'Trumpington P & R - Hauxton',
    ServiceCode: '20-32-_-y08-1',
    StartDate: `2${yearModifier}19-12-03`,
});

export const getMockReformattedServicesData = (rowId: number, yearModifier: number): {} => ({
    RowId: `${rowId}`,
    NationalOperatorCode: 'A2BR',
    Partition: 'A2BR',
    Sort: `32#2${yearModifier}19-12-03`,
    LineName: '32',
    RegionCode: 'EA',
    RegionOperatorCode: 'A2BR',
    Description: 'Trumpington P & R - Hauxton',
    ServiceCode: '20-32-_-y08-1',
    StartDate: `2${yearModifier}19-12-03`,
});

export const createArray = (index: number): ParsedCsv[] => {
    const array: ParsedCsv[] = [];
    for (let i = 0; i < index; i += 1) {
        array.push(getMockServicesData(i, i));
    }
    return array;
};

export const createBatchOfWriteRequests = (index: number): AWS.DynamoDB.WriteRequest[] => {
    const batchOfWriteRequests: AWS.DynamoDB.DocumentClient.WriteRequest[] = [];
    for (let i = 0; i < index; i += 1) {
        batchOfWriteRequests.push({
            PutRequest: {
                Item: getMockReformattedServicesData(i, i),
            },
        });
    }
    return batchOfWriteRequests;
};

export const testCsv: string =
    'RowId,RegionCode,RegionOperatorCode,ServiceCode,LineName,Description,StartDate,NationalOperatorCode\n' +
    '1,EA,703BE,9-91-_-y08-11,91,Ipswich - Hadleigh - Sudbury,2019-12-03,BEES\n' +
    '2,EA,753BDR,26-SJL-8-y08-2,SJL8,Blundeston - Sir John Leman School,2019-12-03,BDRB\n' +
    '3,EA,767STEP,7-985-_-y08-4,985,Bury St Edmunds Schools - Risby,2019-12-03,SESX\n' +
    '4,EA,A2BR,20-18-A-y08-1,18,Newmarket - Fulbourn - Teversham - Newmarket Road Park & Ride,2019-12-03,A2BR\n' +
    '5,EA,A2BR,20-32-_-y08-1,32,Trumpington P & R - Hauxton,2019-12-03,A2BR';

export const isParseableToJSON = (str: string): boolean => {
    try {
        return JSON.parse(str) && !!str;
    } catch (e) {
        return false;
    }
};

export const mockCleanedXmlData = [
    {
        ServiceDescription: 'St Ives - Bar Hill',
        LineName: '1A',
        OperatorShortName: 'Dews Coaches',
        Partition: 'DEWS',
        Sort: '1A#2019-12-17#ea_20-1A-A-y08-1.xml',
        JourneyPatterns: [
            {
                JourneyPatternSections: [
                    {
                        Id: 'JPS_20-1A-A-y08-1-1-1-R',
                        OrderedStopPoints: [
                            {
                                StopPointRef: '0500SBARH011',
                                CommonName: 'Superstore',
                            },
                            {
                                StopPointRef: '0500HFENS007',
                                CommonName: 'Rookery Way',
                            },
                            {
                                StopPointRef: '0500HFENS006',
                                CommonName: 'Swan Road',
                            },
                            {
                                StopPointRef: '0500HFENS003',
                                CommonName: 'Chequer Street',
                            },
                        ],
                        StartPoint: 'Superstore',
                        EndPoint: 'Chequer Street',
                    },
                ],
            },
            {
                JourneyPatternSections: [
                    {
                        Id: 'JPS_20-1A-A-y08-1-2-1-R',
                        OrderedStopPoints: [
                            {
                                StopPointRef: '0500SBARH011',
                                CommonName: 'Superstore',
                            },
                            {
                                StopPointRef: '0500HFENS007',
                                CommonName: 'Rookery Way',
                            },
                            {
                                StopPointRef: '0500HFENS006',
                                CommonName: 'Swan Road',
                            },
                            {
                                StopPointRef: '0500HFENS003',
                                CommonName: 'Chequer Street',
                            },
                        ],
                        StartPoint: 'Superstore',
                        EndPoint: 'Chequer Street',
                    },
                ],
            },
            {
                JourneyPatternSections: [
                    {
                        Id: 'JPS_20-1A-A-y08-1-3-2-R',
                        OrderedStopPoints: [
                            {
                                StopPointRef: '0500SBARH011',
                                CommonName: 'Superstore',
                            },
                            {
                                StopPointRef: '0500SSWAV013',
                                CommonName: 'The Farm',
                            },
                            {
                                StopPointRef: '0500SFEND004',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500SFEND003',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500HFENS007',
                                CommonName: 'Rookery Way',
                            },
                            {
                                StopPointRef: '0500HFENS006',
                                CommonName: 'Swan Road',
                            },
                            {
                                StopPointRef: '0500HFENS003',
                                CommonName: 'Chequer Street',
                            },
                            {
                                StopPointRef: '0500HHEMG002',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500HHOLY010',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500HSTIV002',
                                CommonName: '',
                            },
                        ],
                        StartPoint: 'Superstore',
                        EndPoint: '',
                    },
                ],
            },
            {
                JourneyPatternSections: [
                    {
                        Id: 'JPS_20-1A-A-y08-1-4-2-R',
                        OrderedStopPoints: [
                            {
                                StopPointRef: '0500SBARH011',
                                CommonName: 'Superstore',
                            },
                            {
                                StopPointRef: '0500SSWAV013',
                                CommonName: 'The Farm',
                            },
                            {
                                StopPointRef: '0500SFEND004',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500SFEND003',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500HFENS007',
                                CommonName: 'Rookery Way',
                            },
                            {
                                StopPointRef: '0500HFENS006',
                                CommonName: 'Swan Road',
                            },
                            {
                                StopPointRef: '0500HFENS003',
                                CommonName: 'Chequer Street',
                            },
                            {
                                StopPointRef: '0500HHEMG002',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500HHOLY010',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500HSTIV002',
                                CommonName: '',
                            },
                        ],
                        StartPoint: 'Superstore',
                        EndPoint: '',
                    },
                ],
            },
            {
                JourneyPatternSections: [
                    {
                        Id: 'JPS_20-1A-A-y08-1-5-3-R',
                        OrderedStopPoints: [
                            {
                                StopPointRef: '0500SBARH011',
                                CommonName: 'Superstore',
                            },
                            {
                                StopPointRef: '0500HFENS007',
                                CommonName: 'Rookery Way',
                            },
                            {
                                StopPointRef: '0500HFENS006',
                                CommonName: 'Swan Road',
                            },
                            {
                                StopPointRef: '0500HFENS003',
                                CommonName: 'Chequer Street',
                            },
                            {
                                StopPointRef: '0500HHEMG002',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500HSTIV002',
                                CommonName: '',
                            },
                        ],
                        StartPoint: 'Superstore',
                        EndPoint: '',
                    },
                ],
            },
        ],
    },
    {
        ServiceDescription: 'St Ives - Bar Hill',
        LineName: '1A',
        OperatorShortName: 'Dannys Coaches',
        Partition: 'Dannys',
        Sort: '1A#2019-12-17#ea_20-1A-A-y08-1.xml',
        JourneyPatterns: [
            {
                JourneyPatternSections: [
                    {
                        Id: 'JPS_20-1A-A-y08-1-1-1-R',
                        OrderedStopPoints: [
                            {
                                StopPointRef: '0500SBARH011',
                                CommonName: 'Superstore',
                            },
                            {
                                StopPointRef: '0500HFENS007',
                                CommonName: 'Rookery Way',
                            },
                            {
                                StopPointRef: '0500HFENS006',
                                CommonName: 'Swan Road',
                            },
                            {
                                StopPointRef: '0500HFENS003',
                                CommonName: 'Chequer Street',
                            },
                        ],
                        StartPoint: 'Superstore',
                        EndPoint: 'Chequer Street',
                    },
                ],
            },
            {
                JourneyPatternSections: [
                    {
                        Id: 'JPS_20-1A-A-y08-1-2-1-R',
                        OrderedStopPoints: [
                            {
                                StopPointRef: '0500SBARH011',
                                CommonName: 'Superstore',
                            },
                            {
                                StopPointRef: '0500HFENS007',
                                CommonName: 'Rookery Way',
                            },
                            {
                                StopPointRef: '0500HFENS006',
                                CommonName: 'Swan Road',
                            },
                            {
                                StopPointRef: '0500HFENS003',
                                CommonName: 'Chequer Street',
                            },
                        ],
                        StartPoint: 'Superstore',
                        EndPoint: 'Chequer Street',
                    },
                ],
            },
            {
                JourneyPatternSections: [
                    {
                        Id: 'JPS_20-1A-A-y08-1-3-2-R',
                        OrderedStopPoints: [
                            {
                                StopPointRef: '0500SBARH011',
                                CommonName: 'Superstore',
                            },
                            {
                                StopPointRef: '0500SSWAV013',
                                CommonName: 'The Farm',
                            },
                            {
                                StopPointRef: '0500SFEND004',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500SFEND003',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500HFENS007',
                                CommonName: 'Rookery Way',
                            },
                            {
                                StopPointRef: '0500HFENS006',
                                CommonName: 'Swan Road',
                            },
                            {
                                StopPointRef: '0500HFENS003',
                                CommonName: 'Chequer Street',
                            },
                            {
                                StopPointRef: '0500HHEMG002',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500HHOLY010',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500HSTIV002',
                                CommonName: '',
                            },
                        ],
                        StartPoint: 'Superstore',
                        EndPoint: '',
                    },
                ],
            },
            {
                JourneyPatternSections: [
                    {
                        Id: 'JPS_20-1A-A-y08-1-4-2-R',
                        OrderedStopPoints: [
                            {
                                StopPointRef: '0500SBARH011',
                                CommonName: 'Superstore',
                            },
                            {
                                StopPointRef: '0500SSWAV013',
                                CommonName: 'The Farm',
                            },
                            {
                                StopPointRef: '0500SFEND004',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500SFEND003',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500HFENS007',
                                CommonName: 'Rookery Way',
                            },
                            {
                                StopPointRef: '0500HFENS006',
                                CommonName: 'Swan Road',
                            },
                            {
                                StopPointRef: '0500HFENS003',
                                CommonName: 'Chequer Street',
                            },
                            {
                                StopPointRef: '0500HHEMG002',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500HHOLY010',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500HSTIV002',
                                CommonName: '',
                            },
                        ],
                        StartPoint: 'Superstore',
                        EndPoint: '',
                    },
                ],
            },
            {
                JourneyPatternSections: [
                    {
                        Id: 'JPS_20-1A-A-y08-1-5-3-R',
                        OrderedStopPoints: [
                            {
                                StopPointRef: '0500SBARH011',
                                CommonName: 'Superstore',
                            },
                            {
                                StopPointRef: '0500HFENS007',
                                CommonName: 'Rookery Way',
                            },
                            {
                                StopPointRef: '0500HFENS006',
                                CommonName: 'Swan Road',
                            },
                            {
                                StopPointRef: '0500HFENS003',
                                CommonName: 'Chequer Street',
                            },
                            {
                                StopPointRef: '0500HHEMG002',
                                CommonName: '',
                            },
                            {
                                StopPointRef: '0500HSTIV002',
                                CommonName: '',
                            },
                        ],
                        StartPoint: 'Superstore',
                        EndPoint: '',
                    },
                ],
            },
        ],
    },
];

export const testXml = `
<?xml version="1.0" encoding="utf-8"?>
<TransXChange xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xsi:schemaLocation="http://www.transxchange.org.uk/ http://www.transxchange.org.uk/schema/2.5/TransXChange_general.xsd" CreationDateTime="2019-12-20T12:29:46.8712Z" ModificationDateTime="2019-12-20T12:29:46.8712Z" Modification="new" RevisionNumber="3" FileName="ea_20-1A-A-y08-1.xml" SchemaVersion="2.5" RegistrationDocument="true" xmlns="http://www.transxchange.org.uk/">
  <StopPoints>
    <AnnotatedStopPointRef>
      <StopPointRef>0500SBARH011</StopPointRef>
      <CommonName>Superstore</CommonName>
      <Indicator>nr</Indicator>
      <LocalityName>Bar Hill</LocalityName>
      <LocalityQualifier>Cambridgeshire</LocalityQualifier>
    </AnnotatedStopPointRef>
    <AnnotatedStopPointRef>
      <StopPointRef>0500HFENS007</StopPointRef>
      <CommonName>Rookery Way</CommonName>
      <Indicator>opp</Indicator>
      <LocalityName>Fenstanton</LocalityName>
      <LocalityQualifier>Cambridgeshire</LocalityQualifier>
    </AnnotatedStopPointRef>
    <AnnotatedStopPointRef>
      <StopPointRef>0500HFENS006</StopPointRef>
      <CommonName>Swan Road</CommonName>
      <Indicator>opp</Indicator>
      <LocalityName>Fenstanton</LocalityName>
      <LocalityQualifier>Cambridgeshire</LocalityQualifier>
    </AnnotatedStopPointRef>
    <AnnotatedStopPointRef>
      <StopPointRef>0500HFENS003</StopPointRef>
      <CommonName>Chequer Street</CommonName>
      <Indicator>opp</Indicator>
      <LocalityName>Fenstanton</LocalityName>
      <LocalityQualifier>Cambridgeshire</LocalityQualifier>
    </AnnotatedStopPointRef>
    <AnnotatedStopPointRef>
      <StopPointRef>0500SSWAV013</StopPointRef>
      <CommonName>The Farm</CommonName>
      <Indicator>opp</Indicator>
      <LocalityName>Boxworth End</LocalityName>
      <LocalityQualifier>Cambridgeshire</LocalityQualifier>
    </AnnotatedStopPointRef>
  </StopPoints>
  <RouteSections>
    <RouteSection id="RS_20-1A-A-y08-1-R-1">
      <RouteLink id="RL_20-1A-A-y08-1-R-1-1">
        <From>
          <StopPointRef>0500SBARH011</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HFENS007</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-1-2">
        <From>
          <StopPointRef>0500HFENS007</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HFENS006</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-1-3">
        <From>
          <StopPointRef>0500HFENS006</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HFENS003</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
    </RouteSection>
    <RouteSection id="RS_20-1A-A-y08-1-R-2">
      <RouteLink id="RL_20-1A-A-y08-1-R-2-1">
        <From>
          <StopPointRef>0500SBARH011</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500SSWAV013</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-2-2">
        <From>
          <StopPointRef>0500SSWAV013</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500SFEND004</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-2-3">
        <From>
          <StopPointRef>0500SFEND004</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500SFEND003</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-2-4">
        <From>
          <StopPointRef>0500SFEND003</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HFENS007</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-2-5">
        <From>
          <StopPointRef>0500HFENS007</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HFENS006</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-2-6">
        <From>
          <StopPointRef>0500HFENS006</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HFENS003</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-2-7">
        <From>
          <StopPointRef>0500HFENS003</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HHEMG002</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-2-8">
        <From>
          <StopPointRef>0500HHEMG002</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HHOLY010</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-2-9">
        <From>
          <StopPointRef>0500HHOLY010</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HSTIV002</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
    </RouteSection>
    <RouteSection id="RS_20-1A-A-y08-1-R-3">
      <RouteLink id="RL_20-1A-A-y08-1-R-3-1">
        <From>
          <StopPointRef>0500SBARH011</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HFENS007</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-3-2">
        <From>
          <StopPointRef>0500HFENS007</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HFENS006</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-3-3">
        <From>
          <StopPointRef>0500HFENS006</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HFENS003</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-3-4">
        <From>
          <StopPointRef>0500HFENS003</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HHEMG002</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-3-5">
        <From>
          <StopPointRef>0500HHEMG002</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HSTIV002</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
    </RouteSection>
    <RouteSection id="RS_20-1A-A-y08-1-R-4">
      <RouteLink id="RL_20-1A-A-y08-1-R-4-1">
        <From>
          <StopPointRef>0500SBARH011</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HFENS007</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-4-2">
        <From>
          <StopPointRef>0500HFENS007</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HFENS006</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-4-3">
        <From>
          <StopPointRef>0500HFENS006</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HFENS003</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-4-4">
        <From>
          <StopPointRef>0500HFENS003</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HHEMG002</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-4-5">
        <From>
          <StopPointRef>0500HHEMG002</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HHOLY010</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-R-4-6">
        <From>
          <StopPointRef>0500HHOLY010</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HSTIV002</StopPointRef>
        </To>
        <Direction>inbound</Direction>
      </RouteLink>
    </RouteSection>
    <RouteSection id="RS_20-1A-A-y08-1-H-5">
      <RouteLink id="RL_20-1A-A-y08-1-H-5-1">
        <From>
          <StopPointRef>0500HFENS002</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HFENS006</StopPointRef>
        </To>
        <Direction>outbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-H-5-2">
        <From>
          <StopPointRef>0500HFENS006</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500HFENS008</StopPointRef>
        </To>
        <Direction>outbound</Direction>
      </RouteLink>
      <RouteLink id="RL_20-1A-A-y08-1-H-5-3">
        <From>
          <StopPointRef>0500HFENS008</StopPointRef>
        </From>
        <To>
          <StopPointRef>0500SBARH011</StopPointRef>
        </To>
        <Direction>outbound</Direction>
      </RouteLink>
    </RouteSection>
  </RouteSections>
  <Routes>
    <Route id="R_20-1A-A-y08-1-R-1">
      <PrivateCode>R_20-1A-A-y08-1-R-1</PrivateCode>
      <Description>Superstore - Chequer Street</Description>
      <RouteSectionRef>RS_20-1A-A-y08-1-R-1</RouteSectionRef>
    </Route>
    <Route id="R_20-1A-A-y08-1-R-2">
      <PrivateCode>R_20-1A-A-y08-1-R-2</PrivateCode>
      <Description>Superstore - Bus Station</Description>
      <RouteSectionRef>RS_20-1A-A-y08-1-R-2</RouteSectionRef>
    </Route>
    <Route id="R_20-1A-A-y08-1-R-3">
      <PrivateCode>R_20-1A-A-y08-1-R-3</PrivateCode>
      <Description>Superstore - Bus Station</Description>
      <RouteSectionRef>RS_20-1A-A-y08-1-R-3</RouteSectionRef>
    </Route>
    <Route id="R_20-1A-A-y08-1-R-4">
      <PrivateCode>R_20-1A-A-y08-1-R-4</PrivateCode>
      <Description>Superstore - Bus Station</Description>
      <RouteSectionRef>RS_20-1A-A-y08-1-R-4</RouteSectionRef>
    </Route>
    <Route id="R_20-1A-A-y08-1-H-5">
      <PrivateCode>R_20-1A-A-y08-1-H-5</PrivateCode>
      <Description>Chequer Street - Superstore</Description>
      <RouteSectionRef>RS_20-1A-A-y08-1-H-5</RouteSectionRef>
    </Route>
  </Routes>
  <JourneyPatternSections>
    <JourneyPatternSection id="JPS_20-1A-A-y08-1-1-1-R">
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-1-R-1-2">
        <From SequenceNumber="1">
          <Activity>pickUp</Activity>
          <StopPointRef>0500SBARH011</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="5">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS007</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-1-1</RouteLinkRef>
        <RunTime>PT15M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-1-R-1-3">
        <From SequenceNumber="5">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS007</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="6">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS006</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-1-2</RouteLinkRef>
        <RunTime>PT1M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-1-R-1-4">
        <From SequenceNumber="6">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS006</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </From>
        <To SequenceNumber="7">
          <Activity>setDown</Activity>
          <StopPointRef>0500HFENS003</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-1-3</RouteLinkRef>
        <RunTime>PT1M</RunTime>
      </JourneyPatternTimingLink>
    </JourneyPatternSection>
    <JourneyPatternSection id="JPS_20-1A-A-y08-1-2-1-R">
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-2-R-1-2">
        <From SequenceNumber="1">
          <Activity>pickUp</Activity>
          <StopPointRef>0500SBARH011</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="5">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS007</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-1-1</RouteLinkRef>
        <RunTime>PT10M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-2-R-1-3">
        <From SequenceNumber="5">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS007</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="6">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS006</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-1-2</RouteLinkRef>
        <RunTime>PT1M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-2-R-1-4">
        <From SequenceNumber="6">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS006</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </From>
        <To SequenceNumber="7">
          <Activity>setDown</Activity>
          <StopPointRef>0500HFENS003</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-1-3</RouteLinkRef>
        <RunTime>PT1M</RunTime>
      </JourneyPatternTimingLink>
    </JourneyPatternSection>
    <JourneyPatternSection id="JPS_20-1A-A-y08-1-3-2-R">
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-3-R-2-2">
        <From SequenceNumber="1">
          <Activity>pickUp</Activity>
          <StopPointRef>0500SBARH011</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="2">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500SSWAV013</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-1</RouteLinkRef>
        <RunTime>PT11M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-3-R-2-3">
        <From SequenceNumber="2">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500SSWAV013</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </From>
        <To SequenceNumber="3">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500SFEND004</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-2</RouteLinkRef>
        <RunTime>PT4M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-3-R-2-4">
        <From SequenceNumber="3">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500SFEND004</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </From>
        <To SequenceNumber="4">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500SFEND003</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-3</RouteLinkRef>
        <RunTime>PT1M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-3-R-2-5">
        <From SequenceNumber="4">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500SFEND003</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="5">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS007</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-4</RouteLinkRef>
        <RunTime>PT5M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-3-R-2-6">
        <From SequenceNumber="5">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS007</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="6">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS006</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-5</RouteLinkRef>
        <RunTime>PT1M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-3-R-2-7">
        <From SequenceNumber="6">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS006</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </From>
        <To SequenceNumber="7">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS003</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-6</RouteLinkRef>
        <RunTime>PT1M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-3-R-2-8">
        <From SequenceNumber="7">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS003</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="8">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HHEMG002</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-7</RouteLinkRef>
        <RunTime>PT3M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-3-R-2-9">
        <From SequenceNumber="8">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HHEMG002</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="9">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HHOLY010</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-8</RouteLinkRef>
        <RunTime>PT4M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-3-R-2-10">
        <From SequenceNumber="9">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HHOLY010</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="10">
          <Activity>setDown</Activity>
          <StopPointRef>0500HSTIV002</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-9</RouteLinkRef>
        <RunTime>PT6M</RunTime>
      </JourneyPatternTimingLink>
    </JourneyPatternSection>
    <JourneyPatternSection id="JPS_20-1A-A-y08-1-4-2-R">
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-4-R-2-2">
        <From SequenceNumber="1">
          <Activity>pickUp</Activity>
          <StopPointRef>0500SBARH011</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="2">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500SSWAV013</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-1</RouteLinkRef>
        <RunTime>PT11M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-4-R-2-3">
        <From SequenceNumber="2">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500SSWAV013</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </From>
        <To SequenceNumber="3">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500SFEND004</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-2</RouteLinkRef>
        <RunTime>PT4M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-4-R-2-4">
        <From SequenceNumber="3">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500SFEND004</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </From>
        <To SequenceNumber="4">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500SFEND003</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-3</RouteLinkRef>
        <RunTime>PT1M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-4-R-2-5">
        <From SequenceNumber="4">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500SFEND003</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="5">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS007</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-4</RouteLinkRef>
        <RunTime>PT5M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-4-R-2-6">
        <From SequenceNumber="5">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS007</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="6">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS006</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-5</RouteLinkRef>
        <RunTime>PT1M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-4-R-2-7">
        <From SequenceNumber="6">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS006</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </From>
        <To SequenceNumber="7">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS003</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-6</RouteLinkRef>
        <RunTime>PT1M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-4-R-2-8">
        <From SequenceNumber="7">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS003</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="8">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HHEMG002</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-7</RouteLinkRef>
        <RunTime>PT3M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-4-R-2-9">
        <From SequenceNumber="8">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HHEMG002</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="9">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HHOLY010</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-8</RouteLinkRef>
        <RunTime>PT6M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-4-R-2-10">
        <From SequenceNumber="9">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HHOLY010</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="10">
          <Activity>setDown</Activity>
          <StopPointRef>0500HSTIV002</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-2-9</RouteLinkRef>
        <RunTime>PT6M</RunTime>
      </JourneyPatternTimingLink>
    </JourneyPatternSection>
    <JourneyPatternSection id="JPS_20-1A-A-y08-1-5-3-R">
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-5-R-3-2">
        <From SequenceNumber="1">
          <Activity>pickUp</Activity>
          <StopPointRef>0500SBARH011</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="5">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS007</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-3-1</RouteLinkRef>
        <RunTime>PT8M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-5-R-3-3">
        <From SequenceNumber="5">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS007</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="6">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS006</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-3-2</RouteLinkRef>
        <RunTime>PT1M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-5-R-3-4">
        <From SequenceNumber="6">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS006</StopPointRef>
          <TimingStatus>TIP</TimingStatus>
        </From>
        <To SequenceNumber="7">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS003</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-3-3</RouteLinkRef>
        <RunTime>PT1M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-5-R-3-5">
        <From SequenceNumber="7">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HFENS003</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="8">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HHEMG002</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-3-4</RouteLinkRef>
        <RunTime>PT3M</RunTime>
      </JourneyPatternTimingLink>
      <JourneyPatternTimingLink id="JPL_20-1A-A-y08-1-5-R-3-6">
        <From SequenceNumber="8">
          <Activity>pickUpAndSetDown</Activity>
          <StopPointRef>0500HHEMG002</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To SequenceNumber="10">
          <Activity>setDown</Activity>
          <StopPointRef>0500HSTIV002</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>RL_20-1A-A-y08-1-R-3-5</RouteLinkRef>
        <RunTime>PT3M</RunTime>
      </JourneyPatternTimingLink>
    </JourneyPatternSection>
  </JourneyPatternSections>
  <Operators>
    <Operator id="OId_DEWS">
      <NationalOperatorCode>DEWS</NationalOperatorCode>
      <OperatorCode>DEWS</OperatorCode>
      <OperatorShortName>Dews Coaches</OperatorShortName>
      <OperatorNameOnLicence>Dews Coaches</OperatorNameOnLicence>
      <TradingName>Dews Coaches</TradingName>
    </Operator>
    <Operator id="OId_Dannys">
      <NationalOperatorCode>Dannys</NationalOperatorCode>
      <OperatorCode>Dannys</OperatorCode>
      <OperatorShortName>Dannys Coaches</OperatorShortName>
      <OperatorNameOnLicence>Dannys Coaches</OperatorNameOnLicence>
      <TradingName>Dannys Coaches</TradingName>
    </Operator>
  </Operators>
  <Services>
    <Service>
      <ServiceCode>20-1A-A-y08-1</ServiceCode>
      <PrivateCode>20-1A-A-y08-1</PrivateCode>
      <Lines>
        <Line id="20-1A-A-y08-1">
          <LineName>1A</LineName>
        </Line>
      </Lines>
      <OperatingPeriod>
        <StartDate>2019-12-17</StartDate>
        <EndDate>2020-06-20</EndDate>
      </OperatingPeriod>
      <OperatingProfile>
        <RegularDayType>
          <DaysOfWeek>
            <MondayToFriday />
          </DaysOfWeek>
        </RegularDayType>
      </OperatingProfile>
      <RegisteredOperatorRef>OId_DEWS</RegisteredOperatorRef>
      <StopRequirements>
        <NoNewStopsRequired />
      </StopRequirements>
      <Mode>bus</Mode>
      <Description>St Ives - Bar Hill</Description>
      <StandardService>
        <Origin>Bus Station</Origin>
        <Destination>Superstore</Destination>
        <JourneyPattern id="JP_20-1A-A-y08-1-1-R-1">
          <Direction>inbound</Direction>
          <RouteRef>R_20-1A-A-y08-1-R-1</RouteRef>
          <JourneyPatternSectionRefs>JPS_20-1A-A-y08-1-1-1-R</JourneyPatternSectionRefs>
        </JourneyPattern>
        <JourneyPattern id="JP_20-1A-A-y08-1-2-R-1">
          <Direction>inbound</Direction>
          <RouteRef>R_20-1A-A-y08-1-R-1</RouteRef>
          <JourneyPatternSectionRefs>JPS_20-1A-A-y08-1-2-1-R</JourneyPatternSectionRefs>
        </JourneyPattern>
        <JourneyPattern id="JP_20-1A-A-y08-1-3-R-2">
          <Direction>inbound</Direction>
          <RouteRef>R_20-1A-A-y08-1-R-2</RouteRef>
          <JourneyPatternSectionRefs>JPS_20-1A-A-y08-1-3-2-R</JourneyPatternSectionRefs>
        </JourneyPattern>
        <JourneyPattern id="JP_20-1A-A-y08-1-4-R-2">
          <Direction>inbound</Direction>
          <RouteRef>R_20-1A-A-y08-1-R-2</RouteRef>
          <JourneyPatternSectionRefs>JPS_20-1A-A-y08-1-4-2-R</JourneyPatternSectionRefs>
        </JourneyPattern>
        <JourneyPattern id="JP_20-1A-A-y08-1-5-R-3">
          <Direction>inbound</Direction>
          <RouteRef>R_20-1A-A-y08-1-R-3</RouteRef>
          <JourneyPatternSectionRefs>JPS_20-1A-A-y08-1-5-3-R</JourneyPatternSectionRefs>
        </JourneyPattern>
      </StandardService>
    </Service>
  </Services>
  <VehicleJourneys>
    <VehicleJourney>
      <PrivateCode>ea-20-1A-A-y08-1-69-UP</PrivateCode>
      <OperatingProfile>
        <RegularDayType>
          <DaysOfWeek>
            <Friday />
          </DaysOfWeek>
        </RegularDayType>
        <SpecialDaysOperation>
          <DaysOfNonOperation>
            <DateRange>
              <StartDate>2019-12-20</StartDate>
              <EndDate>2019-12-20</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-01-03</StartDate>
              <EndDate>2020-01-03</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-01-10</StartDate>
              <EndDate>2020-01-10</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-01-17</StartDate>
              <EndDate>2020-01-17</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-01-24</StartDate>
              <EndDate>2020-01-24</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-01-31</StartDate>
              <EndDate>2020-01-31</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-02-07</StartDate>
              <EndDate>2020-02-07</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-02-14</StartDate>
              <EndDate>2020-02-14</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-02-21</StartDate>
              <EndDate>2020-02-21</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-02-28</StartDate>
              <EndDate>2020-02-28</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-03-06</StartDate>
              <EndDate>2020-03-06</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-03-13</StartDate>
              <EndDate>2020-03-13</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-03-20</StartDate>
              <EndDate>2020-03-20</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-03-27</StartDate>
              <EndDate>2020-03-27</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-04-03</StartDate>
              <EndDate>2020-04-03</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-04-17</StartDate>
              <EndDate>2020-04-17</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-04-24</StartDate>
              <EndDate>2020-04-24</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-05-01</StartDate>
              <EndDate>2020-05-01</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-05-08</StartDate>
              <EndDate>2020-05-08</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-05-15</StartDate>
              <EndDate>2020-05-15</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-05-22</StartDate>
              <EndDate>2020-05-22</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-05-29</StartDate>
              <EndDate>2020-05-29</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-06-05</StartDate>
              <EndDate>2020-06-05</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-06-12</StartDate>
              <EndDate>2020-06-12</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-06-19</StartDate>
              <EndDate>2020-06-19</EndDate>
            </DateRange>
          </DaysOfNonOperation>
        </SpecialDaysOperation>
        <BankHolidayOperation>
          <DaysOfNonOperation>
            <ChristmasDay />
            <BoxingDay />
            <GoodFriday />
            <NewYearsDay />
            <MayDay />
            <EasterMonday />
            <SpringBank />
          </DaysOfNonOperation>
        </BankHolidayOperation>
      </OperatingProfile>
      <VehicleJourneyCode>VJ_20-1A-A-y08-1-69-UP</VehicleJourneyCode>
      <ServiceRef>20-1A-A-y08-1</ServiceRef>
      <LineRef>20-1A-A-y08-1</LineRef>
      <JourneyPatternRef>JP_20-1A-A-y08-1-1-R-1</JourneyPatternRef>
      <DepartureTime>07:52:00</DepartureTime>
    </VehicleJourney>
    <VehicleJourney>
      <PrivateCode>ea-20-1A-A-y08-1-70-UP</PrivateCode>
      <OperatingProfile>
        <RegularDayType>
          <DaysOfWeek>
            <Friday />
          </DaysOfWeek>
        </RegularDayType>
        <SpecialDaysOperation>
          <DaysOfNonOperation>
            <DateRange>
              <StartDate>2019-12-20</StartDate>
              <EndDate>2019-12-20</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-01-03</StartDate>
              <EndDate>2020-01-03</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-01-10</StartDate>
              <EndDate>2020-01-10</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-01-17</StartDate>
              <EndDate>2020-01-17</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-01-24</StartDate>
              <EndDate>2020-01-24</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-01-31</StartDate>
              <EndDate>2020-01-31</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-02-07</StartDate>
              <EndDate>2020-02-07</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-02-14</StartDate>
              <EndDate>2020-02-14</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-02-21</StartDate>
              <EndDate>2020-02-21</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-02-28</StartDate>
              <EndDate>2020-02-28</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-03-06</StartDate>
              <EndDate>2020-03-06</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-03-13</StartDate>
              <EndDate>2020-03-13</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-03-20</StartDate>
              <EndDate>2020-03-20</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-03-27</StartDate>
              <EndDate>2020-03-27</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-04-03</StartDate>
              <EndDate>2020-04-03</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-04-17</StartDate>
              <EndDate>2020-04-17</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-04-24</StartDate>
              <EndDate>2020-04-24</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-05-01</StartDate>
              <EndDate>2020-05-01</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-05-08</StartDate>
              <EndDate>2020-05-08</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-05-15</StartDate>
              <EndDate>2020-05-15</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-05-22</StartDate>
              <EndDate>2020-05-22</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-05-29</StartDate>
              <EndDate>2020-05-29</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-06-05</StartDate>
              <EndDate>2020-06-05</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-06-12</StartDate>
              <EndDate>2020-06-12</EndDate>
            </DateRange>
            <DateRange>
              <StartDate>2020-06-19</StartDate>
              <EndDate>2020-06-19</EndDate>
            </DateRange>
          </DaysOfNonOperation>
        </SpecialDaysOperation>
        <BankHolidayOperation>
          <DaysOfNonOperation>
            <ChristmasDay />
            <BoxingDay />
            <GoodFriday />
            <NewYearsDay />
            <MayDay />
            <EasterMonday />
            <SpringBank />
          </DaysOfNonOperation>
        </BankHolidayOperation>
      </OperatingProfile>
      <VehicleJourneyCode>VJ_20-1A-A-y08-1-70-UP</VehicleJourneyCode>
      <ServiceRef>20-1A-A-y08-1</ServiceRef>
      <LineRef>20-1A-A-y08-1</LineRef>
      <JourneyPatternRef>JP_20-1A-A-y08-1-2-R-1</JourneyPatternRef>
      <DepartureTime>17:03:00</DepartureTime>
    </VehicleJourney>
  </VehicleJourneys>
</TransXChange>
`;
