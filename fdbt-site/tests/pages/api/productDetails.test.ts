import productDetails from '../../../src/pages/api/productDetails';
import { PRODUCT_DETAILS_ATTRIBUTE } from '../../../src/constants';
import * as s3 from '../../../src/data/s3';
import * as validator from '../../../src/pages/api/apiUtils/validator';
import * as apiUtils from '../../../src/pages/api/apiUtils';
import * as sessions from '../../../src/utils/sessions';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('productDetails', () => {
    const updateAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    const putStringInS3Spy = jest.spyOn(s3, 'putStringInS3');
    putStringInS3Spy.mockImplementation(() => Promise.resolve());

    const writeHeadMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();

        jest.spyOn(validator, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(true);
    });

    it('should set PRODUCT_DETAILS_ATTRIBUTE with errors when the user input is invalid', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'period' },
            body: { productDetailsNameInput: '', productDetailsPriceInput: '' },
        });

        const expectedProductDetails = {
            productName: '',
            productPrice: '',
            errors: [
                {
                    errorMessage: 'Product name cannot have less than 2 characters',
                    id: 'product-name-error',
                },
                {
                    errorMessage: 'This field cannot be empty',
                    id: 'product-price-error',
                },
            ],
        };

        productDetails(req, res);

        expect(updateAttributeSpy).toHaveBeenCalledWith(req, PRODUCT_DETAILS_ATTRIBUTE, expectedProductDetails);
    });

    it('should create PRODUCT_DETAILS_ATTRIBUTE when the user input is valid for a period ticket', () => {
        const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');

        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'period' },
            body: {
                productDetailsNameInput: 'ProductA',
                productDetailsPriceInput: '121',
                uuid: '1e0459b3-082e-4e70-89db-96e8ae173e1',
            },
        });

        const mockProductDetailsCookies = {
            productName: 'ProductA',
            productPrice: '121',
        };

        productDetails(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(
            PRODUCT_DETAILS_ATTRIBUTE,
            JSON.stringify(mockProductDetailsCookies),
            req,
            res,
        );
    });

    it('should remove leading and trailing spaces and tabs from valid user input', () => {
        const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');

        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'period' },
            body: {
                productDetailsNameInput: '     ProductBA',
                productDetailsPriceInput: '121',
                uuid: '1e0459b3-082e-4e70-89db-96e8ae173e1',
            },
        });

        const mockProductDetailsCookies = {
            productName: 'ProductBA',
            productPrice: '121',
        };

        productDetails(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(
            PRODUCT_DETAILS_ATTRIBUTE,
            JSON.stringify(mockProductDetailsCookies),
            req,
            res,
        );
    });

    it('should redirect to /productDetails when the user input is invalid', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'flatFare' },
            body: { productDetailsNameInput: '  ', productDetailsPriceInput: '1.4.2.4' },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        productDetails(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/productDetails',
        });
    });

    it('should redirect to /chooseValidity when the user input is valid and the user is entering details for a period ticket', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'period' },
            body: { productDetailsNameInput: 'Weekly Ride', productDetailsPriceInput: '7' },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        productDetails(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/chooseValidity',
        });
    });

    it('should redirect to /selectSalesOfferPackage when the user input is valid and the user is entering details for a flat fare ticket', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'flatFare' },
            body: { productDetailsNameInput: 'Day Rider', productDetailsPriceInput: '5' },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        productDetails(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectSalesOfferPackage',
        });
    });
});
