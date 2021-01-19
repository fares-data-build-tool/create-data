import multipleProduct, {
    checkProductPricesAreValid,
    checkProductDurationsAreValid,
    containsErrors,
    getErrorsForCookie,
    checkProductNamesAreValid,
    checkProductDurationTypesAreValid,
} from '../../../src/pages/api/multipleProducts';
import {
    multipleProducts,
    invalidDurationProducts,
    invalidPriceProducts,
    invalidNameProducts,
    getMockRequestAndResponse,
    duplicateNameProducts,
    invalidDurationTypeProducts,
    multipleProductsWithErrors,
} from '../../testData/mockData';
import { setCookieOnResponseObject } from '../../../src/pages/api/apiUtils';
import { NUMBER_OF_PRODUCTS_ATTRIBUTE } from '../../../src/constants';

describe('multipleProducts', () => {
    let writeHeadMock: jest.Mock;

    beforeEach(() => {
        writeHeadMock = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cases: any[] = [
        [
            {
                multipleProductNameInput0: 'Best Product',
                multipleProductPriceInput0: '2.00',
                multipleProductDurationInput0: '-1',
                multipleProductDurationUnitsInput0: 'week',
                multipleProductNameInput1: 'Second Best Product',
                multipleProductPriceInput1: '2.05',
                multipleProductDurationInput1: '54',
                multipleProductDurationUnitsInput1: 'month',
            },
            { Location: '/multipleProducts' },
        ],

        [
            {
                multipleProductNameInput0: 'B',
                multipleProductPriceInput0: '2.00',
                multipleProductDurationInput0: '1',
                multipleProductDurationUnitsInput0: 'year',
                multipleProductNameInput1: 'Second Best Product',
                multipleProductPriceInput1: '2',
                multipleProductDurationInput1: '54',
                multipleProductDurationUnitsInput1: 'week',
            },
            { Location: '/multipleProducts' },
        ],

        [
            {
                multipleProductNameInput0: 'Best Product',
                multipleProductPriceInput0: '2.00',
                multipleProductDurationInput0: '23',
                multipleProductDurationUnitsInput0: 'week',
                multipleProductNameInput1:
                    'Super Saver Bus Ticket for the cheapest you have ever seen and no other bus service will compare to this one, or your money back',
                multipleProductPriceInput1: '2.05',
                multipleProductDurationInput1: '54',
            },
            { Location: '/multipleProducts' },
        ],

        [
            {
                multipleProductNameInput0: 'Best Product',
                multipleProductPriceInput0: '2.00',
                multipleProductDurationInput0: '3',
                multipleProductDurationUnitsInput0: 'day',
                multipleProductNameInput1: 'Second Best Product',
                multipleProductPriceInput1: '2.05',
                multipleProductDurationInput1: '54',
                multipleProductDurationUnitsInput1: 'week',
            },
            { Location: '/multipleProductValidity' },
        ],

        [
            {
                multipleProductNameInput0: '',
                multipleProductPriceInput0: '',
                multipleProductDurationInput0: '',
                multipleProductNameInput1: '',
                multipleProductPriceInput1: '',
                multipleProductDurationInput1: '',
                multipleProductNameInput3: '',
                multipleProductPriceInput3: '',
                multipleProductDurationInput3: '',
                multipleProductNameInput4: '',
                multipleProductPriceInput4: '',
                multipleProductDurationInput4: '',
            },
            { Location: '/multipleProducts' },
        ],
    ];

    test.each(cases)('given %p as request, redirects to %p', (testData, expectedLocation) => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: testData,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {
                [NUMBER_OF_PRODUCTS_ATTRIBUTE]: {
                    numberOfProductsInput: '2',
                },
            },
        });

        (setCookieOnResponseObject as {}) = jest.fn();
        multipleProduct(req, res);
        expect(writeHeadMock).toBeCalledWith(302, expectedLocation);
    });

    describe('getErrorsForCookie', () => {
        it('returns an empty array if a product list has no errors', () => {
            const errors = getErrorsForCookie(multipleProducts);
            expect(errors).toEqual([]);
        });

        it('returns an error info array if a product list has errors', () => {
            const errors = getErrorsForCookie(multipleProductsWithErrors);
            expect(errors.length).toBe(2);
        });
    });

    describe('containsErrors', () => {
        it('returns true if a product list has errors', () => {
            const result = containsErrors(multipleProductsWithErrors);
            expect(result).toBe(true);
        });

        it('returns false if a product list has no errors', () => {
            const result = containsErrors(multipleProducts);
            expect(result).toBe(false);
        });
    });

    describe('checkProductDurationsAreValid', () => {
        it('adds duration errors to a product with invalid durations', () => {
            const result = checkProductDurationsAreValid(invalidDurationProducts);
            expect(result[0].productDurationError).toBeUndefined();
            expect(result[1].productDurationError).toBe('Product duration cannot be zero or a negative number');
            expect(result[2].productDurationError).toBe('Product duration cannot be zero or a negative number');
            expect(result[3].productDurationError).toBe('This field cannot be empty');
            expect(result[4].productDurationError).toBe('Product duration must be a whole, positive number');
        });
    });

    describe('checkProductDurationTypesAreValid', () => {
        it('adds duration errors to a product with invalid durations', () => {
            const result = checkProductDurationTypesAreValid(invalidDurationTypeProducts);
            expect(result[0].productDurationUnitsError).toBeUndefined();
            expect(result[1].productDurationUnitsError).toBe('Choose an option from the dropdown');
            expect(result[2].productDurationUnitsError).toBeUndefined();
        });
    });

    describe('checkProductPricesAreValid', () => {
        it('adds price errors to a product with invalid prices', () => {
            const result = checkProductPricesAreValid(invalidPriceProducts);
            expect(result[0].productPriceError).toBeUndefined();
            expect(result[1].productPriceError).toBe('This field cannot be empty');
            expect(result[2].productPriceError).toBe('This must be a positive number');
            expect(result[3].productPriceError).toBe('This must be a valid price in pounds and pence');
        });
    });

    describe('checkProductNamesAreValid', () => {
        it('adds name errors to a product with invalid names', () => {
            const result = checkProductNamesAreValid(invalidNameProducts);
            expect(result[0].productNameError).toBeUndefined();
            expect(result[1].productNameError).toBe('Product name cannot have less than 2 characters');
            expect(result[2].productNameError).toBe('Product name cannot have less than 2 characters');
            expect(result[3].productNameError).toBe('Product name cannot have more than 50 characters');
        });

        it('adds name errors to a product with duplicate names', () => {
            const result = checkProductNamesAreValid(duplicateNameProducts);
            expect(result[0].productNameError).toBe('Product names must be unique');
            expect(result[1].productNameError).toBe('Product names must be unique');
            expect(result[2].productNameError).toBe('Product names must be unique');
        });
    });
});
