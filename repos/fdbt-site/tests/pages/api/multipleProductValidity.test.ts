import * as s3 from '../../../src/data/s3';
import * as dynamodb from '../../../src/data/auroradb';
import {
    getMockRequestAndResponse,
    naptanStopInfo,
    expectedMultiProductUploadJsonWithZoneUpload,
    expectedMultiProductUploadJsonWithSelectedServices,
} from '../../testData/mockData';
import multipleProductValidity, { addErrorsIfInvalid } from '../../../src/pages/api/multipleProductValidity';
import { Product } from '../../../src/pages/multipleProductValidity';

describe('multipleProductValidity', () => {
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

    describe('addErrorsIfInvalid', () => {
        it('adds errors to incorrect data if there are invalid inputs', () => {
            const { req } = getMockRequestAndResponse({
                cookieValues: '',
                body: {
                    'validity-row0': '',
                    'validity-row1': '',
                },
            });

            const userInputIndex = 0;
            const product: Product = {
                productName: 'super ticket',
                productNameId: '',
                productPrice: '3.50',
                productPriceId: '',
                productDuration: '3',
                productDurationId: '',
            };
            const result = addErrorsIfInvalid(req, product, userInputIndex);

            expect(result.productValidity).toBe('');
            expect(result.productValidityError).toBe('Select one of the two validity options');
        });

        it('does not add errors to correct data', () => {
            const { req } = getMockRequestAndResponse({
                cookieValues: '',
                body: {
                    'validity-row0': 'endOfCalendarDay',
                    'validity-row1': '24hr',
                },
            });

            const userInputIndex = 0;
            const product: Product = {
                productName: 'best ticket',
                productNameId: '',
                productPrice: '30.90',
                productPriceId: '',
                productDuration: '30',
                productDurationId: '',
            };
            const result = addErrorsIfInvalid(req, product, userInputIndex);

            expect(result.productValidity).toBe('endOfCalendarDay');
            expect(result.productValidityError).toBe(undefined);
        });
    });

    it('generates and dumps multiple period product JSON in S3 when the user uploads a fare zone via csv', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'period', numberOfProducts: '3', selectedServices: null },
            body: { 'validity-row0': '24hr', 'validity-row1': '24hr', 'validity-row2': 'endOfCalendarDay' },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });
        await multipleProductValidity(req, res);
        const actualMultipleProductData = JSON.parse((putStringInS3Spy as jest.Mock).mock.calls[0][2]);
        expect(putStringInS3Spy).toBeCalledWith(
            'fdbt-matching-data-dev',
            '1e0459b3-082e-4e70-89db-96e8ae173e10.json',
            expect.any(String),
            'application/json; charset=utf-8',
        );
        expect(actualMultipleProductData).toEqual(expectedMultiProductUploadJsonWithZoneUpload);
    });

    it('generates and dumps multiple period product JSON in S3 when the user selects a list of services', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'period', numberOfProducts: '3', fareZoneName: null },
            body: { 'validity-row0': '24hr', 'validity-row1': '24hr', 'validity-row2': 'endOfCalendarDay' },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });
        await multipleProductValidity(req, res);
        const actualMultipleProductData = JSON.parse((putStringInS3Spy as jest.Mock).mock.calls[0][2]);
        expect(putStringInS3Spy).toBeCalledWith(
            'fdbt-matching-data-dev',
            '1e0459b3-082e-4e70-89db-96e8ae173e10.json',
            expect.any(String),
            'application/json; charset=utf-8',
        );
        expect(actualMultipleProductData).toEqual(expectedMultiProductUploadJsonWithSelectedServices);
    });

    it('redirects back to the multipleProductValidity page if there is no body', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {},
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        await multipleProductValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/multipleProductValidity',
        });
    });

    it('redirects to thankyou page if all valid', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareZoneName: null },
            body: { 'validity-row0': '24hr', 'validity-row1': '24hr', 'validity-row2': 'endOfCalendarDay' },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });
        await multipleProductValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/thankyou',
        });
    });

    it('should redirect to the error page if a required cookie is missing', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { operator: null },
            body: { 'validity-row0': 'endOfCalendarDay' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        await multipleProductValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('throws an error if no stops are returned from query', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'period', numberOfProducts: '3' },
            body: { 'validity-row0': '24hr', 'validity-row1': '24hr', 'validity-row2': 'endOfCalendarDay' },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });
        batchGetStopsByAtcoCodeSpy.mockImplementation(() => Promise.resolve([]));

        await multipleProductValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
