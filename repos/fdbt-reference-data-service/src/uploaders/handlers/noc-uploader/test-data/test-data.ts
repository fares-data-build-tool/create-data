/* eslint-disable @typescript-eslint/camelcase */

import { S3Event } from 'aws-lambda';
import { ParsedData } from '../handler';

export const mockNocLineArray = [
    {
        NOCCODE: 'dannynoc',
        Mode: 'dannymode',
    },
    {
        NOCCODE: 'robnoc',
        Mode: 'robmode',
    },
];

export const mockNocTableArray = [
    {
        NOCCODE: 'dannynoc',
        OperatorPublicName: 'dannyop',
        VOSA_PSVLicenseName: 'dannyvosa',
        OpId: 3,
        PubNmId: 3,
    },
    {
        NOCCODE: 'robnoc',
        OperatorPublicName: 'robop',
        VOSA_PSVLicenseName: 'robvosa',
        OpId: 4,
        PubNmId: 4,
    },
];

export const mockPublicNameArray = [
    {
        PubNmId: 3,
        TTRteEnq: 'dannyenq',
        FareEnq: 'dannyfarreenq',
        ComplEnq: 'dannycomplenq',
        Website: 'dannyweb',
    },
    {
        PubNmId: 4,
        TTRteEnq: 'robttrenq',
        FareEnq: 'robfareenq',
        ComplEnq: 'robcomplenq',
        Website: 'robweb',
    },
];

export const mockExpectedMergedArray = [
    {
        NOCCODE: 'dannynoc',
        Mode: 'dannymode',
        OperatorPublicName: 'dannyop',
        VOSA_PSVLicenseName: 'dannyvosa',
        OpId: 3,
        PubNmId: 3,
        TTRteEnq: 'dannyenq',
        FareEnq: 'dannyfarreenq',
        ComplEnq: 'dannycomplenq',
        Website: 'dannyweb',
    },
    {
        NOCCODE: 'robnoc',
        Mode: 'robmode',
        OperatorPublicName: 'robop',
        VOSA_PSVLicenseName: 'robvosa',
        OpId: 4,
        PubNmId: 4,
        TTRteEnq: 'robttrenq',
        FareEnq: 'robfareenq',
        ComplEnq: 'robcomplenq',
        Website: 'robweb',
    },
];

export const mockS3ListThreeKeys = [
    {
        ETag: '"70ee1738b6b21e2c8a43f3a5ab0eee71"',
        Key: 'happyface.jpg',
        LastModified: '<Date Representation>',
        Size: 11,
        StorageClass: 'STANDARD',
    },
    {
        ETag: '"becf17f89c30367a9a44495d62ed521a-1"',
        Key: 'test.jpg',
        LastModified: '<Date Representation>',
        Size: 4192256,
        StorageClass: 'STANDARD',
    },
    {
        ETag: '"becf17f89c30367a9a44495d62ed521a-1"',
        Key: 'bus.jpg',
        LastModified: '<Date Representation>',
        Size: 44444,
        StorageClass: 'STANDARD',
    },
];

export const mockS3ListOneKey = [
    {
        ETag: '"becf17f89c30367a9a44495d62ed521a-1"',
        Key: 'bus.jpg',
        LastModified: '<Date Representation>',
        Size: 44444,
        StorageClass: 'STANDARD',
    },
];

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

export const mockNocData = {
    id: '',
    NOCCODE: 'dan',
    OperatorPublicName: '',
    VOSA_PSVLicenseName: '',
    OpId: 1,
    PubNmId: 1,
    Mode: '',
    TTRteEnq: '',
    FareEnq: '',
    ComplEnq: '',
    Website: '',
};

export const reformattedMockNocData = {
    id: '',
    NOCCODE: 'dan',
    OperatorPublicName: '',
    VOSA_PSVLicenseName: '',
    OpId: 1,
    PubNmId: 1,
    Mode: '',
    TTRteEnq: '',
    FareEnq: '',
    ComplEnq: '',
    Website: '',
    Partition: 'dan',
};

export const createArray = (index: number, mockNaptanData: ParsedData): ParsedData[] => {
    const array: ParsedData[] = [];
    for (let i = 0; i < index; i += 1) {
        array.push(mockNaptanData);
    }
    return array;
};

