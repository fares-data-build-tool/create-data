import {
    removeExcessWhiteSpace,
    isCurrency,
    removeAllWhiteSpace,
    isValid24hrTimeFormat,
    invalidCharactersArePresent,
    invalidUrlInput,
    isValidInputDuration,
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
    describe('invalidUrlInput', () => {
        it.each([
            [false, 'Valid http URL', 'http://www.example.com'],
            [false, 'Valid https URL', 'https://www.example.com'],
            [false, 'Valid www.example.com', 'www.example.com'],
            [false, 'Valid example.com', 'example.com'],
            [true, 'Invalid URL without dot ', 'examplecom'],
            [true, 'invalid URL space', 'http://www.example. com'],
            [true, 'invalid URL simicolon', 'http://www.example.com;'],
            [false, 'valid character @', 'http://www.example.com@'],
            [true, 'Invalid string with no dot', 'Hello'],
            [true, 'valid character \\', 'http://www.example.com\\'],
            [false, 'valid character +', 'http://www.example.com+'],
            [false, 'valid character -', 'http://www.example.com-'],
            [false, 'valid character _', 'http://www.example.com_'],
            [false, 'valid character .', 'http://www.example.com.'],
            [false, 'valid character &', 'http://www.example.com&'],
            [false, 'valid character ,', 'http://www.example.com,'],
            [false, "valid character '", "http://www.example.com's"],
        ])('should return %s for %s', (validity, _case, value) => {
            expect(invalidUrlInput(value)).toBe(validity);
        });
    });

    describe('isValidInputDuration', () => {
        it.each([
            [true, 'Valid input duration for non carnet and non school', 'day', false, false],
            [true, 'Valid input duration for non carnet and non school', 'year', false, false],
            [false, 'Invalid input duration for non carnet and non school', 'no expiry', false, false],
            [false, 'Invalid input duration for non carnet and non school', 'term', false, false],

            [true, 'Valid input duration for carnet and non school', 'day', true, false],
            [true, 'Valid input duration for carnet and non school', 'no expiry', true, false],
            [false, 'Valid input duration for carnet and non school', 'term', true, false],

            [true, 'Valid input duration for non carnet and school', 'day', false, true],
            [true, 'Valid input duration for non carnet and school', 'term', false, true],
            [false, 'Invalid input duration for non carnet and school', 'no expiry', false, true],
            [false, 'Invalid input duration for non carnet and school', '', false, true],
        ])('should return %s for %s with duration as %s', (validity, _case, value, carnet, school) => {
            expect(isValidInputDuration(value, carnet, school)).toBe(validity);
        });
    });
});
