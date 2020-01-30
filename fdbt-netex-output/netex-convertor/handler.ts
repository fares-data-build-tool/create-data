import { Handler, AttributeValue} from 'aws-lambda';
import AWS from "aws-sdk";

export async function retrieveItemDataFromDynamoDBTable 
(tableName: string, primaryKey: string, primaryKeyValue: string) {

const docClient = new AWS.DynamoDB.DocumentClient();

const tableNm: string = tableName;

const primKey: string = primaryKey;

const primKeyVal: string = primaryKeyValue;

const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName : tableNm,
    KeyConditionExpression: "#atNm = :pkVal",
    ExpressionAttributeNames: {
        "#atNm": primKey
    },
    ExpressionAttributeValues: {
        ":pkVal": primKeyVal
    }
  };
docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        return data;
    }
  });
}

export const s3hook: Handler = async () => {
    retrieveItemDataFromDynamoDBTable("Stops", "ATCOCode", "077072787B");
};
