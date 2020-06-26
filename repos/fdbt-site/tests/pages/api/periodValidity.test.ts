import * as s3 from '../../../src/data/s3';
import * as dynamodb from '../../../src/data/auroradb';
import {
    expectedSingleProductUploadJsonWithZoneUpload,
    getMockRequestAndResponse,
    naptanStopInfo,
    expectedSingleProductUploadJsonWithSelectedServices,
} from '../../testData/mockData';
import periodValidity from '../../../src/pages/api/periodValidity';

describe('periodValidity', () => {
    const putStringInS3Spy = jest.spyOn(s3, 'putStringInS3');
    const writeHeadMock = jest.fn();

    putStringInS3Spy.mockImplementation(() => Promise.resolve());

    afterEach(() => {
        jest.resetAllMocks();
    });

    const atcoCodes: string[] = ['13003305E', '13003622B', '13003655B'];
    let batchGetStopsByAtcoCodeSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.spyOn(s3, 'getCsvZoneUploadData').mockImplementation(() => Promise.resolve(atcoCodes));

        batchGetStopsByAtcoCodeSpy = jest
            .spyOn(dynamodb, 'batchGetStopsByAtcoCode')
            .mockImplementation(() => Promise.resolve(naptanStopInfo));
    });

    it('correctly generates JSON for period data and uploads to S3 when a user uploads a csv', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { selectedServices: null },
            body: { periodValid: '24hr' },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });
        await periodValidity(req, res);

        const actualProductData = JSON.parse((putStringInS3Spy as jest.Mock).mock.calls[0][2]);
        expect(putStringInS3Spy).toBeCalledWith(
            'fdbt-matching-data-dev',
            '1e0459b3-082e-4e70-89db-96e8ae173e10.json',
            expect.any(String),
            'application/json; charset=utf-8',
        );
        expect(actualProductData).toEqual(expectedSingleProductUploadJsonWithZoneUpload);
    });

    it('correctly generates JSON for period data and uploads to S3 when a user selects a list of services', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareZoneName: null },
            body: { periodValid: '24hr' },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });
        await periodValidity(req, res);

        const actualProductData = JSON.parse((putStringInS3Spy as jest.Mock).mock.calls[0][2]);
        expect(putStringInS3Spy).toBeCalledWith(
            'fdbt-matching-data-dev',
            '1e0459b3-082e-4e70-89db-96e8ae173e10.json',
            expect.any(String),
            'application/json; charset=utf-8',
        );
        expect(actualProductData).toEqual(expectedSingleProductUploadJsonWithSelectedServices);
    });

    it('redirects back to period validity page if there is no body', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {},
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        await periodValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/periodValidity',
        });
    });

    it('redirects to thankyou page if all valid', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareZoneName: null },
            body: { periodValid: '24hr' },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });
        await periodValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/thankyou',
        });
    });

    it('throws an error if no stops are returned from query', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: '',
            body: { periodValid: '24hr' },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });
        batchGetStopsByAtcoCodeSpy.mockImplementation(() => Promise.resolve([]));

        await periodValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
