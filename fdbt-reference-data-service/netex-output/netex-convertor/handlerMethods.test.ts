import AWS from "aws-sdk";
import {
    fetchDataFromS3AsJSON, setS3ObjectParams
} from "./handler";
import { s3ObjectParameters } from "./handler";
import * as mocks from "./test-data/test-data";

jest.mock("aws-sdk");

describe("fetchDataFromS3AsJSON", () => {
    const mockS3GetObject = jest.fn();
    const s3Params: s3ObjectParameters = {
        Bucket: "thisIsMyBucket",
        Key: "andThisIsTheNameOfTheThing"
    };

    beforeEach(() => {
        mockS3GetObject.mockReset();
        (AWS.S3 as any) = jest.fn().mockImplementation(() => {
            return {
                getObject: mockS3GetObject
            };
        });
        mockS3GetObject.mockImplementation(() => ({
            promise() {
                return Promise.resolve({ Body: { data: "This is the data abcdefghijklmnop" } });
            }
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns the JSON data", async () => {
        const fetchedData = await fetchDataFromS3AsJSON(s3Params);
        expect(JSON.stringify(fetchedData)).toContain("abcdefghijklmnop");
    });

    it("throws an error when there is no data", async () => {

        mockS3GetObject.mockImplementation(() => ({
            promise() {
                return Promise.resolve({ Body: { data: "" } });
            }
        }));

        expect( await fetchDataFromS3AsJSON(s3Params)).toThrowError;
    
    });

    it("calls get object from S3 using params provided", async () => {
        await fetchDataFromS3AsJSON(s3Params);
        expect(mockS3GetObject).toHaveBeenCalledWith(s3Params);
    });

    describe("setS3ObjectParams", () => {
        const bucketName = "fdbt-test-matchingdata-s3-bucket";
        const fileName = "fdbt-test-matchingdata.json";
        const s3Event = mocks.mockS3Event(bucketName, fileName);

        it("sets s3BucketName from S3Event", () => {
            const s3ObjectParameters = setS3ObjectParams(s3Event);
            expect(s3ObjectParameters.Bucket).toEqual(bucketName);
        });

        it("sets S3FileName from S3Event", () => {
            const s3ObjectParameters = setS3ObjectParams(s3Event);
            expect(s3ObjectParameters.Key).toEqual(fileName);
        });

        it("removes spaces and unicode non-ASCII characters in the S3FileName", () => {
            const fileName = "fdbt%2Ftest+%3A+matchingdata.json";
            const S3Event = mocks.mockS3Event(bucketName, fileName);
            const params = {
                Bucket: bucketName,
                Key: "fdbt/test : matchingdata.json"
            };
            const s3ObjectParameters = setS3ObjectParams(S3Event);
            expect(s3ObjectParameters).toEqual(params);
        })

    })
});