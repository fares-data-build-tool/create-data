import { formatDynamoWriteRequest } from "../handler";

describe('formatDynamoWriteRequest', () =>{
    it('should return data in correct format as a DynamoDB WriteRequest', () =>{
    
    interface dynamoDBData {
        id: any;
        NCOCODE: string;
        OperatorPublicName: string;
        VOSA_PSVLicenseName: string;
        OpId: number;
        PubNmId: number;
        Mode: string;
        TTRteEnq: string;
        FareEnq: string;
        ComplEnq: string;
        Website: string;
    }

    const expected = [[
        {
          PutRequest: {
            Item: {
                id: "xxxx",
                NCOCODE: "xxxx",
                OperatorPublicName: "xxxx",
                VOSA_PSVLicenseName: "xxxx",
                OpId: 1234,
                PubNmId: 1234,
                Mode: "xxxx",
                TTRteEnq: "xxxx",
                FareEnq: "xxxx",
                ComplEnq: "xxxx",
                Website: "xxxx",
            }
          }
        },
    ]];

    const testLines: dynamoDBData[] = [{
        id: "xxxx",
        NCOCODE: "xxxx",
        OperatorPublicName: "xxxx",
        VOSA_PSVLicenseName: "xxxx",
        OpId: 1234,
        PubNmId: 1234,
        Mode: "xxxx",
        TTRteEnq: "xxxx",
        FareEnq: "xxxx",
        ComplEnq: "xxxx",
        Website: "xxxx",
    }];

    const result = formatDynamoWriteRequest(testLines);
    expect(result).toEqual(expected);
       
    }); 
//     it('should return empty an array when given zero items', () =>{




    
//     });
//     it('should return an array when given between less then 25 items', () =>{



    
//     });
//     it('should return an array when given more than 25 items', () =>{




    
//     });
});

// describe('S3 Host', () =>{
//     it('should set tableName when environment variable is set', () =>{




    
//     }); 
//     it('should error when environment variable is not set', () =>{




    
//     });
// });
