import { getMockRequestAndResponse } from '../../testData/mockData';
import * as sessions from '../../../src/utils/sessions';
import periodValidity from '../../../src/pages/api/periodValidity';
import { ErrorInfo, ProductData } from '../../../src/interfaces';
import { PERIOD_EXPIRY_ATTRIBUTE, SERVICE_LIST_ATTRIBUTE } from '../../../src/constants';

describe('periodValidity', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('correctly generates product info, updates the PERIOD_EXPIRY_ATTRIBUTE and then redirects to /ticketConfirmation if all is valid', () => {
        const mockProductInfo: ProductData = {
            products: [
                {
                    productName: 'Product A',
                    productPrice: '1234',
                    productDuration: '2 days',
                    productValidity: '24hr',
                    productEndTime: '',
                },
            ],
        };

        const { req, res } = getMockRequestAndResponse({
            session: {
                [SERVICE_LIST_ATTRIBUTE]: undefined,
            },
            body: { periodValid: '24hr' },
            mockWriteHeadFn: writeHeadMock,
        });
        periodValidity(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PERIOD_EXPIRY_ATTRIBUTE, mockProductInfo);
        expect(writeHeadMock).toBeCalledWith(302, { Location: '/ticketConfirmation' });
    });

    it('correctly generates period expiry error info, updates the PERIOD_EXPIRY_ATTRIBUTE and then redirects to periodValidity page when there is no period validity info', () => {
        const errors: ErrorInfo[] = [
            {
                id: 'period-end-calendar',
                errorMessage: 'Choose an option regarding your period ticket validity',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {},
            mockWriteHeadFn: writeHeadMock,
        });
        periodValidity(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, PERIOD_EXPIRY_ATTRIBUTE, { errors, products: [] });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/periodValidity',
        });
    });

    it('should redirect if the end of service day option selected and no time has been entered', () => {
        const errors: ErrorInfo[] = [
            {
                id: 'product-end-time',
                errorMessage: 'Specify an end time for service day',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                periodValid: 'endOfServiceDay',
                productEndTime: '',
            },
            mockWriteHeadFn: writeHeadMock,
        });
        periodValidity(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, PERIOD_EXPIRY_ATTRIBUTE, { errors, products: [] });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/periodValidity',
        });
    });

    it('should redirect and display error if the service end time has the incorrect time', () => {
        const errors: ErrorInfo[] = [
            {
                id: 'product-end-time',
                errorMessage: '2400 is not a valid input. Use 0000.',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                periodValid: 'endOfServiceDay',
                productEndTime: '2400',
            },
            mockWriteHeadFn: writeHeadMock,
        });
        periodValidity(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, PERIOD_EXPIRY_ATTRIBUTE, { errors, products: [] });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/periodValidity',
        });
    });

    it('should redirect and display error if invalid characters are entered for the service end time', () => {
        const errors: ErrorInfo[] = [
            {
                id: 'product-end-time',
                errorMessage: 'Time must be in 2400 format',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                periodValid: 'endOfServiceDay',
                productEndTime: 'abcd',
            },
            mockWriteHeadFn: writeHeadMock,
        });
        periodValidity(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, PERIOD_EXPIRY_ATTRIBUTE, { errors, products: [] });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/periodValidity',
        });
    });
});
