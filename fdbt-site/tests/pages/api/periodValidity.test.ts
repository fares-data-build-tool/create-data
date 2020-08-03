import { getMockRequestAndResponse } from '../../testData/mockData';
import * as sessions from '../../../src/utils/sessions';
import periodValidity, { PeriodExpiryWithErrors } from '../../../src/pages/api/periodValidity';
import { ProductData } from '../../../src/interfaces';
import { PERIOD_EXPIRY_ATTRIBUTE } from '../../../src/constants';

describe('periodValidity', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('correctly generates product info, updates the PERIOD_EXPIRY_ATTRIBUTE and then redirects to selectSalesOfferPackage page if all is valid', () => {
        const mockProductInfo: ProductData = {
            products: [
                {
                    productName: 'Product A',
                    productPrice: '1234',
                    productDuration: '2',
                    productValidity: '24hr',
                },
            ],
        };

        const { req, res } = getMockRequestAndResponse({
            cookieValues: { selectedServices: null },
            body: { periodValid: '24hr' },
            mockWriteHeadFn: writeHeadMock,
        });
        periodValidity(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PERIOD_EXPIRY_ATTRIBUTE, mockProductInfo);
        expect(writeHeadMock).toBeCalledWith(302, { Location: '/selectSalesOfferPackage' });
    });

    it('correctly generates period expiry error info, updates the PERIOD_EXPIRY_ATTRIBUTE and then redirects to periodValidity page when there is no period validity info', () => {
        const mockPeriodExpiryAttributeError: PeriodExpiryWithErrors = {
            errorMessage: 'Choose an option regarding your period ticket validity',
        };

        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareZoneName: null },
            body: {},
            mockWriteHeadFn: writeHeadMock,
        });
        periodValidity(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            PERIOD_EXPIRY_ATTRIBUTE,
            mockPeriodExpiryAttributeError,
        );
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/periodValidity',
        });
    });
});
