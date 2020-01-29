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