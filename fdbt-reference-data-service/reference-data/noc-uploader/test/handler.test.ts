import { formatDynamoWriteRequest, setDBTableEnvVariable } from "../handler";
import { createArrayOfDBDataItems, createBatchOfWriteRequests } from "./mocks.test";

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

describe('formatDynamoWriteRequest', () =>{
    it('should return data in correct format as a DynamoDB WriteRequest', () =>{
    
    const batch: AWS.DynamoDB.WriteRequest [] = createBatchOfWriteRequests(1);
    
    const arrayOfBatches: AWS.DynamoDB.WriteRequest [][] = [];

    arrayOfBatches.push(batch);

    const testArrayOfItems: dynamoDBData[] = createArrayOfDBDataItems(1);

    const result = formatDynamoWriteRequest(testArrayOfItems);
    expect(result).toEqual(arrayOfBatches);
       
    }); 

    it('should return an array when given between less then 25 items', () =>{

    const batch: AWS.DynamoDB.WriteRequest [] = createBatchOfWriteRequests(23);
    
    const arrayOfBatches: AWS.DynamoDB.WriteRequest [][] = [];

    arrayOfBatches.push(batch);

    const testArrayOfItems: dynamoDBData[] = createArrayOfDBDataItems(23);

    const result = formatDynamoWriteRequest(testArrayOfItems);
    expect(result).toEqual(arrayOfBatches);
   
    });

    it('should return an array when given more than 25 items', () =>{

    const batch1: AWS.DynamoDB.WriteRequest [] = createBatchOfWriteRequests(25);
    const batch2: AWS.DynamoDB.WriteRequest [] = createBatchOfWriteRequests(7);

    const arrayOfBatches: AWS.DynamoDB.WriteRequest [][] = [];

    arrayOfBatches.push(batch1, batch2);

    const testArrayOfItems: dynamoDBData[] = createArrayOfDBDataItems(32);

    const result = formatDynamoWriteRequest(testArrayOfItems);
    expect(result).toEqual(arrayOfBatches);
       
    });

});

describe('setDBTableEnvVariable', () =>{
    it('should error when no environment variable is set', () => {

    const TABLE_NAME = "xxxx"

    expect.assertions(1);

    try {

        setDBTableEnvVariable(TABLE_NAME);

    } catch (error) {
    
        expect(setDBTableEnvVariable).toThrow("TABLE_NAME environment variable not set.");
    
    }
    }); 
});
