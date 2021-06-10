import { CarnetExpiryUnit, PointToPointProductInfo } from '../../../src/interfaces/index';
import carnetProductDetails from '../../../src/pages/api/carnetProductDetails';
import { FARE_TYPE_ATTRIBUTE, PRODUCT_DETAILS_ATTRIBUTE } from '../../../src/constants/attributes';
import * as sessions from '../../../src/utils/sessions';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('carnetProductDetails', () => {
    const updateAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

    const writeHeadMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should set PRODUCT_DETAILS_ATTRIBUTE with errors and redirect to carnetProductDetails when the user input is invalid', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                productDetailsNameInput: '',
                productDetailsQuantityInput: '',
                productDetailsExpiryDurationInput: '',
                productDetailsExpiryUnitInput: '',
            },
            mockWriteHeadFn: writeHeadMock,
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'single' } },
        });

        const expectedProductDetails = {
            productName: '',
            carnetDetails: {
                expiryTime: '',
                expiryUnit: '',
                quantity: '',
            },
            errors: [
                {
                    errorMessage: 'Product name cannot have less than 2 characters',
                    id: 'product-details-name',
                },
                {
                    errorMessage: 'Carnet quantity cannot be empty',
                    id: 'product-details-carnet-quantity',
                },
                {
                    errorMessage: 'Expiry time cannot be empty',
                    id: 'product-details-carnet-expiry-quantity',
                },
                {
                    errorMessage: 'Select a valid expiry unit',
                    id: 'product-details-carnet-expiry-unit',
                },
            ],
        };

        carnetProductDetails(req, res);

        expect(updateAttributeSpy).toHaveBeenCalledWith(req, PRODUCT_DETAILS_ATTRIBUTE, expectedProductDetails);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/carnetProductDetails',
        });
    });

    it('should correctly set PRODUCT_DETAILS_ATTRIBUTE and redirect to ticketConfirmation when the user input is valid for single ticket', () => {
        const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

        const { req, res } = getMockRequestAndResponse({
            body: {
                productDetailsNameInput: 'Test Product',
                productDetailsQuantityInput: '5',
                productDetailsExpiryDurationInput: '5',
                productDetailsExpiryUnitInput: CarnetExpiryUnit.DAY,
            },
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'single' } },
        });

        const expectedProductDetails: PointToPointProductInfo = {
            productName: 'Test Product',
            carnetDetails: {
                quantity: '5',
                expiryTime: '5',
                expiryUnit: CarnetExpiryUnit.DAY,
            },
        };

        carnetProductDetails(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, PRODUCT_DETAILS_ATTRIBUTE, expectedProductDetails);
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/ticketConfirmation',
        });
    });

    it('should correctly set PRODUCT_DETAILS_ATTRIBUTE and redirect to returnValidity when the user input is valid for a return ticket', () => {
        const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

        const { req, res } = getMockRequestAndResponse({
            body: {
                productDetailsNameInput: 'Test Product',
                productDetailsQuantityInput: '10',
                productDetailsExpiryDurationInput: '10',
                productDetailsExpiryUnitInput: CarnetExpiryUnit.MONTH,
            },
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'return' } },
        });

        const expectedProductDetails: PointToPointProductInfo = {
            productName: 'Test Product',
            carnetDetails: {
                quantity: '10',
                expiryTime: '10',
                expiryUnit: CarnetExpiryUnit.MONTH,
            },
        };

        carnetProductDetails(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, PRODUCT_DETAILS_ATTRIBUTE, expectedProductDetails);
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/returnValidity',
        });
    });

    it('should remove leading and trailing spaces and tabs from valid user input', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                productDetailsNameInput: '           Test Product  ',
                productDetailsQuantityInput: '5   ',
                productDetailsExpiryDurationInput: '  5',
                productDetailsExpiryUnitInput: CarnetExpiryUnit.DAY,
            },
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'single' },
            },
        });

        const expectedProductDetails: PointToPointProductInfo = {
            productName: 'Test Product',
            carnetDetails: {
                quantity: '5',
                expiryTime: '5',
                expiryUnit: CarnetExpiryUnit.DAY,
            },
        };

        carnetProductDetails(req, res);

        expect(updateAttributeSpy).toHaveBeenCalledWith(req, PRODUCT_DETAILS_ATTRIBUTE, expectedProductDetails);
    });

    it('should allow duration to be empty when expiry unit is NO_EXPIRY', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                productDetailsNameInput: 'Test Product',
                productDetailsQuantityInput: '5',
                productDetailsExpiryDurationInput: '',
                productDetailsCarnetExpiryUnitInput: CarnetExpiryUnit.NO_EXPIRY,
            },
            mockWriteHeadFn: writeHeadMock,
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'single' } },
        });

        carnetProductDetails(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/carnetProductDetails',
        });
    });
});
