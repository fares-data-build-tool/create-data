import {
    isSessionValid,
    removeExcessWhiteSpace,
    isCurrency,
    removeAllWhiteSpace,
} from '../../../../src/pages/api/apiUtils/validator';
import { getMockRequestAndResponse } from '../../../testData/mockData';

describe('validator', () => {
    describe('isSessionvalid', () => {
        it('should return true when there is an operator cookie', () => {
            const { req, res } = getMockRequestAndResponse();
            const result = isSessionValid(req, res);
            expect(result).toBeTruthy();
        });

        it('should return false when there is no operator cookie', () => {
            const { req, res } = getMockRequestAndResponse({ cookieValues: { operator: null } });
            const result = isSessionValid(req, res);
            expect(result).toBeFalsy();
        });
    });

    describe('removeExcessWhiteSpace', () => {
        it('should return a product name with no excessive whitespace', () => {
            const input = '   This is     my   product      ';
            const expected = 'This is my product';

            expect(removeExcessWhiteSpace(input)).toBe(expected);
        });
        it('should return an empty string if input is undefined', () => {
            const input = undefined;
            const expected = '';

            expect(removeExcessWhiteSpace(input)).toBe(expected);
        });
    });

    describe('removeAllWhiteSpace', () => {
        it.each([
            ['1', '   1 '],
            ['24', '   2      4     '],
            ['43', '4       3'],
            ['one', ' o     n     e'],
            ['blank', 'blank'],
        ])('should remove all whitespace from %s to give %s', (expectedInput, input) => {
            expect(removeAllWhiteSpace(input)).toBe(expectedInput);
        });
    });

    describe('isCurrency', () => {
        it('should return true for a currency', () => {
            expect(isCurrency('1.50')).toBe(true);
        });

        it('should return false for a non-currency', () => {
            expect(isCurrency('1.0006')).toBe(false);
        });

        it('should return false for an mixed-invalid input', () => {
            expect(isCurrency('1.ff4')).toBe(false);
        });
    });
});
