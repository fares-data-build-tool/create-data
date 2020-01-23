//  let nocTable = [
//     { NOCCODE: "AD1T", OperatorPublicname: "Metrobus", PubNmId: 3214556 },
//     { NOCCODE: "FC3R", OperatorPublicname: "First", PubNmId: 758463 }
// ];

// let nocLines = [
//     { Mode: "Bus", NOCCODE: "FC3R" },
//     { Mode: "Rail", NOCCODE: "AD1T" }
// ];

// let publicName = [
//     { Website: "cdcd.com", PubNmId: 3214556 },
//     { Website: "abab.com", PubNmId: 758463 }
// ];

// function mergeArrayObjects(arr1,arr2) {
//     let start = 0;
//     let merge = [];
  
//     while(start < arr1.length){
//       if(arr1[start].id === arr2[start].id){
//           merge.push({...arr1[start],...arr2[start]})
//       }
//       start = start+1
//     }
//     return merge;
//   }

//   const merger1 = mergeArrayObjects(nocTable, nocLines);
//   console.log(merger1);
  
//   const merger2 = mergeArrayObjects(merger1, publicName);
//   console.log(merger2);




// s3FileName1 = "NOC_Tables_2020-01-20-09-19-34/NOCLines.csv"

// s3FileName1SubStringArray = s3FileName1.split("/");

// s3FileName1SubStringArrayFirstElement = s3FileName1SubStringArray[0]

// console.log(s3FileName1SubStringArray);

// console.log(s3FileName1SubStringArrayFirstElement);

// data = {
//     Contents: [
//        {
//       ETag: "\"70ee1738b6b21e2c8a43f3a5ab0eee71\"", 
//       Key: "example1.jpg", 
//       LastModified: "11.01.10", 
//       Owner: {
//        DisplayName: "myname", 
//        ID: "12345example25102679df27bb0ae12b3f85be6f290b936c4393484be31bebcc"
//       }, 
//       Size: 11, 
//       StorageClass: "STANDARD"
//      }, 
//        {
//       ETag: "\"9c8af9a76df052144598c115ef33e511\"", 
//       Key: "example2.jpg", 
//       LastModified: "11.01.2010", 
//       Owner: {
//        DisplayName: "myname", 
//        ID: "12345example25102679df27bb0ae12b3f85be6f290b936c4393484be31bebcc"
//       }, 
//       Size: 713193, 
//       StorageClass: "STANDARD"
//      }
//     ], 
//     NextMarker: "eyJNYXJrZXIiOiBudWxsLCAiYm90b190cnVuY2F0ZV9hbW91bnQiOiAyfQ=="
//    };

// let objlist = [];
// const objContents = data.Contents;
// objContents.forEach(item => {
//     objlist.push(item.Key);
// });
// console.log(objlist);
// console.log(objContents.length);

// var dynamodb = require ('aws-sdk/clients/dynamodb');

// function formatDynamoWriteRequest(parsedLines) {
//     const parsedDataMapper = (parsedDataItem) => ({
//       DynamoDB.WriteRequest.PutRequest: { Item: parsedDataItem }
//     });
//     const dynamoWriteRequests = parsedLines.map(parsedDataMapper);
//     const emptyBatch = [];
//     const batchSize = 25;
//     const dynamoWriteRequestBatches = dynamoWriteRequests.reduce(function(
//       result,
//       _value,
//       index,
//       array
//     ) {
//       if (index % batchSize === 0)
//         result.push(array.slice(index, index + batchSize));
//       return result;
//     },
//     emptyBatch);
//     return dynamoWriteRequestBatches;
//   }
  
//   const test = {
//     id: 123,
//     NCOCODE: "sdfg",
//     OperatorPublicName: "fdsg",
//     VOSA_PSVLicenseName: "fdgt",
//     OpId: 1234,
//     PubNmId: 1234,
//     Mode: "string",
//     TTRteEnq: "string",
//     FareEnq: "sdgf",
//     ComplEnq: "string",
//     Website: "string",
//   }

//   const result = formatDynamoWriteRequest(test);
  
//   console.log(result);


  function createArrayOfDBDataItems(numberOfItems) {
      
      const arrayOfDBDataItems = [];
  
      const sampleItem = {
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
  
      for (x=0; x < numberOfItems; x++) {
          arrayOfDBDataItems.push(sampleItem);
      }
  
      return arrayOfDBDataItems;
  }

  result = createArrayOfDBDataItems(3);

  console.log(result);

function createArrayOfWriteRequestBatches(numberOfItems) {
    
    const batchOfWriteRequests = [];

    const arrayOfWriteRequestBatches = [];

    const sampleItem = {
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

    arrayOfWriteRequestBatches.push(batchOfWriteRequests);

    return arrayOfWriteRequestBatches;
}

result = createArrayOfWriteRequestBatches(1);

console.log(result);
