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

export const createArray = (index: number, mockNaptanData: ParsedData) => {
  const array = [];
  for (let i = 0; i < index; i++) {
    array.push(mockNaptanData);
  };
  return array;
};
