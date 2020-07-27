import * as s3 from '../../../src/data/s3';
// import * as dynamodb from '../../../src/data/auroradb';
import {
    // expectedSingleProductUploadJsonWithZoneUpload,
    getMockRequestAndResponse,
    // naptanStopInfo,
    // expectedSingleProductUploadJsonWithSelectedServices,
} from '../../testData/mockData';
import periodValidity from '../../../src/pages/api/periodValidity';

describe('periodValidity', () => {
    const mockDate = Date.now();

    const putStringInS3Spy = jest.spyOn(s3, 'putStringInS3');
    const writeHeadMock = jest.fn();

    putStringInS3Spy.mockImplementation(() => Promise.resolve());

    afterEach(() => {
        jest.resetAllMocks();
    });

    const atcoCodes: string[] = ['13003305E', '13003622B', '13003655B'];
    // let batchGetStopsByAtcoCodeSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.spyOn(global.Date, 'now').mockImplementation(() => mockDate);
        jest.spyOn(s3, 'getCsvZoneUploadData').mockImplementation(() => Promise.resolve(atcoCodes));

        // batchGetStopsByAtcoCodeSpy = jest
        //     .spyOn(dynamodb, 'batchGetStopsByAtcoCode')
        //     .mockImplementation(() => Promise.resolve(naptanStopInfo));
    });

    // it('correctly generates JSON for period data and uploads to S3 when a user uploads a csv', () => {
    //     const { req, res } = getMockRequestAndResponse({
    //         cookieValues: { selectedServices: null },
    //         body: { periodValid: '24hr' },
    //         uuid: '',
    //         mockWriteHeadFn: writeHeadMock,
    //     });
    //     periodValidity(req, res);

    //     const actualProductData = JSON.parse((putStringInS3Spy as jest.Mock).mock.calls[0][2]);
    //     expect(putStringInS3Spy).toBeCalledWith(
    //         'fdbt-matching-data-dev',
    //         `TEST/period/1e0459b3-082e-4e70-89db-96e8ae173e10_${mockDate}.json`,
    //         expect.any(String),
    //         'application/json; charset=utf-8',
    //     );
    //     expect(actualProductData).toEqual(expectedSingleProductUploadJsonWithZoneUpload);
    // });

    // it('correctly generates JSON for period data and uploads to S3 when a user selects a list of services', () => {
    //     const { req, res } = getMockRequestAndResponse({
    //         cookieValues: { fareZoneName: null },
    //         body: { periodValid: '24hr' },
    //         uuid: '',
    //         mockWriteHeadFn: writeHeadMock,
    //     });
    //     periodValidity(req, res);

    //     const actualProductData = JSON.parse((putStringInS3Spy as jest.Mock).mock.calls[0][2]);
    //     expect(putStringInS3Spy).toBeCalledWith(
    //         'fdbt-matching-data-dev',
    //         `TEST/period/1e0459b3-082e-4e70-89db-96e8ae173e10_${mockDate}.json`,
    //         expect.any(String),
    //         'application/json; charset=utf-8',
    //     );
    //     expect(actualProductData).toEqual(expectedSingleProductUploadJsonWithSelectedServices);
    // });

    it('redirects back to period validity page if there is no body', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {},
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        periodValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/periodValidity',
        });
    });

    it('redirects to /selectSalesOfferPackage page if all valid', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareZoneName: null },
            body: { periodValid: '24hr' },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });
        periodValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectSalesOfferPackage',
        });
    });

    // it('throws an error if no stops are returned from query', () => {
    //     const { req, res } = getMockRequestAndResponse({
    //         cookieValues: '',
    //         body: { periodValid: '24hr' },
    //         uuid: '',
    //         mockWriteHeadFn: writeHeadMock,
    //     });
    //     batchGetStopsByAtcoCodeSpy.mockImplementation(() => Promise.resolve([]));

    //     periodValidity(req, res);

    //     expect(writeHeadMock).toBeCalledWith(302, {
    //         Location: '/error',
    //     });
    // });
});