export const createBatchOfWriteRequests = (index: number, mockNaptanData: ParsedData): AWS.DynamoDB.WriteRequest[] => {
    const batchOfWriteRequests: AWS.DynamoDB.DocumentClient.WriteRequest[] = [];
    for (let i = 0; i < index; i += 1) {
        batchOfWriteRequests.push({
            PutRequest: {
                Item: mockNaptanData,
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

export const mockServicesData = {
    RowId: '5',
    NationalOperatorCode: 'A2BR',
    LineName: '32',
    RegionCode: 'EA',
    RegionOperatorCode: 'A2BR',
    Description: 'Trumpington P & R - Hauxton',
    ServiceCode: '20-32-_-y08-1',
    StartDate: '2019-12-03',
};

export const publicNameCsvData: string =
    'PubNmId,OperatorPublicName,PubNmQual,TTRteEnq,FareEnq,LostPropEnq,DisruptEnq,ComplEnq,Twitter,Facebook,LinkedIn,YouTube,ChangeDate,ChangeAgent,ChangeComment,CeasedDate,DataOwner,Website\n' +
    '93088,1st Bus Stop Minibus,,cliff1stbusstop@aol.com,01474 326777,,,16 Lyndhurst Way Istead Rise Gravesend Kent DA13 9EW,,,,,,,,,,\n' +
    '93089,1st Choice Transport Ltd,,info@1stchoiceltd.co.uk,01554759888,,,The Transport Depot Sandy Road Llanelli SA15 4DP,,,,,,,,,,www.1stchoiceltdcoachhire.co.uk#http://www.1stchoiceltdcoachhire.co.uk#\n' +
    '93090,2 Way Transport,,,01724 289399,,,29-30 High Santon Villas High Santon  Scunthorpe DN15 0DG,,,,,,,,,,www.2waytransport-scunthorpe.co.uk/#http://www.2waytransport-scunthorpe.co.uk/#\n' +
    '93091,24-7 Recruitment Services,,darren247cars@btinternet.com,01603 782247,,,1 New Cottage Norwich Road Horstead NR12 7BA,,,,,,,,,,#http://247taxiswroxham.tel#\n' +
    '93093,A & A Coach Travel (Yorkshire),,info@a-atravel.co.uk,01423325300,,,The Control Tower offices The Airfield Fleet Lane Tockwith York YO26 7QF,,,,,,,,,,#http://www.a-atravel.co.uk/#\n' +
    '93096,A & G Minibuses,,agminibusesltd@hotmail.com,01985218754,,,Paddock Wood Bradley Road Warminster BA12 7JY,,,,,,,,,,#http://www.aandgminibuses.com/index.html#';

export const nocTableCsvData: string =
    'NOCCODE,OperatorPublicName,VOSA_PSVLicenseName,OpId,PubNmId,NOCCdQual,ChangeDate,ChangeAgent,ChangeComment,DateCeased,DataOwner\n' +
    '1CTL,1st Choice Transport Ltd,1St Choice Transport Ltd,135427,93089,,,,,,\n' +
    '247T,247 Taxis,,138133,95943,,2016-07-26 00:00:00,Steven Penn,Created for Stuart Reynolds,,\n' +
    '2WTR,2 Way Transport,2 Way Transport,135428,93090,,,,,,\n' +
    '3DCO,3D Coaches,Peter Kermeen & Elaine Fletcher,137388,93092,,,,,,\n' +
    '5STR,Five Star International Travel,Philip Riley,137408,94084,,,,,,\n' +
    '8H,Highland Airways,Highland Airways,136620,94334,,,,,,\n';

export const nocLinesCsvData: string =
    'NOCLineNo,NOCCODE,PubNm,RefNm,Licence,Mode,TLRegOwn,EBSRAgent,LO,SW,WM,WA,YO,NW,NE,SC,SE,EA,EM,NI,NX,Megabus,New Bharat,Terravision,NCSD,Easybus,Yorks_RT,Travel Enq,Comment,AuditDate,AuditEditor,AuditComment,Duplicate,Date Ceased,Cessation Comment\n' +
    '9080,=AW,Transport for Wales,Transport for Wales (ATOC),,Rail,Admin,,,,=AW,=AW,,,AW,,=AW,=AW,=AW,,,,,,,,,,,2018-11-06 00:00:00,Amy Brown,Updated public name,OK,,\n' +
    '9081,=CC,c2c,c2c (ATOC),,Rail,Admin,,,,=CC,=CC,,,CC,,=CC,=CC,=CC,,,,,,,,,,,2010-03-31 00:00:00,Mark Fell,Intial NOC Build,OK,,\n' +
    '9082,=CH,Chiltern Railways,Chiltern Railways (ATOC),,Rail,Admin,,,,=CH,=CH,,,CH,,=CH,=CH,=CH,,,,,,,,,,,2010-03-31 00:00:00,Mark Fell,Intial NOC Build,OK,,\n' +
    '9083,=CS,Caledonian Sleeper,Caledonian Sleeper (ATOC),,Rail,Admin,,,,=CS,=CS,,,CS,,=CS,=CS,=CS,,,,,,,,,,,2015-02-03 00:00:00,John Prince,Added for Roger Slevin,OK,,\n' +
    '9084,=EM,East Midlands Railway,East Midlands Railway (ATOC),,Rail,Admin,Stagecoach,,,=EM,=EM,,,EM,,=EM,=EM,=EM,,,,,,,,,,,2019-08-21 00:00:00,Amy Brown,Updated name and group info,OK,,\n' +
    '9085,=ES,Eurostar,Eurostar (ATOC),,Rail,Admin,,,,=EP,=ES,,,ES,,=ES,=ES,=ES,,,,,,,,,,,2010-03-31 00:00:00,Mark Fell,Intial NOC Build,OK,,\n' +
    '9086,=FC,First Capital Connect,,,Rail,Admin,,,,=FC,=FC,,,FC,,=FC,=FC,=FC,,,,,,,,,,,2015-06-09 00:00:00,John Prince,Strikethrough SE code,OK,2014-09-13 00:00:00,\n' +
    '9087,=GC,Grand Central,Grand Central Trains (ATOC),,Rail,Admin,,,,=GC,=GC,,,GC,,=GC,=GC,=GC,,,,,,,,,,,2010-03-31 00:00:00,Mark Fell,Intial NOC Build,OK,,\n';

export const testXml = `<?xml version=1.0" encoding="utf-8"?>
<TransXChange xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xsi:schemaLocation="http://www.transxchange.org.uk/ http://www.transxchange.org.uk/schema/2.5/TransXChange_general.xsd" CreationDateTime="2019-11-26T10:18:00-00:00" ModificationDateTime="2019-11-26T10:18:00-00:00" Modification="new" RevisionNumber="0" FileName="SVRYHAO999.xml" SchemaVersion="2.5" RegistrationDocument="true" xmlns="http://www.transxchange.org.uk/">
<StopPoints>
    <AnnotatedStopPointRef>
      <StopPointRef>2290YHA01586</StopPointRef>
      <CommonName>Hull Interchange</CommonName>
    </AnnotatedStopPointRef>
    <AnnotatedStopPointRef>
      <StopPointRef>2290YHA01512</StopPointRef>
      <CommonName>Carr Lane A</CommonName>
    </AnnotatedStopPointRef>
  </StopPoints>
  <RouteSections>
    <RouteSection id="YHAO999_001">
      <RouteLink id="YHAO999_001_28549">
        <From>
          <StopPointRef>2290YHA01586</StopPointRef>
        </From>
        <To>
          <StopPointRef>2290YHA01512</StopPointRef>
        </To>
        <Direction>outbound</Direction>
      </RouteLink>
    </RouteSection>
  </RouteSections>
  <Routes>
    <Route id="YHAO999_001">
      <Description>Hull Interchange - Monument Bridge
</Description>
      <RouteSectionRef>YHAO999_001</RouteSectionRef>
    </Route>
  </Routes>
  <JourneyPatternSections>
    <JourneyPatternSection id="JPS_YHAO999-2">
      <JourneyPatternTimingLink id="JPS_YHAO999-2_28549">
        <From>
          <StopPointRef>2290YHA01586</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </From>
        <To>
          <StopPointRef>2290YHA01512</StopPointRef>
          <TimingStatus>PTP</TimingStatus>
        </To>
        <RouteLinkRef>YHAO999_001_28549</RouteLinkRef>
        <Direction>outbound</Direction>
        <RunTime>PT300S</RunTime>
      </JourneyPatternTimingLink>
    </JourneyPatternSection>
  </JourneyPatternSections>
  <Operators>
    <Operator id="SCH">
      <NationalOperatorCode>CLTL</NationalOperatorCode>
      <OperatorCode>SCH</OperatorCode>
      <OperatorShortName>Stagecoach in Hull</OperatorShortName>
    </Operator>
  </Operators>
  <Services>
    <Service>
      <ServiceCode>YHAO999</ServiceCode>
      <Lines>
        <Line id="0">
          <LineName>999</LineName>
        </Line>
      </Lines>
      <OperatingPeriod>
        <StartDate>2019-11-21</StartDate>
      </OperatingPeriod>
      <RegisteredOperatorRef>SCH</RegisteredOperatorRef>
      <StopRequirements>
        <NoNewStopsRequired />
      </StopRequirements>
      <Mode>bus</Mode>
      <Description>Hull Interchange - Monument Bridge</Description>
      <StandardService>
        <Origin>Hull Interchange</Origin>
        <Destination>Monument Bridge</Destination>
        <JourneyPattern id="JPS_YHAO999-2">
          <Direction>outbound</Direction>
          <JourneyPatternSectionRefs>JPS_YHAO999-2</JourneyPatternSectionRefs>
        </JourneyPattern>
      </StandardService>
    </Service>
  </Services>
  <VehicleJourneys>
    <VehicleJourney>
      <OperatorRef>SCH</OperatorRef>
      <OperatingProfile>
        <RegularDayType>
          <DaysOfWeek>
            <Monday />
            <Tuesday />
            <Wednesday />
            <Thursday />
            <Friday />
            <Saturday />
            <Sunday />
          </DaysOfWeek>
        </RegularDayType>
        <BankHolidayOperation>
          <DaysOfNonOperation>
            <ChristmasDay />
            <BoxingDay />
            <NewYearsDay />
          </DaysOfNonOperation>
        </BankHolidayOperation>
      </OperatingProfile>
      <VehicleJourneyCode>6139</VehicleJourneyCode>
      <ServiceRef>YHAO999</ServiceRef>
      <LineRef>0</LineRef>
      <JourneyPatternRef>JPS_YHAO999-2</JourneyPatternRef>
      <DepartureTime>15:00:00</DepartureTime>
    </VehicleJourney>
  </VehicleJourneys>
  <ADE></ADE>
</TransXChange>`;
