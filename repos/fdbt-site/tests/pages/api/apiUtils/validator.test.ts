import {
    removeExcessWhiteSpace,
    isCurrency,
    removeAllWhiteSpace,
    isValid24hrTimeFormat,
    invalidCharactersArePresent,
} from '../../../../src/utils/apiUtils/validator';

describe('validator', () => {
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

    describe('isValid24hrTimeFormat', () => {
        it.each([
            [true, 'a valid time', '0730'],
            [true, 'the max value', '2359'],
            [true, 'the min value', '0000'],
            [false, 'a valid time over the max value', '2400'],
            [false, 'an invalid time', '7pm'],
        ])('should return %s for %s in 2400 format', (validity, _case, value) => {
            expect(isValid24hrTimeFormat(value)).toBe(validity);
        });
    });

    describe('invalidCharactersArePresent', () => {
        it.each([
            [true, 'invalid character <', 'hello<'],
            [true, 'invalid character >', 'hello>'],
            [true, 'invalid character ?', 'hello?'],
            [true, 'invalid character !', 'hello!'],
            [true, 'invalid character "', 'hello"'],
            [false, 'valid character @', 'hello@'],
            [false, 'valid characters', 'Hello'],
            [false, 'valid character /', 'hello/'],
            [false, 'valid character \\', 'hello\\'],
            [false, 'valid character +', 'hello+'],
            [false, 'valid character -', 'hello-'],
            [false, 'valid character _', 'hello_'],
            [false, 'valid character .', 'hello.'],
            [false, 'valid character &', 'hello&'],
            [false, 'valid space character', 'hello world'],
            [false, 'valid character ,', 'hello, world'],
            [false, "valid character '", "The King's head"],
        ])('should return %s for %s', (validity, _case, value) => {
            expect(invalidCharactersArePresent(value)).toBe(validity);
        });
    });
});
