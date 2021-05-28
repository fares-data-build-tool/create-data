import fs from "fs";
import XLSX from "xlsx";
import Papa from "papaparse";
import uniq from "lodash/uniq";
import AWS from "aws-sdk";
import { AthenaExpress } from "athena-express";
import path from "path";

export interface FareStage {
  stageName: string;
  prices: {
    price: string;
    fareZones: string[];
  }[];
}

export interface UserFareStages {
  fareStages: FareStage[];
}

interface FareTriangleData {
  fareStages: {
    stageName: string;
    prices: {
      [key: string]: {
        price: string;
        fareZones: string[];
      };
    };
  }[];
}

const fileDetailsMap: any = {
  AD: "adult",
  CH: "child",
  SGL: "single",
  RTN: "return",
};

const getS3Client = (): AWS.S3 => {
  let options: AWS.S3.ClientConfiguration = {
    region: "eu-west-2",
  };
  return new AWS.S3(options);
};

const s3 = getS3Client();
const athenaExpressConfig = { aws: AWS };
const athenaExpress = new AthenaExpress(athenaExpressConfig);

export const getFareChartFileContents = async (
  filePath: string
): Promise<string | undefined> => {
  if (filePath.includes(".csv")) {
    return fs.promises.readFile(filePath, "utf-8");
  } else if (filePath.includes(".xls")) {
    const workBook = XLSX.readFile(filePath);
    const sheetName = workBook.SheetNames[0];
    const contents = XLSX.utils.sheet_to_csv(workBook.Sheets[sheetName]);
    return contents;
  } else {
    console.error(`Invalid fare chart file type ${filePath}`);
    return;
  }
};

export const getMatchingJSONFileContents = async (
  filePath: string
): Promise<any> => {
  if (filePath.includes(".json")) {
    return JSON.parse(await fs.promises.readFile(filePath, "utf-8"));
  } else {
    console.error(`Invalid json file type ${filePath}`);
    return;
  }
};

export const isNotTicketerFormat = (fareStageLines: string[][]): boolean => {
  const items = fareStageLines[0];
  const trimmedItems = items.map((item) => item.trim());

  return !trimmedItems[0] || trimmedItems[0] === "";
};

export const containsDuplicateFareStages = (
  fareStageNames: string[]
): boolean => uniq(fareStageNames).length !== fareStageNames.length;

export const faresTriangleDataMapper = (
  dataToMap: string,
  fileName: string
): UserFareStages | null => {
  const fareTriangle: FareTriangleData = {
    fareStages: [],
  };

  const fareStageLines = Papa.parse(dataToMap, { skipEmptyLines: "greedy" })
    .data as string[][];

  const fareStageCount = fareStageLines.length;
  const isPence = false;

  if (fareStageCount < 2) {
    console.warn("", {
      context: "api.csvUpload",
      message: `At least 2 fare stages are needed, only ${fareStageCount} found for ${fileName}`,
    });
    return null;
  }

  const notTicketerFormat = isNotTicketerFormat(fareStageLines);
  let pricesSet = false;

  for (let rowNum = 0; rowNum < fareStageLines.length; rowNum += 1) {
    const items = fareStageLines[rowNum] || [];
    const trimmedItems = items.map((item) =>
      item.trim().replace(/^"(.*)"$/, "$1")
    );
    const stageName = notTicketerFormat
      ? trimmedItems[rowNum + 1]
      : trimmedItems[rowNum];

    if (!stageName) {
      console.warn("", {
        context: "api.csvUpload",
        message: `Empty fare stage name found in uploaded file ${fileName}`,
      });
      return null;
    }

    if (trimmedItems.every((item) => item === "" || item === null)) {
      break;
    }

    fareTriangle.fareStages[rowNum] = {
      stageName,
      prices: {},
    };

    for (let colNum = 0; colNum < rowNum; colNum += 1) {
      const price = notTicketerFormat
        ? trimmedItems[colNum + 1]
        : trimmedItems[colNum];

      // Check explicitly for number to account for invalid fare data
      if (price && stageName) {
        pricesSet = true;

        if (Number.isNaN(Number(price))) {
          console.warn("", {
            context: "api.csvUpload",
            message: `invalid price in CSV upload ${fileName}`,
          });
          return null;
        }

        if (isPence && Number(price) % 1 !== 0) {
          console.warn("", {
            context: "api.csvUpload",
            message: `decimal price in CSV upload ${fileName}`,
          });
          return null;
        }

        const formattedPrice = isPence
          ? (parseFloat(price) / 100).toFixed(2)
          : parseFloat(price).toFixed(2);

        if (
          fareTriangle.fareStages?.[colNum].prices?.[formattedPrice]?.fareZones
        ) {
          fareTriangle.fareStages[colNum].prices[formattedPrice].fareZones.push(
            stageName
          );
        } else {
          fareTriangle.fareStages[colNum].prices[formattedPrice] = {
            price: formattedPrice,
            fareZones: [stageName],
          };
        }
      }
    }
  }

  if (!pricesSet) {
    console.warn("", {
      context: "api.csvUpload",
      message: `No prices set in uploaded fares triangle ${fileName}`,
    });
    return null;
  }

  const mappedFareTriangle: UserFareStages = {
    fareStages: fareTriangle.fareStages.map((item) => ({
      ...item,
      prices: Object.values(item.prices),
    })),
  };

  const fareStageNames: string[] = mappedFareTriangle.fareStages.map(
    (fareStage) => fareStage.stageName
  );

  if (containsDuplicateFareStages(fareStageNames)) {
    console.warn("", {
      context: "api.csvUpload",
      message: `Duplicate fare stage names found for ${fileName}, fare stage names: ${fareStageNames}`,
    });
    return null;
  }

  return mappedFareTriangle;
};

