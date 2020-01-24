var dynamodbUpdateExpression = require ('dynamodb-update-expression');
import AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();

export default (tableName:string, partitionKey:string , sortKey:string, data:object ) => {
 
    function _get(partitionKey:string, sortKey:string) {
      const params = {
        TableName: tableName,
        Key: {
          partitionKey: partitionKey,
          sortKey:      sortKey
        }
      };
   
      return docClient.get(params).promise();
    }
   
    function _update(data: object, original: object) {
      // generates an object by comparing the exisiting data with the new data //
      var updateExpression = dynamodbUpdateExpression.getUpdateExpression({ data: original }, { data: data });
      var params = Object.assign({
        TableName: tableName,
        Key: {
          partitionKey: partitionKey,
          sortKey:      sortKey
        },
        // returns item as it appears after the updte //
        ReturnValues: 'ALL_NEW',
        // updates only if partition key and sort key exist //
        ConditionExpression: 'attribute_exists(partitionKey) AND attribute_exists(sortKey)'
      }, updateExpression);

      // ensures a value is assigned to UpdateExpression? //
      if (params.UpdateExpression === '') {
        return Promise.resolve();
      }
      // ???? //
      return new Promise(function (resolve, reject) {
        return docClient.update(params).promise()
          .then(function (result) { resolve(result.Attributes.data); })
          .catch(reject);
      });
    }
   
    function _put(data:object) {
      var params = {
        TableName: tableName,
        Item: {
          partitionKey: partitionKey,
          sortKey:      sortKey,
          data:         data
        },
        ConditionExpression: 'attribute_not_exists(partitionKey) AND attribute_not_exists(sortKey)'
      };
   
      return docClient.put(params).promise();
    }
   
    // 1. Get the original item
    return _get(partitionKey, sortKey).then(function (original) {
      if (Object.keys(original).length > 0) {
        // 2. Update if item already exists
        return _update(data, original);
      } else {
        // 3. Otherwise, put the item
        return _put(data).catch(function (err) {
          if (err.code === 'ConditionalCheckFailedException') {
            // 3a. Only 1 of the concurrent puts will succeed,
            // the rest should retry recursively
            return this.upsert(tableName, partitionKey, sortKey, data);
          } else {
            throw err;
          }
        });
      }
    });
  }