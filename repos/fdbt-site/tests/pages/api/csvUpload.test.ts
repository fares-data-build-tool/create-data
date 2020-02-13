import mockReqRes, { mockRequest, mockResponse } from 'mock-req-res';
import AWS from 'aws-sdk';
import * as csvUpload from '../../../src/pages/api/csvUpload';

const testCsv: string =
    ',Acomb Green Lane,,,,,,,\n' +
    'Mattison Way,110,Mattison Way,,,,,,\n' +
    'Nursery Drive,110,110,Nursery Drive,,,,,\n' +
    'Holl Bank/Beech Ave,110,110,110,Holl Bank/Beech Ave,,,,\n' +
    'Cambridge Street (York),170,170,110,110,Cambridge Street (York),,,\n' +
    'Blossom Street,170,170,110,110,100,Blossom Street,,\n' +
    'Rail Station (York),170,170,170,170,100,100,Rail Station (York),\n' +
    'Piccadilly (York),170,170,170,170,100,100,100,Piccadilly (York)';

const nonNumericPricesTestCsv: string =
    ',Acomb Green Lane,,,,,,,\n' +
    'Mattison Way,110,Mattison Way,,,,,,\n' +
    'Nursery Drive,110,110,Nursery Drive,,,,,\n' +
    'Holl Bank/Beech Ave,110,110,110,Holl Bank/Beech Ave,,,,\n' +
    'Cambridge Street (York),170,d,110,110,Cambridge Street (York),,,\n' +
    'Blossom Street,170,170,d,110,100,Blossom Street,,\n' +
    'Rail Station (York),170,170,170,170,100,100,Rail Station (York),\n' +
    'Piccadilly (York),170,170,170,s,100,100,100,Piccadilly (York)';

const missingPricesTestCsv: string =
    ',Acomb Green Lane,,,,,,,\n' +
    'Mattison Way,110,Mattison Way,,,,,,\n' +
    'Nursery Drive,110,110,Nursery Drive,,,,,\n' +
    'Holl Bank/Beech Ave,110,110,110,Holl Bank/Beech Ave,,,,\n' +
    'Cambridge Street (York),170,,110,,Cambridge Street (York),,,\n' +
    'Blossom Street,170,170,110,110,100,Blossom Street,,\n' +
    'Rail Station (York),170,,170,170,100,100,Rail Station (York),\n' +
    'Piccadilly (York),170,170,170,170,100,,100,Piccadilly (York)';

const unprocessedObject = {
    Bucket: 'fdbt-raw-user-data',
    Key: '780e3459-6305-4ae5-9082-b925b92cb46c',
    Body:
        ',Acomb Green Lane,,,,,,,\n' +
        'Mattison Way,110,Mattison Way,,,,,,\n' +
        'Nursery Drive,110,110,Nursery Drive,,,,,\n' +
        'Holl Bank/Beech Ave,110,110,110,Holl Bank/Beech Ave,,,,\n' +
        'Cambridge Street (York),170,170,110,110,Cambridge Street (York),,,\n' +
        'Blossom Street,170,170,110,110,100,Blossom Street,,\n' +
        'Rail Station (York),170,170,170,170,100,100,Rail Station (York),\n' +
        'Piccadilly (York),170,170,170,170,100,100,100,Piccadilly (York)',
    ContentType: 'text/csv; charset=utf-8',
};

const processedObject = {
    Bucket: 'fdbt-user-data',
    Key: '780e3459-6305-4ae5-9082-b925b92cb46c',
    Body: {
        fareStages: [
            { stageName: 'Acomb Green Lane', prices: ['110', '110', '110', '170', '170', '170', '170'] },
            { stageName: 'Mattison Way', prices: ['110', '110', '170', '170', '170', '170'] },
            { stageName: 'Nursery Drive', prices: ['110', '110', '110', '170', '170'] },
            { stageName: 'Holl Bank/Beech Ave', prices: ['110', '110', '170', '170'] },
            { stageName: 'Cambridge Street (York)', prices: ['100', '100', '100'] },
            { stageName: 'Blossom Street', prices: ['100', '100'] },
            { stageName: 'Rail Station (York)', prices: ['100'] },
            { stageName: 'Piccadilly (York)', prices: [] },
        ],
    },
    ContentType: 'application/json; charset=utf-8',
};

