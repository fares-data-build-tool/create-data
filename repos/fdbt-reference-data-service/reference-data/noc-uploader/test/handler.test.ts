import { S3Event } from "aws-lambda";
import { setS3ObjectParams } from "../handler";


// describe('formatDynamoWriteRequest', () =>{
//     it('should return data in correct format as a DynamoDB WriteRequest', () =>{






       
//     }); 
//     it('should return a batch of DynamoDB WriteRequests', () =>{



        
//     });
//     it('should return empty an array when given zero items', () =>{




    
//     });
//     it('should return an array when given between less then 25 items', () =>{



    
//     });
//     it('should return an array when given more than 25 items', () =>{




    
//     });
// });

describe("setS3ObjectParams", () =>{
    it("should assign S3FileName and S3BucketName from the S3 Event", () =>{
        const expected = {
        Bucket: "fdbt-test-bucket",
        Key: "fdbt-test-key"
        };
        const testEvent: S3Event = {Records:[  
            {
                eventVersion: "string",
                eventSource: "string",
                awsRegion: "string",
                eventTime: "string",
                eventName: "string",
                userIdentity: {
                    principalId: "string",
                },
                requestParameters: {
                    sourceIPAddress: "string",
                },
                responseElements: {
                    'x-amz-request-id': "string",
                    'x-amz-id-2': "string",
                },
                s3: {
                    s3SchemaVersion: "string",
                    configurationId: "string",
                    bucket: {
                        name: "fdbt-test-bucket",
                        ownerIdentity: {
                            principalId: "string",
                        },
                        arn: "string",
                    },
                    object: {
                        key: "fdbt-test-key",
                        size: 1234,
                        eTag: "string",
                        sequencer: "string",
                    },
                },
            },
            ]
         };
        const result = setS3ObjectParams(testEvent);
        expect(result).toEqual(expected);
    }); 
});

// describe('S3 Host', () =>{
//     it('should set tableName when environment variable is set', () =>{




    
//     }); 
//     it('should error when environment variable is not set', () =>{




    
//     });
// });
