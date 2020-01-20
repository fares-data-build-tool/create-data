import { csvParser, pushToDynamo } from "./handler";
import fs from "fs";
import path from "path";

const main = async () => {
  const data = fs.readFileSync(path.join(__dirname, "./data.csv"));
  const stringifiedData = data.toString();

  console.log(stringifiedData);

  const parsedCsvData = csvParser(stringifiedData);

  await pushToDynamo({ parsedLines: parsedCsvData, tableName: "danny-Stops" });
};

main();
