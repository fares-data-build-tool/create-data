import { getMockRequestAndResponse, expectedPeriodGeoZoneTicketWithMultipleProducts } from '../../testData/mockData';
import { MATCHING_JSON_ATTRIBUTE, MATCHING_JSON_META_DATA_ATTRIBUTE } from '../../../src/constants/attributes';
import editPeriodDuration from '../../../src/pages/api/editPeriodDuration';
import * as userData from '../../../src/utils/apiUtils/userData';

describe('editPeriodDuration tests', () => {
    let writeHeadMock: jest.Mock;

    beforeEach(() => {
        writeHeadMock = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    const s3Spy = jest.spyOn(userData, 'putUserDataInProductsBucketWithFilePath');
    s3Spy.mockImplementation(() => Promise.resolve('pathToFile'));
    it('should update a products period duration and redirect back to products/productDetails', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { multipleProductDurationInput: '6', multipleProductDurationUnitsInput: 'week' },
            uuid: {},
            session: {
                [MATCHING_JSON_ATTRIBUTE]: expectedPeriodGeoZoneTicketWithMultipleProducts,
                [MATCHING_JSON_META_DATA_ATTRIBUTE]: {
                    productId: '2',
                    matchingJsonLink: 'test/path',
                },
            },
            mockWriteHeadFn: writeHeadMock,
        });
        await editPeriodDuration(req, res);

        expect(userData.putUserDataInProductsBucketWithFilePath).toBeCalledWith(
            {
                ...expectedPeriodGeoZoneTicketWithMultipleProducts,
                products: [
                    { ...expectedPeriodGeoZoneTicketWithMultipleProducts.products[0], productDuration: '6 weeks' },
                ],
            },
            'test/path',
        );

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/products/productDetails?productId=2',
        });
    });
});
