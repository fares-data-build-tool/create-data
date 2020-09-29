import { ProductData, Product } from '../../../src/interfaces/index';
import productDetails from '../../../src/pages/api/productDetails';
import { FARE_TYPE_ATTRIBUTE, PRODUCT_DETAILS_ATTRIBUTE } from '../../../src/constants';
import * as sessions from '../../../src/utils/sessions';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('productDetails', () => {
    const updateAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

    const writeHeadMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should set PRODUCT_DETAILS_ATTRIBUTE with errors and redirect to productDetails when the user input is invalid', () => {
        const { req, res } = getMockRequestAndResponse({
            body: { productDetailsNameInput: '', productDetailsPriceInput: '' },
            mockWriteHeadFn: writeHeadMock,
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' } },
        });

        const expectedProductDetails = {
            productName: '',
            productPrice: '',
            errors: [
                {
                    errorMessage: 'Product name cannot have less than 2 characters',
                    id: 'product-details-name',
                },
                {
                    errorMessage: 'This field cannot be empty',
                    id: 'product-details-price',
                },
            ],
        };

        productDetails(req, res);

        expect(updateAttributeSpy).toHaveBeenCalledWith(req, PRODUCT_DETAILS_ATTRIBUTE, expectedProductDetails);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/productDetails',
        });
    });

    it('should correctly set PRODUCT_DETAILS_ATTRIBUTE cookie and redirect to chooseValidity when the user input is valid for a period ticket', () => {
        const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

        const { req, res } = getMockRequestAndResponse({
            body: {
                productDetailsNameInput: 'ProductA',
                productDetailsPriceInput: '121',
                uuid: '1e0459b3-082e-4e70-89db-96e8ae173e1',
            },
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' } },
        });

        const mockPeriodProductDetails: Product = {
            productName: 'ProductA',
            productPrice: '121',
        };

        productDetails(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            PRODUCT_DETAILS_ATTRIBUTE,
            mockPeriodProductDetails,
        );
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/chooseValidity',
        });
    });

    it('should correctly set PRODUCT_DETAILS_ATTRIBUTE and redirect to selectSalesOfferPackage when the user input is valid for a flat fare ticket', () => {
        const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

        const { req, res } = getMockRequestAndResponse({
            body: {
                productDetailsNameInput: 'ProductA',
                productDetailsPriceInput: '121',
                uuid: '1e0459b3-082e-4e70-89db-96e8ae173e1',
            },
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'flatFare' } },
        });

        const mockPeriodProductDetails: ProductData = {
            products: [
                {
                    productName: 'ProductA',
                    productPrice: '121',
                },
            ],
        };

        productDetails(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            PRODUCT_DETAILS_ATTRIBUTE,
            mockPeriodProductDetails,
        );
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/ticketConfirmation',
        });
    });

    it('should remove leading and trailing spaces and tabs from valid user input', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                productDetailsNameInput: '     ProductBA',
                productDetailsPriceInput: '121',
                uuid: '1e0459b3-082e-4e70-89db-96e8ae173e1',
            },
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'flatFare' },
            },
        });

        const mockProductDetails = {
            products: [{ productName: 'ProductBA', productPrice: '121' }],
        };

        productDetails(req, res);

        expect(updateAttributeSpy).toHaveBeenCalledWith(req, PRODUCT_DETAILS_ATTRIBUTE, mockProductDetails);
    });
});
