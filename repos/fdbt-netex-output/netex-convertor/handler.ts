import { S3Event } from "aws-lambda";
import AWS from "aws-sdk";

export interface s3ObjectParameters {
  Bucket: string;
  Key: string;
}

export interface fetchedData {
  Data: {};
}

export function setS3ObjectParams(event: S3Event): s3ObjectParameters {
  const s3BucketName: string = event.Records[0].s3.bucket.name;
  const s3FileName: string = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  const params: s3ObjectParameters = {
    Bucket: s3BucketName,
    Key: s3FileName
  };
  return params;
}

export async function fetchDataFromS3AsJSON(parameters: s3ObjectParameters): Promise<JSON> {
  const s3: AWS.S3 = new AWS.S3();
  try {
    let dataAsString: string = (await s3.getObject(parameters).promise()).Body?.toString("utf-8")!;
    console.log({ dataAsString })
    const dataAsJson: JSON = JSON.parse(dataAsString);
    return dataAsJson;
  } catch (err) {
    throw new Error("Error in retrieving data.");
  }
}


export async function getItemFromDynamoDBTableWithPartitionKey
  (tableName: string, partitionKey: string, partitionKeyValue: string): Promise<AWS.DynamoDB.DocumentClient.QueryOutput> {

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: tableName,
    KeyConditionExpression: "#pkattNm = :pkAttVal",
    ExpressionAttributeNames: {
      "#pkattNm": partitionKey
    },
    ExpressionAttributeValues: {
      ":pkAttVal": partitionKeyValue
    }
  };
  console.log("params we have set for dynamodb query are as follows:", params);

  const data = await docClient.query(params, function (err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      console.log("Query succeeded.");
      console.log("data we have received back from dynamodb is as follows:", data);
      return data;
    }
  }).promise();
  return data;
}

export async function getItemFromDynamoDBTableWithPartitionKeyAndSortKey
  (tableName: string, partitionKey: string, partitionKeyValue: string, sortKey: string, sortKeyValue: string) {

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: tableName,
    KeyConditionExpression: "#pkAttNm = :pkAttVal and #skAttNm = :skAttVal",
    ExpressionAttributeNames: {
      "#pkAttNm": partitionKey,
      "#skAttNm": sortKey
    },
    ExpressionAttributeValues: {
      ":pkAttVal": partitionKeyValue,
      ":skAttVal": sortKeyValue
    }
  };
  console.log("params we have set for dynamodb query are as follows:", params);

  await docClient.query(params, function (err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      console.log("Query succeeded.");
      console.log("data we have received back from dynamodb is as follows:", data);
      return data;
    }
  }).promise();
}

export function getAttributeValueFromDynamoDBItemAsAString(data: AWS.DynamoDB.DocumentClient.QueryOutput, attribute: string):
  string {
  if (!data || !data.Items) {
    throw new Error("No data!")
  }
  const requiredAttAsAString: string = data["Items"][0][attribute];
  return requiredAttAsAString;
}

export function getAttributeValueFromDynamoDBItemAsAStringArray(data: AWS.DynamoDB.DocumentClient.QueryOutput, attribute: string):
  [string] {
  if (!data || !data.Items) {
    throw new Error("No data!")
  }
  const requiredAttAsAStringArray: [string] = data["Items"][0][attribute];
  return requiredAttAsAStringArray;
}

export function getAttributeValueFromDynamoDBItemAsAnObjectArray(data: AWS.DynamoDB.DocumentClient.QueryOutput, attribute: string):
  [object] {
  if (!data || !data.Items) {
    throw new Error("No data!")
  }
  const requiredAttAsAnObjectArray: [object] = data["Items"][0][attribute];
  return requiredAttAsAnObjectArray;
}


export const s3NetexHandler = async (event: S3Event) => {

  const stopsItemData = getItemFromDynamoDBTableWithPartitionKey("test-Stops", "ATCOCode", "0100BRP90168");
  console.log({ stopsItemData });
  const operatorsItemData = getItemFromDynamoDBTableWithPartitionKey("test-Operators", "NOCODE", "");
  console.log({ operatorsItemData });
  const servicesItemData = getItemFromDynamoDBTableWithPartitionKeyAndSortKey("test-Services", "NationalOperatorCode", "", "LineName", "");
  console.log({ servicesItemData });
  const tndsItemData = getItemFromDynamoDBTableWithPartitionKey("test-TNDS", "Filename", "");
  console.log({ tndsItemData });

  const ntpgLocalityCode = getAttributeValueFromDynamoDBItemAsAString(stopsItemData, "NtgpLocalityCode");
  console.log({ ntpgLocalityCode });
  const localityName = getAttributeValueFromDynamoDBItemAsAString(stopsItemData, "LocalityName");
  console.log({ localityName });

  const website = getAttributeValueFromDynamoDBItemAsAString(operatorsItemData, "Website");
  console.log({ website });
  const ttrteEnq = getAttributeValueFromDynamoDBItemAsAString(operatorsItemData, "TTRteEnq");
  console.log({ ttrteEnq });
  const OperatorPublicName = getAttributeValueFromDynamoDBItemAsAString(operatorsItemData, "OperatorPublicName");
  console.log({ OperatorPublicName });
  const opId = getAttributeValueFromDynamoDBItemAsAString(operatorsItemData, "OpId");
  console.log({ opId });
  const vosaPSVLicenseName = getAttributeValueFromDynamoDBItemAsAString(operatorsItemData, "VOSA_PSVLicenseName");
  console.log({ vosaPSVLicenseName });
  const fareEnq = getAttributeValueFromDynamoDBItemAsAString(operatorsItemData, "FareEnq");
  console.log({ fareEnq });
  const complEnq = getAttributeValueFromDynamoDBItemAsAString(operatorsItemData, "ComplEnq");
  console.log({ complEnq });
  const mode = getAttributeValueFromDynamoDBItemAsAString(operatorsItemData, "Mode");
  console.log({ mode });
  const description = getAttributeValueFromDynamoDBItemAsAString(servicesItemData, "Description");
  console.log({ description });

  const commonName = getAttributeValueFromDynamoDBItemAsAString(tndsItemData, "CommonName");
  console.log({ commonName });
  const operatorShortnameArray = getAttributeValueFromDynamoDBItemAsAStringArray(tndsItemData, "OperatorShortName");
  console.log({ operatorShortnameArray });
  const operatorShortname = operatorShortnameArray[0];
  console.log({ operatorShortname });
  const stopPointsArray = getAttributeValueFromDynamoDBItemAsAnObjectArray(tndsItemData, "StopPoints");
  console.log({ stopPointsArray });

  const params = setS3ObjectParams(event);
  console.log("S3ObjectParameters obtained from S3 Event are: ", params)
  const s3Key: string = params.Key;
  const uuid = s3Key.split("_")[0];
  const jsonData = await fetchDataFromS3AsJSON(params);
  console.log("JSON data received from S3 Object received as: ", jsonData)
  return jsonData;
};