describe('csvUpload', () => {
    let res: mockReqRes.ResponseOutput;
    let writeHeadMock: jest.Mock;
    let outputData = '';
    const mockS3PutObject = jest.fn();

    beforeEach(() => {
        process.env.USER_DATA_BUCKET_NAME = 'fdbt-user-data';
        process.env.RAW_USER_DATA_BUCKET_NAME = 'fdbt-raw-user-data';
        jest.resetAllMocks();
        outputData = '';
        writeHeadMock = jest.fn();
        res = mockResponse({
            writeHead: writeHeadMock,
        });
        const storeLog = (inputs: string): string => (outputData += inputs); // eslint-disable-line no-return-assign
        console.log = jest.fn(storeLog); // eslint-disable-line no-console

        (AWS.S3 as {}) = jest.fn().mockImplementation(() => {
            return {
                putObject: mockS3PutObject,
            };
        });

        mockS3PutObject.mockImplementation(() => ({
            promise(): Promise<{}> {
                return Promise.resolve({});
            },
        }));
    });

    it('should return 302 redirect to /csvUpload when no file is attached', async () => {
        const file = {
            'file-upload-1': {
                size: 2,
                path: 'string',
                name: 'string',
                type: 'string',
                toJSON(): any {
                    // eslint-disable-line @typescript-eslint/no-explicit-any
                    return '';
                },
            },
        };

        jest.spyOn(csvUpload, 'fileParse')
            .mockImplementation()
            .mockResolvedValue({
                Files: file,
                FileContent: '',
            });

        const req = mockRequest({});

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(writeHeadMock).toHaveBeenCalledTimes(1);
        expect(outputData).toBe('No file attached.');
    });

    it('should return 302 redirect to /_error when a the attached file is too large', async () => {
        const file = {
            'file-upload-1': {
                size: 999999999999999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    // eslint-disable-line @typescript-eslint/no-explicit-any
                    return '';
                },
            },
        };

        jest.spyOn(csvUpload, 'fileParse')
            .mockImplementation()
            .mockResolvedValue({
                Files: file,
                FileContent: testCsv,
            });

        const req = mockRequest({});

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/_error',
        });
        expect(writeHeadMock).toHaveBeenCalledTimes(1);
        expect(outputData).toBe('File is too large.');
    });

    it('should return 302 redirect to /_error when the attached file is not a csv', async () => {
        const file = {
            'file-upload-1': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/pdf',
                toJSON(): any {
                    // eslint-disable-line @typescript-eslint/no-explicit-any
                    return '';
                },
            },
        };

        jest.spyOn(csvUpload, 'fileParse')
            .mockImplementation()
            .mockResolvedValue({
                Files: file,
                FileContent: testCsv,
            });

        const req = mockRequest({});

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/_error',
        });
        expect(writeHeadMock).toHaveBeenCalledTimes(1);
        expect(outputData).toBe('File is not a csv.');
    });

    it('should get the uuid from the cookie', () => {
        const req = mockRequest({
            headers: {
                cookie:
                    'fdbt-operator-cookie=%7B%22operator%22%3A%22Connexions%20Buses%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%2C%22nocCode%22%3A%22HCTY%22%7D; fdbt-faretype-cookie=%7B%22faretype%22%3A%22single%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D; fdbt-service-cookie=%7B%22service%22%3A%2213%2322%2F07%2F2019%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D',
            },
        });

        const result = csvUpload.getUuidFromCookie(req);

        expect(result).toBe('780e3459-6305-4ae5-9082-b925b92cb46c');
    });

    it('should put the unparsed data in s3 and the parsed data in s3', async () => {
        const file = {
            'file-upload-1': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    // eslint-disable-line @typescript-eslint/no-explicit-any
                    return '';
                },
            },
        };

        jest.spyOn(csvUpload, 'fileParse')
            .mockImplementation()
            .mockResolvedValue({
                Files: file,
                FileContent: testCsv,
            });

        const req = mockRequest({
            headers: {
                cookie:
                    'fdbt-operator-cookie=%7B%22operator%22%3A%22Connexions%20Buses%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%2C%22nocCode%22%3A%22HCTY%22%7D; fdbt-faretype-cookie=%7B%22faretype%22%3A%22single%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D; fdbt-service-cookie=%7B%22service%22%3A%2213%2322%2F07%2F2019%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D',
            },
        });

        await csvUpload.default(req, res);

        expect(mockS3PutObject).toBeCalledWith(unprocessedObject);

        expect(mockS3PutObject).toBeCalledWith(processedObject);

        expect(mockS3PutObject).toBeCalledTimes(2);
    });

    it('should return 302 redirect to /matching when the happy path is used', async () => {
        const file = {
            'file-upload-1': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    // eslint-disable-line @typescript-eslint/no-explicit-any
                    return '';
                },
            },
        };

        jest.spyOn(csvUpload, 'fileParse')
            .mockImplementation()
            .mockResolvedValue({
                Files: file,
                FileContent: testCsv,
            });

        const req = mockRequest({
            headers: {
                cookie:
                    'fdbt-operator-cookie=%7B%22operator%22%3A%22Connexions%20Buses%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%2C%22nocCode%22%3A%22HCTY%22%7D; fdbt-faretype-cookie=%7B%22faretype%22%3A%22single%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D; fdbt-service-cookie=%7B%22service%22%3A%2213%2322%2F07%2F2019%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D',
            },
        });

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/matching',
        });

        expect(writeHeadMock).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the fares triangle data has non-numerical prices', async () => {
        const file = {
            'file-upload-1': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    // eslint-disable-line @typescript-eslint/no-explicit-any
                    return '';
                },
            },
        };

        jest.spyOn(csvUpload, 'fileParse')
            .mockImplementation()
            .mockResolvedValue({
                Files: file,
                FileContent: nonNumericPricesTestCsv,
            });

        const req = mockRequest({
            headers: {
                cookie:
                    'fdbt-operator-cookie=%7B%22operator%22%3A%22Connexions%20Buses%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%2C%22nocCode%22%3A%22HCTY%22%7D; fdbt-faretype-cookie=%7B%22faretype%22%3A%22single%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D; fdbt-service-cookie=%7B%22service%22%3A%2213%2322%2F07%2F2019%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D',
            },
        });

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/_error',
        });

        expect(writeHeadMock).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the fares triangle data has missing prices', async () => {
        const file = {
            'file-upload-1': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    // eslint-disable-line @typescript-eslint/no-explicit-any
                    return '';
                },
            },
        };

        jest.spyOn(csvUpload, 'fileParse')
            .mockImplementation()
            .mockResolvedValue({
                Files: file,
                FileContent: missingPricesTestCsv,
            });

        const req = mockRequest({
            headers: {
                cookie:
                    'fdbt-operator-cookie=%7B%22operator%22%3A%22Connexions%20Buses%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%2C%22nocCode%22%3A%22HCTY%22%7D; fdbt-faretype-cookie=%7B%22faretype%22%3A%22single%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D; fdbt-service-cookie=%7B%22service%22%3A%2213%2322%2F07%2F2019%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D',
            },
        });

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/_error',
        });

        expect(writeHeadMock).toHaveBeenCalledTimes(1);
    });
});
