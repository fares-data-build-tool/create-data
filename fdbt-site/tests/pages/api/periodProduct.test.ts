import { PERIOD_PRODUCT } from '../../../src/constants';
import periodProduct from '../../../src/pages/api/periodProduct';
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
            productNameError: true,
            productPriceError: true,
            productName: '',
            productPrice: '',
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
            productNameError: false,
            productPriceError: false,
            productName: 'ProductA',
            productPrice: '121',
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
            productNameError: false,
            productPriceError: false,
            productName: 'ProductBA',
            productPrice: '121',
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
