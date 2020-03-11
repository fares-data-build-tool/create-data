import mockReqRes, { mockRequest, mockResponse } from 'mock-req-res';
import { PERIOD_PRODUCT } from '../../../src/constants';
import periodProduct from '../../../src/pages/api/periodProduct';
import * as validator from '../../../src/pages/api/service/validator';
import * as apiUtils from '../../../src/pages/api/apiUtils';

describe('periodProduct', () => {
    let res: mockReqRes.ResponseOutput;
    let writeHeadMock: jest.Mock;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let setCookieSpy: any;

    beforeEach(() => {
        jest.resetAllMocks();
        writeHeadMock = jest.fn();
        res = mockResponse({
            writeHead: writeHeadMock,
        });

        jest.spyOn(validator, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(true);

        setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');
    });

    it('should set period product cookie with errors on submit', () => {
        const req = mockRequest({
            body: { periodProductNameInput: '', periodProductPriceInput: '' },
        });

        const mockPeriodProductCookies = {
            productNameError: true,
            productPriceError: true,
            productName: '',
            productPrice: '',
        };

        periodProduct(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(
            '',
            PERIOD_PRODUCT,
            JSON.stringify(mockPeriodProductCookies),
            req,
            res,
        );
    });

    it('should create period product cookie if submit is valid', () => {
        const req = mockRequest({
            body: { periodProductNameInput: 'ProductA', periodProductPriceInput: '121' },
        });

        const mockPeriodProductCookies = {
            productNameError: false,
            productPriceError: false,
            productName: 'ProductA',
            productPrice: '121',
        };

        periodProduct(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(
            '',
            PERIOD_PRODUCT,
            JSON.stringify(mockPeriodProductCookies),
            req,
            res,
        );
    });

    it('should remove leading trailing spaces and tabs', () => {
        const req = mockRequest({
            body: { periodProductNameInput: '     ProductBA', periodProductPriceInput: '121' },
        });

        const mockPeriodProductCookies = {
            productNameError: false,
            productPriceError: false,
            productName: 'ProductBA',
            productPrice: '121',
        };

        periodProduct(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(
            '',
            PERIOD_PRODUCT,
            JSON.stringify(mockPeriodProductCookies),
            req,
            res,
        );
    });
});
