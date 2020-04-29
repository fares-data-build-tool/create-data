import { removeExcessWhiteSpace, isCurrency } from '../../../../src/pages/api/service/inputValidator';

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
