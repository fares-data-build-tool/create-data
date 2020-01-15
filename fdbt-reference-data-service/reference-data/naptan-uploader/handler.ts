import { Handler, Context, Callback } from "aws-lambda";
import AWS from "aws-sdk";
import parseCsv from "csv-parse";

interface s3ObjectParameters {
  Bucket: string;
  Key: string;
}

interface dynamoDBParamsToPush {
  TableName: string;
  Item: dynamoDBData;
}

interface dynamoDBData {
  ATCOCode: number;
  NaptanCode: string;
  CommonName: string;
  Street: string;
  Indicator: string;
  IndicatorLang: string;
  Bearing: string;
  NptgLocalityCode: string;
  LocalityName: string;
  ParentLocalityName: string;
  LocalityCentre: number;
  GridType: string;
  Easting: number;
  Northing: number;
  Longitude: number;
  Latitude: number;
  StopType: string;
  BusStopType: string;
  TimingStatus: string;
}

async function fetchDataFromS3AsString(parameters: s3ObjectParameters) {
  const s3 = new AWS.S3();
  const parser = parseCsv({ delimiter: ",", columns: true })
  s3.getObject(parameters).createReadStream().pipe(parser)

  const dynamoDoc = new AWS.DynamoDB.DocumentClient();
  const tableName = "Stops";
  let items = [];
  let count = 0;

  let record: dynamoDBData;

  function clean(obj) {
    for (var propName in obj) {
      if (!obj[propName]) {
        delete obj[propName];
      }
    }
  }  

  const transformToWrite = (input: dynamoDBData) => {
    clean(input);
    (input as any).pk = input.ATCOCode;
    delete input.ATCOCode;
    return { PutRequest: { Item: input } };
  };


  parser.on("readable", async function() {
    while ((record = parser.read())) {
      count++;
      if (items.length < 25) {
        items.push(transformToWrite(record));
      } else {
        console.log(`Writing batch to DynamoDB...`);

        async () => {
          await dynamoDoc
            .batchWrite({ RequestItems: { [tableName]: [...items] as any } })
            .promise()
            .catch(() => console.error("Failed to write to DynamoDB"));
        };

        // Reset to start a new batch
        items = [];
      }
    }
  });

  parser.on("error", function(err) {
    console.error(err.message);
  });

  parser.on("end", async () => {
    console.log(
      `End of stream reached, flushing remaining ${items.length} items to table...`
    );
    if (items.length) {
      await dynamoDoc
        .batchWrite({ RequestItems: { [tableName]: items as any } })
        .promise();
      console.log(`Wrote a total of ${count} items to the table`);
    }
  });
}

// async function pushDataToDynamoDB(data: any) {
//     const dynamodb = new AWS.DynamoDB();
// }

export const s3hook: Handler = (
  event: any,
  context: Context,
  callback: Callback
) => {
  const s3BucketName: string = event.Records[0].s3.bucket.name;
  const s3FileName: string = event.Records[0].s3.object.key; // Object key may have spaces or unicode non-ASCII characters
  const params: s3ObjectParameters = { Bucket: s3BucketName, Key: s3FileName };
  console.log("s3BucketName is: ", s3BucketName);
  console.log("s3FileName is: ", s3FileName);
  const s3DataAsString = fetchDataFromS3AsString(params);
  console.log("s3DataAsString is: ", s3DataAsString);
  // const dynamodbResponse = pushDataToDynamoDB(data);
};

// function addDataToDynamo(parameters: dynamoDBParamsToPush) {
//     console.log("Adding a new item.")
//     const docClient = new DocumentClient()
//     docClient.put(parameters, function(err, data) {
//         if (err) {
//             console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
//         } else {
//             console.log("Added item:", JSON.stringify(parameters.Item, null, 2))
//         }
//     });
// }

// const s3 = new AWS.S3();
// console.log("s3 set as: ", s3)
// const s3Stream = s3.getObject(params).createReadStream()
// console.log("s3stream set as: ", s3Stream)
// csv().fromStream(s3Stream).on('data', (row) => {
//     let jsonContent = JSON.parse(row);
//     console.log(JSON.stringify(jsonContent));

//     let data: dynamoDBData = {
//         "ATCOCode": jsonContent.ATCOCode,
//         "NaptanCode": jsonContent.NaptanCode,
//         "CommonName": jsonContent.CommonName,
//         "Street": jsonContent.Street,
//         "Indicator": jsonContent.Indicator,
//         "IndicatorLang": jsonContent.IndicatorLang,
//         "Bearing": jsonContent.Bearing,
//         "NptgLocalityCode": jsonContent.NptgLocalityCode,
//         "LocalityName": jsonContent.LocalityName,
//         "ParentLocalityName": jsonContent.ParentLocalityName,
//         "LocalityCentre": jsonContent.LocalityCentre,
//         "GridType": jsonContent.GridType,
//         "Easting": jsonContent.Easting,
//         "Northing": jsonContent.Northing,
//         "Longitude": jsonContent.Longitude,
//         "Latitude": jsonContent.Latitude,
//         "StopType": jsonContent.StopType,
//         "BusStopType": jsonContent.BusStopType,
//         "TimingStatus": jsonContent.TimingStatus
//     };
//     let paramsToPush = {
//         TableName: tableName,
//         Item: data
//     };
//     addDataToDynamo(paramsToPush);
// })

// const tableName = "Stops";