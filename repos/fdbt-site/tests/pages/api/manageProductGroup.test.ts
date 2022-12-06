import * as aurora from '../../../src/data/auroradb';
import * as utils from '../../../src/utils/apiUtils/index';
import * as session from '../../../src/utils/sessions';
import { MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE } from '../../../src/constants/attributes';
import manageProductGroup from '../../../src/pages/api/manageProductGroup';
import { getMockRequestAndResponse } from '../../testData/mockData';

const getAndValidateNocSpy = jest.spyOn(utils, 'getAndValidateNoc');
const updateSessionAttributeSpy = jest.spyOn(session, 'updateSessionAttribute');
const getProductGroupByNameAndNocCodeSpy = jest.spyOn(aurora, 'getProductGroupByNameAndNocCode');

const updateProductGroupSpy = jest.spyOn(aurora, 'updateProductGroup');
const insertProductGroupSpy = jest.spyOn(aurora, 'insertProductGroup');

insertProductGroupSpy.mockResolvedValue();
updateProductGroupSpy.mockResolvedValue();
getProductGroupByNameAndNocCodeSpy.mockResolvedValueOnce(undefined);

describe('manageProductGroup', () => {
    const writeHeadMock = jest.fn();

    afterEach(jest.resetAllMocks);

    it('should call the getAndValidateNoc function', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        await manageProductGroup(req, res);

        expect(getAndValidateNocSpy).toBeCalledWith(req, res);
    });

    it('should error when name is an empty string', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                id: '1',
                productGroupName: '',
                productsToExport: ['1'],
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = {
            errors: [
                {
                    errorMessage: 'Name cannot be less than 2 characters',
                    id: 'product-group-name',
                },
            ],
            inputs: {
                id: 1,
                name: '',
                productIds: ['1'],
            },
        };

        await manageProductGroup(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE, attributeValue);

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/manageProductGroup?id=1' });
    });

    it('should error when name is a bunch of spaces and no real characters', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                id: '1',
                productGroupName: '             ',
                productsToExport: ['1'],
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = {
            errors: [
                {
                    errorMessage: 'Name cannot be less than 2 characters',
                    id: 'product-group-name',
                },
            ],
            inputs: {
                id: 1,
                name: '',
                productIds: ['1'],
            },
        };

        await manageProductGroup(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE, attributeValue);

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/manageProductGroup?id=1' });
    });

    it('should error when name is less than 2 characters', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                id: '1',
                productGroupName: 'Th',
                productsToExport: ['1'],
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = {
            errors: [
                {
                    errorMessage: 'Name cannot be less than 2 characters',
                    id: 'product-group-name',
                },
            ],
            inputs: {
                id: 1,
                name: 'Th',
                productIds: ['1'],
            },
        };

        await manageProductGroup(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE, attributeValue);

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/manageProductGroup?id=1' });
    });

    it('should error when no product is selected', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                id: '1',
                productGroupName: 'Dummy product group',
                productsToExport: [],
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = {
            errors: [
                {
                    errorMessage: 'Select product to be added in the group',
                    id: '',
                },
            ],
            inputs: {
                id: 1,
                name: 'Dummy product group',
                productIds: [],
            },
        };

        await manageProductGroup(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE, attributeValue);

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/manageProductGroup?id=1' });
    });

    it('should error when adding a product group with the same name as an existing one', async () => {
        getProductGroupByNameAndNocCodeSpy.mockResolvedValueOnce({
            id: 1,
            name: 'Dummy Product',
            productIds: ['1', '2'],
        });

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                id: '2',
                productGroupName: 'Dummy Product',
                productsToExport: ['1'],
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = {
            errors: [
                {
                    errorMessage: 'Dummy Product already exists as a product group',
                    id: 'product-group-name',
                },
            ],
            inputs: {
                id: 2,
                name: 'Dummy Product',
                productIds: ['1'],
            },
        };

        await manageProductGroup(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE, attributeValue);

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/manageProductGroup?id=2' });
    });

    it('should call updateSessionAttribute with undefined when no errors present', async () => {
        getProductGroupByNameAndNocCodeSpy.mockResolvedValueOnce(undefined);

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                id: '1',
                productGroupName: 'Dummy Product',
                productsToExport: ['1'],
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = undefined;

        await manageProductGroup(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE, attributeValue);

        expect(updateProductGroupSpy).toBeCalledWith(1, undefined, ['1'], 'Dummy Product');

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/viewProductGroups' });
    });

    it('should call updateSessionAttribute with undefined & upsertProductGroup when not in Edit mode', async () => {
        getProductGroupByNameAndNocCodeSpy.mockResolvedValueOnce(undefined);

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                productGroupName: 'Dummy Product Group',
                productsToExport: ['1'],
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = undefined;

        await manageProductGroup(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE, attributeValue);

        expect(insertProductGroupSpy).toBeCalledWith(undefined, ['1'], 'Dummy Product Group');

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/viewProductGroups' });
    });
});
