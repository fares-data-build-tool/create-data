import { getMockRequestAndResponse } from '../../testData/mockData';
import multipleProductValidity, { addErrorsIfInvalid, Product } from '../../../src/pages/api/multipleProductValidity';

describe('multipleProductValidity', () => {
    const writeHeadMock = jest.fn();

    describe('addErrorsIfInvalid', () => {
        it('adds errors to incorrect data if there are invalid inputs', () => {
            const { req } = getMockRequestAndResponse({
                body: {
                    'validity-row0': '',
                    'validity-row1': '',
                },
            });

            const userInputIndex = 0;
            const product: Product = {
                productName: 'super ticket',
                productNameId: '',
                productPrice: '3.50',
                productPriceId: '',
                productDuration: '3',
                productDurationId: '',
                serviceEndTime: '',
            };
            const result = addErrorsIfInvalid(req, product, userInputIndex);

            expect(result.productValidity).toBe('');
            expect(result.productValidityError).toBe('Select one of the three expiry options');
        });

        it('does not add errors to correct data', () => {
            const { req } = getMockRequestAndResponse({
                body: {
                    'validity-option-0': 'endOfCalendarDay',
                },
            });

            const userInputIndex = 0;
            const product: Product = {
                productName: 'best ticket',
                productNameId: '',
                productPrice: '30.90',
                productPriceId: '',
                productDuration: '30',
                productDurationId: '',
                productValidity: 'endOfCalendarDay',
            };
            const result = addErrorsIfInvalid(req, product, userInputIndex);

            expect(result.productValidity).toBe('endOfCalendarDay');
            expect(result.productValidityError).toBe(undefined);
        });

        it('add error when service day is selected but no end time entered', () => {
            const { req } = getMockRequestAndResponse({
                body: {
                    'validity-option-0': 'endOfServiceDay',
                    'validity-end-time-0': '',
                },
            });

            const userInputIndex = 0;
            const product: Product = {
                productName: 'best ticket',
                productNameId: '',
                productPrice: '30.90',
                productPriceId: '',
                productDuration: '30',
                productDurationId: '',
                productValidity: 'endOfServiceDay',
            };
            const result = addErrorsIfInvalid(req, product, userInputIndex);

            expect(result.productValidity).toBe('endOfServiceDay');
            expect(result.productValidityError).toBe('Specify an end time for service day');
        });

        it('add error when validity end time is entered incorrectly', () => {
            const { req } = getMockRequestAndResponse({
                body: {
                    'validity-option-0': 'endOfServiceDay',
                    'validity-end-time-0': '2400',
                },
            });

            const userInputIndex = 0;
            const product: Product = {
                productName: 'best ticket',
                productNameId: '',
                productPrice: '30.90',
                productPriceId: '',
                productDuration: '30',
                productDurationId: '',
                productValidity: 'endOfServiceDay',
            };
            const result = addErrorsIfInvalid(req, product, userInputIndex);

            expect(result.productValidity).toBe('endOfServiceDay');
            expect(result.productValidityError).toBe('2400 is not a valid input. Use 0000.');
        });

        it('should not error if there is whitespace in the time', () => {
            const { req } = getMockRequestAndResponse({
                body: {
                    'validity-option-0': 'endOfServiceDay',
                    'validity-end-time-0': ' 1200',
                },
            });

            const userInputIndex = 0;
            const product: Product = {
                productName: 'best ticket',
                productNameId: '',
                productPrice: '30.90',
                productPriceId: '',
                productDuration: '30',
                productDurationId: '',
                productValidity: 'endOfServiceDay',
            };
            const result = addErrorsIfInvalid(req, product, userInputIndex);

            expect(result.productValidity).toBe('endOfServiceDay');
            expect(result.productValidityError).toBe(undefined);
        });

        it('add error when validity end time is has invalid characters', () => {
            const { req } = getMockRequestAndResponse({
                body: {
                    'validity-option-0': 'endOfServiceDay',
                    'validity-end-time-0': '140a',
                },
            });

            const userInputIndex = 0;
            const product: Product = {
                productName: 'best ticket',
                productNameId: '',
                productPrice: '30.90',
                productPriceId: '',
                productDuration: '30',
                productDurationId: '',
                productValidity: 'endOfServiceDay',
            };
            const result = addErrorsIfInvalid(req, product, userInputIndex);

            expect(result.productValidity).toBe('endOfServiceDay');
            expect(result.productValidityError).toBe('Time must be in 2400 format');
        });
    });

    it('redirects to selectSalesOfferPackage page if all valid', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareZoneName: null },
            body: {
                'validity-option-0': '24hr',
                'validity-option-1': '24hr',
                'validity-option-2': 'endOfCalendarDay',
                listOfEndTimes: '',
            },
            mockWriteHeadFn: writeHeadMock,
        });
        multipleProductValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/ticketConfirmation',
        });
    });

    it('should redirect to the error page if a required cookie is missing', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { operator: null },
            body: { 'validity-row0': 'endOfCalendarDay' },
            mockWriteHeadFn: writeHeadMock,
        });

        multipleProductValidity(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
