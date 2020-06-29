import productDetails from '../../../src/pages/api/productDetails';
import { PRODUCT_DETAILS_COOKIE } from '../../../src/constants';
import * as s3 from '../../../src/data/s3';
import * as validator from '../../../src/pages/api/service/validator';
import * as apiUtils from '../../../src/pages/api/apiUtils';
import { getMockRequestAndResponse, expectedFlatFareProductUploadJson } from '../../testData/mockData';

describe('productDetails', () => {
    const putStringInS3Spy = jest.spyOn(s3, 'putStringInS3');
    putStringInS3Spy.mockImplementation(() => Promise.resolve());

    const writeHeadMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();

        jest.spyOn(validator, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(true);
    });

    it('should set PRODUCT_DETAILS_COOKIE with errors when the user input is invalid', () => {
        const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');

        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'period' },
            body: { productDetailsNameInput: '', productDetailsPriceInput: '' },
        });

        const mockProductDetailsCookies = {
            productName: '',
            productPrice: '',
            productNameError: 'Product name cannot have less than 2 characters',
            productPriceError: 'This field cannot be empty',
        };

        productDetails(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(
            PRODUCT_DETAILS_COOKIE,
            JSON.stringify(mockProductDetailsCookies),
            req,
            res,
        );
    });

    it('should create PRODUCT_DETAILS_COOKIE when the user input is valid', () => {
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
            productNameError: '',
            productPriceError: '',
        };

        productDetails(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(
            PRODUCT_DETAILS_COOKIE,
            JSON.stringify(mockProductDetailsCookies),
            req,
            res,
        );
    });

    it('should remove leading trailing spaces and tabs', () => {
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
            productNameError: '',
            productPriceError: '',
        };

        productDetails(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(
            PRODUCT_DETAILS_COOKIE,
            JSON.stringify(mockProductDetailsCookies),
            req,
            res,
        );
    });

    it('should redirect to /productDetails when the user input is invalid', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'flatFare' },
            body: { productDetailsNameInput: '  ', productDetailsPriceInput: '1.4.2.4' },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        await productDetails(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/productDetails',
        });
    });

    it('should redirect to /chooseValidity when the user input is valid and the user is entering details for a period ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'period' },
            body: { productDetailsNameInput: 'Weekly Ride', productDetailsPriceInput: '7' },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        await productDetails(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/chooseValidity',
        });
    });

    it('should redirect to /thankyou when the user input is valid and the user is entering details for a flat fare ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'flatFare' },
            body: { productDetailsNameInput: 'Day Rider', productDetailsPriceInput: '5' },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        await productDetails(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/thankyou',
        });
    });

    it('correctly generates JSON for a flat fare product and uploads to S3', async () => {
        const mockDate = Date.now();

        jest.spyOn(global.Date, 'now').mockImplementation(() => mockDate);

        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'flatFare', fareZoneName: null },
            body: { productDetailsNameInput: 'Weekly Rider', productDetailsPriceInput: '7' },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });
        await productDetails(req, res);

        const actualFlatFareProduct = JSON.parse((putStringInS3Spy as jest.Mock).mock.calls[0][2]);
        expect(putStringInS3Spy).toBeCalledWith(
            'fdbt-matching-data-dev',
            `TEST/flatFare/1e0459b3-082e-4e70-89db-96e8ae173e10_${mockDate}.json`,
            expect.any(String),
            'application/json; charset=utf-8',
        );
        expect(actualFlatFareProduct).toEqual(expectedFlatFareProductUploadJson);
    });
});
