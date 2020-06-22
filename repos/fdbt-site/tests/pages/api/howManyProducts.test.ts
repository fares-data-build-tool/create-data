import * as apiUtils from '../../../src/pages/api/apiUtils';
import { NUMBER_OF_PRODUCTS_COOKIE } from '../../../src/constants';
import howManyProducts, { isNumberOfProductsInvalid } from '../../../src/pages/api/howManyProducts';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('howManyProducts', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('isNumberOfProductsInvalid', () => {
        it('should return an invalid input check when the user enters no data', () => {
            const mockBody = { numberOfProductsInput: '' };
            const { req } = getMockRequestAndResponse({}, mockBody);
            const mockInputCheck = { error: 'Enter a number', numberOfProductsInput: '' };
            const inputCheck = isNumberOfProductsInvalid(req);
            expect(inputCheck).toEqual(mockInputCheck);
        });

        it('should return an invalid input check when the user enters incorrect data', () => {
            const mockBody = { numberOfProductsInput: '25' };
            const { req } = getMockRequestAndResponse({}, mockBody);
            const mockInputCheck = { error: 'Enter a whole number between 1 and 10', numberOfProductsInput: '25' };
            const inputCheck = isNumberOfProductsInvalid(req);
            expect(inputCheck).toEqual(mockInputCheck);
        });

        it('should return a valid input check when the user enters correct data', () => {
            const mockBody = { numberOfProductsInput: '6' };
            const { req } = getMockRequestAndResponse({}, mockBody);
            const mockInputCheck = { error: '', numberOfProductsInput: '6' };
            const inputCheck = isNumberOfProductsInvalid(req);
            expect(inputCheck).toEqual(mockInputCheck);
        });
    });

    it('should return 302 redirect to /howManyProducts (i.e. itself) when the session is valid, but there is no request body', () => {
        const mockBody = { numberOfProductsInput: '' };
        const mockWriteHeadFn = jest.fn();
        const { req, res } = getMockRequestAndResponse({}, mockBody, {}, mockWriteHeadFn);
        howManyProducts(req, res);
        expect(mockWriteHeadFn).toBeCalledWith(302, {
            Location: '/howManyProducts',
        });
    });

    it('should return 302 redirect to /productDetails when the user only defines one product', () => {
        const mockBody = { numberOfProductsInput: '1' };
        const mockWriteHeadFn = jest.fn();
        const { req, res } = getMockRequestAndResponse({}, mockBody, {}, mockWriteHeadFn);
        howManyProducts(req, res);
        expect(mockWriteHeadFn).toBeCalledWith(302, {
            Location: '/productDetails',
        });
    });

    it('should return 302 redirect to /multipleProducts when the user defines more than one product', () => {
        const mockBody = { numberOfProductsInput: '5' };
        const mockWriteHeadFn = jest.fn();
        const { req, res } = getMockRequestAndResponse({}, mockBody, {}, mockWriteHeadFn);
        howManyProducts(req, res);
        expect(mockWriteHeadFn).toBeCalledWith(302, {
            Location: '/multipleProducts',
        });
    });

    it('should return 302 redirect to /error when session is not valid', () => {
        const mockWriteHeadFn = jest.fn();
        const { req, res } = getMockRequestAndResponse({ operator: null }, {}, {}, mockWriteHeadFn);
        howManyProducts(req, res);
        expect(mockWriteHeadFn).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should set the NUMBER_OF_PRODUCTS_COOKIE when redirecting to /howManyProducts (i.e. itself) to allow errors to be displayed', () => {
        const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');
        const mockBody = { numberOfProductsInput: '' };
        const { req, res } = getMockRequestAndResponse({}, mockBody);
        const mockStringifiedInputCheck = JSON.stringify({ numberOfProductsInput: '', error: 'Enter a number' });
        howManyProducts(req, res);
        expect(setCookieSpy).toHaveBeenCalledWith(NUMBER_OF_PRODUCTS_COOKIE, mockStringifiedInputCheck, req, res);
    });

    it('should set the NUMBER_OF_PRODUCTS_COOKIE when redirecting to /multipleProducts', () => {
        const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');
        const mockBody = { numberOfProductsInput: '8' };
        const { req, res } = getMockRequestAndResponse({}, mockBody);
        const mockStringifiedInputCheck = JSON.stringify({ numberOfProductsInput: '8' });
        howManyProducts(req, res);
        expect(setCookieSpy).toBeCalledWith(NUMBER_OF_PRODUCTS_COOKIE, mockStringifiedInputCheck, req, res);
    });
});
