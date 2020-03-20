import * as s3 from '../../../src/data/s3';
import * as dynamodb from '../../../src/data/dynamodb';
import { expectedPeriodValidity, getMockRequestAndResponse, naptanStopInfo } from '../../testData/mockData';
import periodValidity from '../../../src/pages/api/periodValidity';

describe('Period Validity API', () => {
    const putStringInS3Spy = jest.spyOn(s3, 'putStringInS3');
    const writeHeadMock = jest.fn();

    putStringInS3Spy.mockImplementation(() => Promise.resolve());

    afterEach(() => {
        jest.resetAllMocks();
    });

    const atcoCodes: string[] = ['13003305E', '13003622B', '13003655B'];

    beforeEach(() => {
        jest.spyOn(s3, 'getPeriodData').mockImplementation(() => Promise.resolve(atcoCodes));

        jest.spyOn(dynamodb, 'batchGetStopsByAtcoCode').mockImplementation(() => Promise.resolve(naptanStopInfo));
    });

    it('correctly generates JSON for period data and uploads to S3', async () => {
        const { req, res } = getMockRequestAndResponse(
            '',
            { periodValid: 'twentyFoursHoursAfterPurchase' },
            '',
            writeHeadMock,
        );
        await periodValidity(req, res);

        expect(putStringInS3Spy).toBeCalledTimes(1);
        expect(putStringInS3Spy).toBeCalledWith(
            'fdbt-matching-data-dev',
            '1e0459b3-082e-4e70-89db-96e8ae173e10.json',
            JSON.stringify(expectedPeriodValidity),
            'application/json; charset=utf-8',
        );
    });

    it('redirects back to period validity page if there are errors', async () => {
        const { req, res } = getMockRequestAndResponse({}, {}, {}, writeHeadMock);

        await periodValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/periodValidity',
        });
    });

    it('redirects to thankyou page if all valid', async () => {
        const { req, res } = getMockRequestAndResponse(
            '',
            { periodValid: 'twentyFoursHoursAfterPurchase' },
            '',
            writeHeadMock,
        );
        await periodValidity(req, res);

        expect(writeHeadMock).toBeCalled();
    });

    it('should redirect to the error page if the cookie UUIDs to do not match', async () => {
        const { req, res } = getMockRequestAndResponse({}, null, { periodProductUuid: 'someUuid' }, writeHeadMock);

        await periodValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
