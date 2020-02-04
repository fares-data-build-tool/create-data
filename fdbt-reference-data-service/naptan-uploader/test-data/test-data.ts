import { ParsedData } from "./../handler";

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

export const mockNaptanData = {
  ATCOCode: "0100BRP90171",
  NaptanCode: "bstjwja",
  PlateCode: "",
  CleardownCode: "",
  CommonName: "Glen Park",
  CommonNameLang: "en",
  ShortCommonName: "",
  ShortCommonNameLang: "",
  Landmark: "",
  LandmarkLang: "",
  Street: "",
  StreetLang: "",
  Crossing: "",
  CrossingLang: "",
  Indicator: "NE-bound",
  IndicatorLang: "en",
  Bearing: "NE",
  NptgLocalityCode: "E0035600",
  LocalityName: "Eastville",
  ParentLocalityName: "Bristol",
  GrandParentLocalityName: "",
  Town: "",
  TownLang: "",
  Suburb: "",
  SuburbLang: "",
  LocalityCentre: 0,
  GridType: "U",
  Easting: 361180,
  Northing: 174902,
  Longitude: -2.5602943871,
  Latitude: 51.4717433191,
  StopType: "BCT",
  BusStopType: "MKD",
  TimingStatus: "OTH",
  DefaultWaitTime: "",
  Notes: "",
  NotesLang: "",
  AdministrativeAreaCode: "009",
  CreationDateTime: "2020-01-07T13:51:40",
  ModificationDateTime: "2018-07-12T14:12:08",
  RevisionNumber: "37",
  Modification: "new",
  Status: "act"
};

