import { expectedPointToPointPeriodTicket, getMockRequestAndResponse } from '../../testData/mockData';
import editProductName from '../../../src/pages/api/editProductName';
import { MATCHING_JSON_ATTRIBUTE, MATCHING_JSON_META_DATA_ATTRIBUTE } from '../../../src/constants/attributes';

import * as userData from '../../../src/utils/apiUtils/userData';
describe('editProductName', () => {
    const writeHeadMock = jest.fn();
    const s3Spy = jest.spyOn(userData, 'putUserDataInProductsBucketWithFilePath');
    s3Spy.mockImplementation(() => Promise.resolve('pathToFile'));

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should update productName for periodTicket', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            query: {
                id: 2,
                productName: 'My product',
            },
            session: {
                [MATCHING_JSON_ATTRIBUTE]: expectedPointToPointPeriodTicket,
                [MATCHING_JSON_META_DATA_ATTRIBUTE]: {
                    productId: '2',
                    serviceId: '22D',
                    matchingJsonLink: 'test/path',
                },
            },
            mockWriteHeadFn: writeHeadMock,
        });

        await editProductName(req, res);

        expect(userData.putUserDataInProductsBucketWithFilePath).toBeCalledWith(
            {
                ...expectedPointToPointPeriodTicket,
                products: [{ ...expectedPointToPointPeriodTicket.products[0], productName: 'My product' }],
            },
            'test/path',
        );

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/products/productDetails?productId=2',
        });
    });
});
