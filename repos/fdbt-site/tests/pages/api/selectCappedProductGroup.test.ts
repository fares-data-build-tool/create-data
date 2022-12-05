import * as aurora from '../../../src/data/auroradb';
import selectCappedProductGroup from '../../../src/pages/api/selectCappedProductGroup';
import * as session from '../../../src/utils/sessions';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as index from '../../../src/utils/apiUtils';
import { CAPPED_PRODUCT_GROUP_ID_ATTRIBUTE } from '../../../src/constants/attributes';

describe('selectCappedProductGroup', () => {
    const writeHeadMock = jest.fn();
    const auroraSpy = jest.spyOn(aurora, 'getProductGroupById');
    const updateSessionAttributeSpy = jest.spyOn(session, 'updateSessionAttribute');
    jest.spyOn(index, 'getAndValidateNoc').mockReturnValue('BLAC');

    beforeEach(jest.resetAllMocks);

    it('redirects back to /selectCappedProductGroup if there is not a product group selected', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: null,
            mockWriteHeadFn: writeHeadMock,
        });

        await selectCappedProductGroup(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/selectCappedProductGroup',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAPPED_PRODUCT_GROUP_ID_ATTRIBUTE, {
            errorMessage: 'Choose a group of products',
            id: 'product-group-0-radio',
        });
    });

    it('redirects back to /selectCappedProductGroup if the product group selected does not exist for that noc', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                productGroupId: '2',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        auroraSpy.mockResolvedValue(undefined);

        await selectCappedProductGroup(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/selectCappedProductGroup',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAPPED_PRODUCT_GROUP_ID_ATTRIBUTE, {
            errorMessage: 'Choose a group of products',
            id: 'product-group-0-radio',
        });
    });

    it('redirects to /createCaps if the product group selected exists for that noc', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                productGroupId: '2',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        auroraSpy.mockResolvedValue({
            id: 22,
            productIds: ['1', '2', '3'],
            name: 'Three products',
        });

        await selectCappedProductGroup(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/createCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAPPED_PRODUCT_GROUP_ID_ATTRIBUTE, '2');
    });
});
