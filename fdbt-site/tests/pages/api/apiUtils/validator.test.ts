import { isSessionValid, removeExcessWhiteSpace, isCurrency } from '../../../../src/pages/api/apiUtils/validator';
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

    describe('Input checks', () => {
        it('should return a product name with no excessive whitespace', () => {
            const input = '   This is     my   product      ';
            const expected = 'This is my product';

            expect(removeExcessWhiteSpace(input)).toBe(expected);
        });

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
