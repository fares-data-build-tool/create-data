import * as s3 from '../../../src/data/s3';
import * as dynamodb from '../../../src/data/auroradb';
import { getMockRequestAndResponse, naptanStopInfo, expectedCsvUploadMultiProduct } from '../../testData/mockData';
import multipleProductValidity, { addErrorsIfInvalid } from '../../../src/pages/api/multipleProductValidity';
import { Product } from '../../../src/pages/multipleProductValidity';

describe('multipleProductValidity API', () => {
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

    it('generates JSON for period data and uploads to S3 when the user uploads a zone via csv', async () => {
        const { req, res } = getMockRequestAndResponse(
            { fareType: 'period', numberOfProducts: '3' },
            { 'validity-row0': '24hr', 'validity-row1': '24hr', 'validity-row2': 'endOfCalendarDay' },
            '',
            writeHeadMock,
        );
        await multipleProductValidity(req, res);
        const actualMultipleProductData = JSON.parse((putStringInS3Spy as jest.Mock).mock.calls[0][2]);
        expect(putStringInS3Spy).toBeCalledWith(
            'fdbt-matching-data-dev',
            '1e0459b3-082e-4e70-89db-96e8ae173e10.json',
            expect.any(String),
            'application/json; charset=utf-8',
        );
        expect(actualMultipleProductData).toEqual(expectedCsvUploadMultiProduct);
    });

    it('redirects back to the multipleProductValidity page if there is no body', async () => {
        const { req, res } = getMockRequestAndResponse({}, {}, {}, writeHeadMock);

        await multipleProductValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/multipleProductValidity',
        });
    });

    it('redirects to thankyou page if all valid', async () => {
        const { req, res } = getMockRequestAndResponse(
            '',
            { 'validity-row0': '24hr', 'validity-row1': '24hr', 'validity-row2': 'endOfCalendarDay' },
            '',
            writeHeadMock,
        );
        await multipleProductValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/thankyou',
        });
    });

    it('should redirect to the error page if a required cookie is missing', async () => {
        const { req, res } = getMockRequestAndResponse(
            { operator: null },
            { 'validity-row0': 'endOfCalendarDay' },
            {},
            writeHeadMock,
        );

        await multipleProductValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('throws an error if no stops are returned from query', async () => {
        const { req, res } = getMockRequestAndResponse(
            { fareType: 'period', numberOfProducts: '3' },
            { 'validity-row0': '24hr', 'validity-row1': '24hr', 'validity-row2': 'endOfCalendarDay' },
            '',
            writeHeadMock,
        );
        batchGetStopsByAtcoCodeSpy.mockImplementation(() => Promise.resolve([]));

        await multipleProductValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    describe('addErrorsIfInvalid', () => {
        it('adds errors to incorrect data if there are invalid inputs', () => {
            const { req } = getMockRequestAndResponse('', {
                'validity-row0': '',
                'validity-row1': '',
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
            const { req } = getMockRequestAndResponse('', {
                'validity-row0': 'endOfCalendarDay',
                'validity-row1': '24hr',
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
});
