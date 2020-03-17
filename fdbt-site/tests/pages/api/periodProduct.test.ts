import { getMockRequestAndResponse } from '../../testData/mockData';
import { PERIOD_PRODUCT } from '../../../src/constants';
import periodProduct from '../../../src/pages/api/periodProduct';
import * as validator from '../../../src/pages/api/service/validator';
import * as apiUtils from '../../../src/pages/api/apiUtils';

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
        const writeHeadMock = jest.fn();
        const mockPeriodProductCookies = {
            productNameError: true,
            productPriceError: true,
            productName: '',
            productPrice: '',
        };
        const { req, res } = getMockRequestAndResponse(
            mockPeriodProductCookies,
            { periodProductNameInput: '', periodProductPriceInput: '' },
            {},
            writeHeadMock,
        );
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
        const writeHeadMock = jest.fn();
        const mockPeriodProductCookies = {
            productNameError: false,
            productPriceError: false,
            productName: 'ProductA',
            productPrice: '121',
        };
        const { req, res } = getMockRequestAndResponse(
            mockPeriodProductCookies,
            { periodProductNameInput: 'ProductA', periodProductPriceInput: '121' },
            {},
            writeHeadMock,
        );
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
        const writeHeadMock = jest.fn();
        const mockPeriodProductCookies = {
            productNameError: false,
            productPriceError: false,
            productName: 'Product BA',
            productPrice: '121',
        };
        const { req, res } = getMockRequestAndResponse(
            mockPeriodProductCookies,
            { periodProductNameInput: '     Product BA  ', periodProductPriceInput: '121' },
            {},
            writeHeadMock,
        );
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
