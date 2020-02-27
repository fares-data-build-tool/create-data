// import mockReqRes, { mockRequest, mockResponse } from 'mock-req-res';
import { mockRequest } from 'mock-req-res';
import * as priceEntry from '../../../src/pages/api/priceEntry';
// import { userFareStages } from '../../testData/mockData';
// import * as s3 from '../../../src/data/s3';

// jest.spyOn(s3, 'putDataInS3');

describe('priceEntry', () => {
    // let res: mockReqRes.ResponseOutput;
    // let writeHeadMock: jest.Mock;

    beforeEach(() => {
        process.env.USER_DATA_BUCKET_NAME = 'fdbt-user-data';
        jest.resetAllMocks();
        // writeHeadMock = jest.fn();
        // res = mockResponse({
        // writeHead: writeHeadMock,
        // });
    });

    // it('should return 302 redirect to /error if number of price inputs does not match implied number of price inputs in cookie', () => {
    // });

    // it('should return 302 redirect to /matching when the happy path is used', async () => {

    //     const req = mockRequest({
    //         headers: {
    //             cookie:
    //                 'fdbt-operator-cookie=%7B%22operator%22%3A%22Connexions%20Buses%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%2C%22nocCode%22%3A%22HCTY%22%7D; fdbt-faretype-cookie=%7B%22faretype%22%3A%22single%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D; fdbt-service-cookie=%7B%22service%22%3A%2213%2322%2F07%2F2019%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D; fdbt-stage-names-cookie=%7B%22service%22%3A%2213%2322%2F07%2F2019%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D',
    //         },
    //     });

    //     await priceEntry.default(req, res);

    //     expect(writeHeadMock).toBeCalledWith(302, {
    //         Location: '/matching',
    //     });

    //     expect(writeHeadMock).toHaveBeenCalledTimes(1);

    // });

    // it('should throw an error if the fares triangle has non-numerical prices', () => {

    // });

    it('should get the uuid from the cookie', () => {
        const req = mockRequest({
            headers: {
                cookie:
                    'fdbt-operator-cookie=%7B%22operator%22%3A%22Connexions%20Buses%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%2C%22nocCode%22%3A%22HCTY%22%7D; fdbt-faretype-cookie=%7B%22faretype%22%3A%22single%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D; fdbt-service-cookie=%7B%22service%22%3A%2213%2322%2F07%2F2019%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D; fdbt-stage-names-cookie=%7B%22service%22%3A%2213%2322%2F07%2F2019%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D',
            },
        });

        const result = priceEntry.getUuidFromCookie(req);

        expect(result).toBe('780e3459-6305-4ae5-9082-b925b92cb46c');
    });

    // it('should put the parsed data in s3', async () => {

    //     const req = mockRequest({
    //         headers: {
    //             cookie:
    //                 'fdbt-operator-cookie=%7B%22operator%22%3A%22Connexions%20Buses%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%2C%22nocCode%22%3A%22HCTY%22%7D; fdbt-faretype-cookie=%7B%22faretype%22%3A%22single%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D; fdbt-service-cookie=%7B%22service%22%3A%2213%2322%2F07%2F2019%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D; fdbt-stage-names-cookie=%7B%22service%22%3A%2213%2322%2F07%2F2019%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D',
    //         },
    //     });

    //     await priceEntry.default(req, res);

    //     expect(s3.putStringInS3).toBeCalledWith(
    //         'fdbt-user-data',
    //         expect.any(String),
    //         JSON.stringify(userFareStages),
    //         'application/json; charset=utf-8',
    //     );
    // });
});
