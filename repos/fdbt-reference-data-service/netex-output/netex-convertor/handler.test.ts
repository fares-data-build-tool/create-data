import { s3NetexHandler } from "./handler";
import AWS from "aws-sdk";
import * as mocks from "./test-data/test-data";

jest.mock("aws-sdk");

describe("s3 handler with csv event", () => {
    const mockS3GetObject = jest.fn();

    beforeEach(() => {

        (AWS.S3 as any) = jest.fn().mockImplementation(() => {
            return {
                getObject: mockS3GetObject
            };
        });

        mockS3GetObject.mockImplementation(() => ({
            promise() {
                return Promise.resolve({ Body: { data: "This is the data abcdefghijklmnop" }});
            }
        }));

    });

    afterEach(() => {
        mockS3GetObject.mockReset();
    });

    it("sends the data to dynamo when a csv is created", async () => {
        const event = mocks.mockS3Event(
            "thisIsMyBucket",
            "andThisIsTheNameOfTheThing.csv"
        );

        const result = await s3NetexHandler(event);
        
        expect(JSON.stringify(result)).toContain("abcdefghijklmnop");
    });
});