import { S3Event, S3Handler } from "aws-lambda";
import AWS from "aws-sdk";
import { setS3ObjectParams } from "../handler";
import { Context, Callback } from 'aws-lambda';
import MockContext from 'aws-lambda-mock-context';
import AWSMock from 'aws-sdk-mock';

describe('formatDynamoWriteRequest', () =>{
    it('should return data in correct format as a DynamoDB WriteEquest', () =>{






    expect().toBe();    
    }); 
    it('should return a batch of DynamoDB WriteRequests', () =>{



    expect().toBe();    
    });
    it('should return empty an array when given zero items', () =>{




    expect().toBe();
    });
    it('should return an array when given between less then 25 items', () =>{



    expect().toBe();
    });
    it('should return an array when given more than 25 items', () =>{




    expect().toBe();
    });
});

describe('setS3ObjectParams', () =>{
    it('should assign S3FileName and S3BucketName from the S3 Event', () =>{
    const expected = {
        Bucket: "fdbt-test-bucket",
        Key: "fdbt-test-key"
    };

    const testEvent: S3Event = {Records:[  
               {  
                  s3:{  
                     bucket:{  
                         name: "fdbt-test-bucket",
                         ownerIdentity: {
                            principalId: "abab";
                        };
                        arn: "abab";
                    }
                     },
                     object:{  
                        key:"fdbt-test-key",
                     }
                  },
               }
            ]
         };

    const result 





    expect(result).toBe(expected);
    }); 
});

describe('S3 Host', () =>{
    it('should set tableName when environment variable is set', () =>{




    expect().toBe();
    }); 
    it('should error when environment variable is not set', () =>{




    expect().toBe();
    });
});
