import periodProduct from '../../../src/pages/api/periodProduct';
import { PERIOD_PRODUCT_COOKIE } from '../../../src/constants';
import * as validator from '../../../src/pages/api/service/validator';
import * as apiUtils from '../../../src/pages/api/apiUtils';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('periodProduct', () => {
    beforeEach(() => {
        jest.resetAllMocks();

        jest.spyOn(validator, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(true);
    });

    it('should set period product cookie with errors on submit', () => {
        const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');

        const { req, res } = getMockRequestAndResponse({}, { periodProductNameInput: '', periodProductPriceInput: '' });

        const mockPeriodProductCookies = {
            uuid: '1e0459b3-082e-4e70-89db-96e8ae173e10',
            productName: '',
            productPrice: '',
            productNameError: 'Product name cannot have less than 2 characters',
            productPriceError: 'This field cannot be empty',
        };

        periodProduct(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(
            'localhost',
            PERIOD_PRODUCT_COOKIE,
            JSON.stringify(mockPeriodProductCookies),
            req,
            res,
        );
    });

    it('should create period product cookie if submit is valid', () => {
        const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');

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
            PERIOD_PRODUCT_COOKIE,
            JSON.stringify(mockPeriodProductCookies),
            req,
            res,
        );
    });

    it('should remove leading trailing spaces and tabs', () => {
        const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');

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
            PERIOD_PRODUCT_COOKIE,
            JSON.stringify(mockPeriodProductCookies),
            req,
            res,
        );
    });
});