export const mockReformattedNaptanData = {
  Partition: "0100BRP90171",
  ATCOCode: "0100BRP90171",
  NaptanCode: "bstjwja",
  PlateCode: "",
  CleardownCode: "",
  CommonName: "Glen Park",
  CommonNameLang: "en",
  ShortCommonName: "",
  ShortCommonNameLang: "",
  Landmark: "",
  LandmarkLang: "",
  Street: "",
  StreetLang: "",
  Crossing: "",
  CrossingLang: "",
  Indicator: "NE-bound",
  IndicatorLang: "en",
  Bearing: "NE",
  NptgLocalityCode: "E0035600",
  LocalityName: "Eastville",
  ParentLocalityName: "Bristol",
  GrandParentLocalityName: "",
  Town: "",
  TownLang: "",
  Suburb: "",
  SuburbLang: "",
  LocalityCentre: 0,
  GridType: "U",
  Easting: 361180,
  Northing: 174902,
  Longitude: -2.5602943871,
  Latitude: 51.4717433191,
  StopType: "BCT",
  BusStopType: "MKD",
  TimingStatus: "OTH",
  DefaultWaitTime: "",
  Notes: "",
  NotesLang: "",
  AdministrativeAreaCode: "009",
  CreationDateTime: "2020-01-07T13:51:40",
  ModificationDateTime: "2018-07-12T14:12:08",
  RevisionNumber: "37",
  Modification: "new",
  Status: "act"
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

export const testCsv: string = "ATCOCode,NaptanCode,PlateCode,CleardownCode,CommonName,CommonNameLang,ShortCommonName,ShortCommonNameLang,Landmark,LandmarkLang,Street,StreetLang,Crossing,CrossingLang,Indicator,IndicatorLang,Bearing,NptgLocalityCode,LocalityName,ParentLocalityName,GrandParentLocalityName,Town,TownLang,Suburb,SuburbLang,LocalityCentre,GridType,Easting,Northing,Longitude,Latitude,StopType,BusStopType,TimingStatus,DefaultWaitTime,Notes,NotesLang,AdministrativeAreaCode,CreationDateTime,ModificationDateTime,RevisionNumber,Modification,Status\n" +
"0100053316,danny,,,Broad Walk Shops,en,,,,,,,,,Stop B,en,SW,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359268,173148,-2.5876178397,51.4558382170,BCT,MKD,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T14:41:57,24,del,del\n" +
"0100053264,bstmjdp,,,Alberton Road,en,,,,,Alberton Road,en,,,NE-bound,en,NE,N0076879,Bristol City Centre,Bristol,,,,,,0,U,362555,176810,-2.5407019785,51.4889912765,BCT,CUS,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T14:26:49,9,del,del\n" +
"0100053308,bstgtgj,,,Counterslip,en,,,,,Counterslip,en,,,SW-bound,en,SW,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359264,173133,-2.5876736730,51.4557030625,BCT,MKD,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T14:46:28,12,del,del\n" +
"0100053306,bstapjm,,,Risdale Road,en,,,,,Risdale Road,en,,,SW-bound,en,SW,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359255,173138,-2.5878037737,51.4557473682,BCT,CUS,OTH,,,,009,2017-07-25T15:33:15,2017-07-04T15:11:27,18,del,del\n" +
"010000015,bstpgpa,,,Kings Head Lane,en,,,,,Kings Head Lane,en,,,Stop D,en,SE,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359255,173135,-2.5878034271,51.4557203950,BCT,MKD,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T14:38:04,57,del,del\n" +
"0100053309,bstawga,,,Northcote Road,en,,,,,Guthrie Road,en,,,NE-bound,en,NE,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359271,173143,-2.5875740878,51.4557934781,BCT,MKD,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T14:50:29,17,del,del\n" +
"0100053330,bstdjtd,,,Ilchester Crescent,en,,,,,Ilchester Crescent,en,,,Stop C,en,SW,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359267,173148,-2.5876322312,51.4558381448,BCT,MKD,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T15:09:15,13,del,del\n" +
"0100053331,bstdjmg,,,Ilchester Crescent,en,,,,,Ilchester Crescent,en,,,Stop D,en,S,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359263,173146,-2.5876895661,51.4558198741,BCT,MKD,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T15:08:36,15,del,del\n" +
"0100053332,bstdjmw,,,Brooklyn Road,en,,,,,Brooklyn Road,en,,,Stop A,en,S,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359277,173146,-2.5874880853,51.4558208842,BCT,MKD,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T15:14:36,20,del,del\n" +
"0100053333,bstdjdm,,,Brooklyn Road,en,,,,,Brooklyn Road,en,,,S-bound,en,S,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359282,173147,-2.5874162433,51.4558302359,BCT,MKD,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T15:14:26,20,del,del\n" +
"0100053334,bstdgjm,,,Lewis Road,en,,,,,Lewis Road,en,,,N-bound,en,N,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359264,173140,-2.5876744816,51.4557659999,BCT,MKD,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T15:30:59,17,del,del\n" +
"0100053335,bstdgtd,,,Lewis Road,en,,,,,Lewis Road,en,,,N-bound,en,N,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359268,173133,-2.5876161072,51.4557033511,BCT,MKD,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T15:21:09,15,del,del\n" +
"0100053338,bstdpgj,,,Bedminster Road,en,,,,,Bedminster Road,en,,,SW-bound,en,SW,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359265,173143,-2.5876604366,51.4557930452,BCT,MKD,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T15:47:43,17,del,del\n" +
"0100053342,bstjdam,,,Henry St Green Street,en,,,,,Henry Street,en,,,N-bound,en,N,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359264,173142,-2.5876747126,51.4557839820,BCT,CUS,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T15:47:53,16,del,del\n" +
"0100053328,bstdjaj,,,Ilchester Crescent,en,,,,,Ilchester Crescent,en,,,A,en,N,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359256,173152,-2.5877909997,51.4558733152,BCT,MKD,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T15:08:54,15,del,del\n" +
"0100053329,bstdjdp,,,Ilchester Crescent,en,,,,,Ilchester Crescent,en,,,Stop B,en,NE,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359258,173145,-2.5877614080,51.4558105222,BCT,MKD,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T15:09:06,15,del,del\n" +
"0100053324,bstatmd,,,Swiss Road,en,,,,,South Liberty Lane,en,,,SW-bound,en,SW,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359269,173135,-2.5876019468,51.4557214054,BCT,CUS,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T15:55:24,15,del,del\n" +
"0100053325,bstatjw,,,Swiss Road,en,,,,,South Liberty Lane,en,,,NE-bound,en,NE,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359270,173137,-2.5875877863,51.4557394596,BCT,CUS,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T15:55:24,15,del,del\n" +
"0100053344,bstamwp,,,Ashton Park School,en,,,,,,,,,NW-bound,en,NW,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359266,173140,-2.5876456986,51.4557661442,BCT,MKD,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T15:30:50,30,del,del\n" +
"0100053262,bstjpwd,,,Ikea Car Park,en,,,,,Eastgate Road,en,,,N-bound,en,N,N0076879,Bristol City Centre,Bristol,,,,,,0,U,359264,173135,-2.5876739040,51.4557210446,BCT,MKD,OTH,,,,009,2017-07-25T15:33:15,2017-07-17T14:38:42,14,del,del\n" +
"0100BRP90168,bstjpad,,,Warwick Road,en,,,,,Stapleton Road,en,,,N-bound,en,N,E0035600,Eastville,Bristol,,,,,,0,U,360594,174345,-2.5686684729,51.4666946645,BCT,MKD,OTH,,,,009,2020-01-07T13:51:40,2017-04-21T17:26:03,10,new,act";

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