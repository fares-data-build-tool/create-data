import { getMockRequestAndResponse, expectedCarnetReturnTicket } from '../../testData/mockData';
import { MATCHING_JSON_ATTRIBUTE, MATCHING_JSON_META_DATA_ATTRIBUTE } from '../../../src/constants/attributes';
import * as userData from '../../../src/utils/apiUtils/userData';
import editCarnetProperties from '../../../src/pages/api/editCarnetProperties';
import { CarnetExpiryUnit } from '../../../src/interfaces/matchingJsonTypes';

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
    it('should update a carnet products carnet expiry and quantity in bundle, then redirect back to products/productDetails', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                carnetQuantityInput: '4',
                carnetExpiryDurationInput: '3',
                carnetExpiryUnitInput: CarnetExpiryUnit.MONTH,
            },
            uuid: {},
            session: {
                [MATCHING_JSON_ATTRIBUTE]: expectedCarnetReturnTicket,
                [MATCHING_JSON_META_DATA_ATTRIBUTE]: {
                    productId: '2',
                    matchingJsonLink: 'test/path',
                },
            },
            mockWriteHeadFn: writeHeadMock,
        });
        await editCarnetProperties(req, res);

        expect(userData.putUserDataInProductsBucketWithFilePath).toBeCalledWith(
            {
                ...expectedCarnetReturnTicket,
                products: [
                    {
                        ...expectedCarnetReturnTicket.products[0],
                        carnetDetails: { expiryTime: '3', expiryUnit: CarnetExpiryUnit.MONTH, quantity: '4' },
                    },
                ],
            },
            'test/path',
        );

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/products/productDetails?productId=2',
        });
    });
});
