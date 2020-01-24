import { ParsedData } from "../handler";

export const mockS3Event = (bucketName: string, fileName: string) => ({
  Records: [
    {
      eventVersion: "",
      eventSource: "",
      awsRegion: "",
      eventTime: "",
      eventName: "",
      userIdentity: {
        principalId: ""
      },
      requestParameters: {
        sourceIPAddress: ""
      },
      responseElements: {
        "x-amz-request-id": "",
        "x-amz-id-2": ""
      },
      s3: {
        s3SchemaVersion: "",
        configurationId: "",
        bucket: {
          name: bucketName,
          ownerIdentity: {
            principalId: ""
          },
          arn: ""
        },
        object: {
          key: fileName,
          size: 1,
          eTag: "",
          versionId: "",
          sequencer: ""
        }
      },
      glacierEventData: {
        restoreEventData: {
          lifecycleRestorationExpiryTime: "",
          lifecycleRestoreStorageClass: ""
        }
      }
    }
  ]
});

export const mockNocData = {
  id: "",
  NOCCODE: "",
  OperatorPublicName: "",
  VOSA_PSVLicenseName: "",
  OpId: 1,
  PubNmId: 1,
  Mode: "",
  TTRteEnq: "",
  FareEnq: "",
  ComplEnq: "",
  Website: ""
};

export const createArray = (index: number, mockNaptanData: ParsedData): ParsedData[] => {
  const array: ParsedData[] = [];
  for (let i = 0; i < index; i++) {
    array.push(mockNaptanData);
  };
  return array;
};

export const createBatchOfWriteRequests = (index: number, mockNaptanData: ParsedData): AWS.DynamoDB.WriteRequest[] => {
  const batchOfWriteRequests: AWS.DynamoDB.WriteRequest[] = [];
  for (let i = 0; i < index; i++) {
    batchOfWriteRequests.push(
      {
        PutRequest: {
          Item: mockNaptanData as any
        }
      }
    );
  };
  return batchOfWriteRequests;
};

export const testCsv: string = "RowId,RegionCode,RegionOperatorCode,ServiceCode,LineName,Description,StartDate,NationalOperatorCode\n" +
    "1,EA,703BE,9-91-_-y08-11,91,Ipswich - Hadleigh - Sudbury,2019-12-03,BEES\n" +
    "2,EA,753BDR,26-SJL-8-y08-2,SJL8,Blundeston - Sir John Leman School,2019-12-03,BDRB\n" +
    "3,EA,767STEP,7-985-_-y08-4,985,Bury St Edmunds Schools - Risby,2019-12-03,SESX\n" +
    "4,EA,A2BR,20-18-A-y08-1,18,Newmarket - Fulbourn - Teversham - Newmarket Road Park & Ride,2019-12-03,A2BR\n" +
    "5,EA,A2BR,20-32-_-y08-1,32,Trumpington P & R - Hauxton,2019-12-03,A2BR"

export function isJSON(str:any) {
    try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
}

export const testXml: string = `<?xml version="1.0" encoding="utf-8"?>
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
</TransXChange>`