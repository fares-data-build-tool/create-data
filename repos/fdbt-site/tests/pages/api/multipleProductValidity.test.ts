import { getMockRequestAndResponse } from '../../testData/mockData';
import multipleProductValidity from '../../../src/pages/api/multipleProductValidity';
import * as sessions from '../../../src/utils/sessions';
import { MULTIPLE_PRODUCT_ATTRIBUTE } from '../../../src/constants/attributes';

describe('multipleProductValidity', () => {
    const writeHeadMock = jest.fn();
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    const mockProducts = expect.arrayContaining([
        expect.objectContaining({
            productName: expect.any(String),
            productNameId: expect.any(String),
            productPrice: expect.any(String),
            productPriceId: expect.any(String),
            productDuration: expect.any(String),
            productDurationId: expect.any(String),
            productValidity: expect.any(String),
            productValidityId: expect.any(String),
        }),
    ]);

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('updates the MULTIPLE_PRODUCT_ATTRIBUTE and redirects to selectSalesOfferPackage page if all valid', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareZoneName: null },
            body: {
                'validity-option-0': '24hr',
                'validity-option-1': '24hr',
                'validity-option-2': 'endOfCalendarDay',
            },
            mockWriteHeadFn: writeHeadMock,
        });
        multipleProductValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/ticketConfirmation',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, MULTIPLE_PRODUCT_ATTRIBUTE, {
            products: mockProducts,
        });
    });

    it('updates the MULTIPLE_PRODUCT_ATTRIBUTE with errors and redirects to itself (i.e. /multipleProductValidity) if invalid', () => {
        const mockErrors = expect.arrayContaining([
            expect.objectContaining({ errorMessage: expect.any(String), id: expect.any(String) }),
        ]);
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareZoneName: null },
            body: {
                'validity-option-0': '24hr',
                'validity-option-1': '24hr',
            },
            mockWriteHeadFn: writeHeadMock,
        });
        multipleProductValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/multipleProductValidity',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, MULTIPLE_PRODUCT_ATTRIBUTE, {
            products: mockProducts,
            errors: mockErrors,
        });
    });
});
