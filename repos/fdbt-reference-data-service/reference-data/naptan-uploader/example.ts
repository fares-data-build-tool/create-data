import { WriteRequest } from "aws-sdk/clients/dynamodb";

const parsedDataMapper = (parsedDataItem: any): WriteRequest => ({
  PutRequest: { Item: parsedDataItem as any }
});

console.log(parsedDataMapper({ foo: "bu" }));
