import periodProduct, { isCurrency, cleanPeriodNameInput } from '../../../src/pages/api/periodProduct';
import { PERIOD_PRODUCT } from '../../../src/constants';

import * as validator from '../../../src/pages/api/service/validator';
import * as apiUtils from '../../../src/pages/api/apiUtils';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('periodProduct', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let setCookieSpy: any;

    beforeEach(() => {
        jest.resetAllMocks();

        jest.spyOn(validator, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(true);

        setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');
    });

    it('should set period product cookie with errors on submit', () => {
        const { req, res } = getMockRequestAndResponse({}, { periodProductNameInput: '', periodProductPriceInput: '' });

        const mockPeriodProductCookies = {
            uuid: '1e0459b3-082e-4e70-89db-96e8ae173e10',
            productName: '',
            productPrice: '',
            productNameError: 'empty',
            productPriceError: 'empty',
        };

        periodProduct(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(
            'localhost',
            PERIOD_PRODUCT,
            JSON.stringify(mockPeriodProductCookies),
            req,
            res,
        );
    });

    it('should create period product cookie if submit is valid', () => {
        const { req, res } = getMockRequestAndResponse(
            {},
            {
                periodProductNameInput: 'ProductA',
                periodProductPriceInput: '121',
                uuid: '1e0459b3-082e-4e70-89db-96e8ae173e1',
            },
        );

        const mockPeriodProductCookies = {
            uuid: '1e0459b3-082e-4e70-89db-96e8ae173e10',
            productName: 'ProductA',
            productPrice: '121',
            productNameError: '',
            productPriceError: '',
        };

        periodProduct(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(
            'localhost',
            PERIOD_PRODUCT,
            JSON.stringify(mockPeriodProductCookies),
            req,
            res,
        );
    });

    it('should remove leading trailing spaces and tabs', () => {
        const { req, res } = getMockRequestAndResponse(
            {},
            {
                periodProductNameInput: '     ProductBA',
                periodProductPriceInput: '121',
                uuid: '1e0459b3-082e-4e70-89db-96e8ae173e1',
            },
        );

        const mockPeriodProductCookies = {
            uuid: '1e0459b3-082e-4e70-89db-96e8ae173e10',
            productName: 'ProductBA',
            productPrice: '121',
            productNameError: '',
            productPriceError: '',
        };

        periodProduct(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(
            'localhost',
            PERIOD_PRODUCT,
            JSON.stringify(mockPeriodProductCookies),
            req,
            res,
        );
    });
});

describe('Current and product name checks', () => {
    it('should return true for a currency', () => {
        expect(isCurrency('1.50')).toBe(true);
    });

    it('should return false for a non-currency', () => {
        expect(isCurrency('1.0006')).toBe(false);
    });

    it('should return false for a nonsense input', () => {
        expect(isCurrency('1.ff4')).toBe(false);
    });

    it('should return a product name with no excessive whitespace', () => {
        const input = '   This is     my   product      ';
        const expected = 'This is my product';

        expect(cleanPeriodNameInput(input)).toBe(expected);
    });
});
