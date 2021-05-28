import * as sessions from '../../../src/utils/sessions';
import { NUMBER_OF_PRODUCTS_ATTRIBUTE } from '../../../src/constants/attributes';
import howManyProducts, { getErrors } from '../../../src/pages/api/howManyProducts';
import { getMockRequestAndResponse } from '../../testData/mockData';
import { ErrorInfo, NumberOfProductsAttributeWithErrors, NumberOfProductsAttribute } from '../../../src/interfaces';

describe('howManyProducts', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('getErrors', () => {
        it('should return errors when the user enters no data', () => {
            const mockUserInputAsNumber = Number('');
            const mockError: ErrorInfo[] = [
                { id: 'number-of-products', errorMessage: 'Enter a whole number between 1 and 10' },
            ];
            const errors = getErrors(mockUserInputAsNumber);
            expect(errors).toEqual(mockError);
        });

        it('should return errors when the user enters incorrect data', () => {
            const mockUserInputAsNumber = Number('11');
            const mockError: ErrorInfo[] = [
                { id: 'number-of-products', errorMessage: 'Enter a whole number between 1 and 10' },
            ];
            const errors = getErrors(mockUserInputAsNumber);
            expect(errors).toEqual(mockError);
        });

        it('should return no errors when the user enters correct data', () => {
            const mockUserInputAsNumber = Number('10');
            const errors = getErrors(mockUserInputAsNumber);
            expect(errors).toEqual([]);
        });
    });

    it('should return 302 redirect to /howManyProducts (i.e. itself) when the session is valid, but there is no request body', () => {
        const mockBody = { numberOfProductsInput: '' };
        const mockWriteHeadFn = jest.fn();
        const { req, res } = getMockRequestAndResponse({ cookieValues: {}, body: mockBody, uuid: {}, mockWriteHeadFn });
        howManyProducts(req, res);
        expect(mockWriteHeadFn).toBeCalledWith(302, {
            Location: '/howManyProducts',
        });
    });

    it('should return 302 redirect to /productDetails when the user only defines one product', () => {
        const mockBody = { numberOfProductsInput: '1' };
        const mockWriteHeadFn = jest.fn();
        const { req, res } = getMockRequestAndResponse({ cookieValues: {}, body: mockBody, uuid: {}, mockWriteHeadFn });
        howManyProducts(req, res);
        expect(mockWriteHeadFn).toBeCalledWith(302, {
            Location: '/productDetails',
        });
    });

    it('should return 302 redirect to /multipleProducts when the user defines more than one product', () => {
        const mockBody = { numberOfProductsInput: '10' };
        const mockWriteHeadFn = jest.fn();
        const { req, res } = getMockRequestAndResponse({ cookieValues: {}, body: mockBody, uuid: {}, mockWriteHeadFn });
        howManyProducts(req, res);
        expect(mockWriteHeadFn).toBeCalledWith(302, {
            Location: '/multipleProducts',
        });
    });

    it('should set the NUMBER_OF_PRODUCTS_ATTRIBUTE when redirecting to /howManyProducts (i.e. itself) to allow errors to be displayed', () => {
        const mockBody = { numberOfProductsInput: '' };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: mockBody,
        });
        const attributeValue: NumberOfProductsAttributeWithErrors = {
            errors: [
                { id: 'number-of-products', errorMessage: 'Enter a whole number between 1 and 10', userInput: '' },
            ],
        };
        howManyProducts(req, res);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, NUMBER_OF_PRODUCTS_ATTRIBUTE, attributeValue);
        expect(res.writeHead).toHaveBeenCalledWith(302, { Location: '/howManyProducts' });
    });

    it('should set the NUMBER_OF_PRODUCTS_ATTRIBUTE when redirecting to /multipleProducts', () => {
        const mockBody = { numberOfProductsInput: '4' };
        const { req, res } = getMockRequestAndResponse({ cookieValues: {}, body: mockBody });
        const attributeValue: NumberOfProductsAttribute = mockBody;
        howManyProducts(req, res);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, NUMBER_OF_PRODUCTS_ATTRIBUTE, attributeValue);
    });
});
