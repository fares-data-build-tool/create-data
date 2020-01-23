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

export function createArrayOfDBDataItems(numberOfItems: number):
dynamoDBData[] {
    
    let arrayOfDBDataItems: dynamoDBData[] = [];

    const sampleItem: dynamoDBData = {
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
    };

    for (let x=0; x < numberOfItems; x++) {
        arrayOfDBDataItems.push(sampleItem);
    }

    return arrayOfDBDataItems;
}

export function createBatchOfWriteRequests(numberOfItems: number):
AWS.DynamoDB.WriteRequest [] {
    
    let batchOfWriteRequests: AWS.DynamoDB.WriteRequest[] = [];

    const sampleItem: {} = {
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
    };

    for (let x=0; x < numberOfItems; x++) {
        batchOfWriteRequests.push(sampleItem);
    }

    return batchOfWriteRequests;
}
