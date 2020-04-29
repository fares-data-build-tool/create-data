import multipleProduct, {
    checkProductPricesAreValid,
    checkProductDurationsAreValid,
    containsErrors,
    getErrorsForCookie,
    checkProductNamesAreValid,
} from '../../../src/pages/api/multipleProducts';
import {
    multipleProducts,
    multipleProductsWithoutErrors,
    invalidDurationProducts,
    invalidPriceProducts,
    invalidNameProducts,
    getMockRequestAndResponse,
} from '../../testData/mockData';
import { setCookieOnResponseObject } from '../../../src/pages/api/apiUtils';

describe('multiple product data sorting methods', () => {
    it('returns error summary info given a list of products', () => {
        const errors = getErrorsForCookie(multipleProducts);
        expect(errors.errors.length).toBe(3);
    });

    it('returns true if a product list has errors', () => {
        const result = containsErrors(multipleProducts);
        expect(result).toBeTruthy();
    });

    it('returns false if a product list has no errors', () => {
        const result = containsErrors(multipleProductsWithoutErrors);
        expect(result).toBeFalsy();
    });

    it('adds duration errors to a product with invalid durations', () => {
        const result = checkProductDurationsAreValid(invalidDurationProducts);
        expect(result[0].productDurationError).toBeUndefined();
        expect(result[1].productDurationError).toBe('Product duration cannot be zero or a negative number');
        expect(result[2].productDurationError).toBe('Product duration cannot be zero or a negative number');
        expect(result[3].productDurationError).toBe('This field cannot be empty');
        expect(result[4].productDurationError).toBe('Product duration must be a whole, positive number');
    });

    it('adds price errors to a product with invalid prices', () => {
        const result = checkProductPricesAreValid(invalidPriceProducts);
        expect(result[0].productPriceError).toBeUndefined();
        expect(result[1].productPriceError).toBe('This field cannot be empty');
        expect(result[2].productPriceError).toBe('This must be a positive number');
        expect(result[3].productPriceError).toBe('This must be a valid price in pounds and pence');
    });

    it('adds name errors to a product with invalid names', () => {
        const result = checkProductNamesAreValid(invalidNameProducts);
        expect(result[0].productNameError).toBeUndefined();
        expect(result[1].productNameError).toBe('Product name cannot have less than 2 characters');
        expect(result[2].productNameError).toBe('Product name cannot have less than 2 characters');
        expect(result[3].productNameError).toBe('Product name cannot have more than 50 characters');
    });
});

describe('multipleProduct', () => {
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
                multipleProductNameInput1: 'Second Best Product',
                multipleProductPriceInput1: '2.05',
                multipleProductDurationInput1: '54',
            },
            { Location: '/multipleProducts' },
        ],

        [
            {
                multipleProductNameInput0: 'B',
                multipleProductPriceInput0: '2.00',
                multipleProductDurationInput0: '1',
                multipleProductNameInput1: 'Second Best Product',
                multipleProductPriceInput1: '2',
                multipleProductDurationInput1: '54',
            },
            { Location: '/multipleProducts' },
        ],

        [
            {
                multipleProductNameInput0: 'Best Product',
                multipleProductPriceInput0: '2.00',
                multipleProductDurationInput0: '23',
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
                multipleProductNameInput1: 'Second Best Product',
                multipleProductPriceInput1: '2.05',
                multipleProductDurationInput1: '54',
            },
            { Location: '/multipleProductValidity' },
        ],

        // this redirects to error, despite being valid, because the amount of
        // products we expect is 2
        [
            {
                multipleProductNameInput0: 'Best Product',
                multipleProductPriceInput0: '2.00',
                multipleProductDurationInput0: '1',
            },
            { Location: '/error' },
        ],

        [{}, { Location: '/error' }],

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
            { Location: '/error' },
        ],
    ];

    test.each(cases)('given %p as request, redirects to %p', (testData, expectedLocation) => {
        const { req, res } = getMockRequestAndResponse({}, testData, {}, writeHeadMock);

        (setCookieOnResponseObject as {}) = jest.fn();
        multipleProduct(req, res);
        expect(writeHeadMock).toBeCalledWith(302, expectedLocation);
    });
});