export const putMatchingJSONInS3 = async (
  key: string,
  text: string
): Promise<void> => {
  const request: AWS.S3.Types.PutObjectRequest = {
    Bucket: "fdbt-matching-data-reprocessed-test",
    Key: key,
    Body: Buffer.from(text, "binary"),
    ContentType: "application/json",
  };

  await s3.putObject(request).promise();
};

export const remapFareZones = (
  fareZones: any,
  mappedFaresData: UserFareStages
): any => {
  return fareZones.map((fareZone: any) => {
    const fareZoneName = fareZone.name;
    let validName = fareZoneName;

    const newPrices = mappedFaresData.fareStages.find((stage) => {
      let fareStageNameToMatch = stage.stageName;

      if (stage.stageName.includes(",")) {
        fareStageNameToMatch = `"${stage.stageName.split(",")[0]}`;
      }

      const match = fareZoneName === fareStageNameToMatch;

      if (match) {
        validName = stage.stageName;
      }

      return match;
    });

    return {
      ...fareZone,
      name: validName,
      prices: newPrices?.prices ?? [],
    };
  });
};

export const reprocessFareChart = async (
  nocCode: string,
  filePath: string
): Promise<void> => {
  let fileName = path.parse(filePath).name;
  const fileDetails = fileName.split(" ");
  let lineName, passengerType, ticketType;
  try {
    lineName = fileDetails[0];
    passengerType = fileDetailsMap[fileDetails[1]];
    ticketType = fileDetailsMap[fileDetails[2]];
  } catch (err) {
    console.error(`Invalid fares chart filename: ${fileName}`);
    return;
  }

  let results: any = await athenaExpress.query(
    `SELECT "$path" FROM business_intelligence.reprocessing_matching_data WHERE lineName = '${lineName}' AND passengerType = '${passengerType}' AND type = '${ticketType}' AND nocCode = '${nocCode}'`
  );

  if (results.Items?.length == 0) {
    console.log(`No matching JSON found for ${fileName}`);
    return;
  }

  const fareChartFileContents = await getFareChartFileContents(filePath);

  if (!fareChartFileContents) {
    console.error(`Failed to retrieve fare chart data for ${fileName}`);
    return;
  }

  const mappedFaresData = faresTriangleDataMapper(
    fareChartFileContents,
    fileName
  );

  let i;
  for (i = 0; i < results.Items.length; i++) {
    const s3Key = results.Items[i]["$path"].split("replica/")[1];

    const s3Params = {
      Bucket: "fdbt-matching-data-prod-replica",
      Key: s3Key,
    };

    const response = await s3.getObject(s3Params).promise();
    const dataAsString = response.Body?.toString("utf-8") ?? "";
    const matchingJSON = JSON.parse(dataAsString);

    if (mappedFaresData) {
      let updatedMatchingJSON: any = {};
      if (ticketType === "single") {
        const existingFareZones = matchingJSON.fareZones;
        const remappedFareZones = remapFareZones(
          existingFareZones,
          mappedFaresData
        );

        updatedMatchingJSON = {
          ...matchingJSON,
          fareZones: remappedFareZones,
        };
      } else if (ticketType === "return") {
        const existingOutboundFareZones = matchingJSON.outboundFareZones;
        const remappedOutboundFarezone = remapFareZones(
          existingOutboundFareZones,
          mappedFaresData
        );

        const existingInboundFareZones = matchingJSON.inboundFareZones;
        const remappedInboundFarezone = remapFareZones(
          existingInboundFareZones,
          mappedFaresData
        );

        updatedMatchingJSON = {
          ...matchingJSON,
          outboundFareZones: remappedOutboundFarezone,
          inboundFareZones: remappedInboundFarezone,
        };
      }

      delete updatedMatchingJSON.email;

      if (i > 0) fileName = `${fileName} ${i+1}`

      await putMatchingJSONInS3(
        `${updatedMatchingJSON.nocCode}-reprocessed/${fileName}.json`,
        JSON.stringify(updatedMatchingJSON)
      );

      console.log(`Matching JSON for ${fileName} uploaded to S3`);
    }
  }
};

export const main = async () => {
  try {
    const nocCode = process.env.NOC_CODE;

    if (!nocCode) {
      console.log("No NOC_CODE variable provided");
      return;
    }

    const files = await fs.promises.readdir(`./fares/${nocCode}`);
    for await (const file of files)
      reprocessFareChart(nocCode, `./fares/${nocCode}/${file}`);
  } catch (err) {
    console.error(err);
  }
};

main();
