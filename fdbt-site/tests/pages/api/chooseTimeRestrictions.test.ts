import { collectErrors, isValidTime, collectInputsFromRequest } from '../../../src/pages/api/chooseTimeRestrictions';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('changePassword', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('isValidTime', () => {
        it('should return true for a valid time in 2400 format', () => {
            expect(isValidTime('0730')).toBe(true);
        });
        it('should return false for 1 over the maximum value in 2400 format', () => {
            expect(isValidTime('2400')).toBe(false);
        });
        it('should return true for the maximum value in 2400 format', () => {
            expect(isValidTime('2359')).toBe(true);
        });
        it('should return true for the minumum value in 2400 format', () => {
            expect(isValidTime('0000')).toBe(true);
        });
        it('should return false for an invalid time in 2400 format', () => {
            expect(isValidTime('7pm')).toBe(false);
        });
        it('should return false for a valid time format but ovre 2400', () => {
            expect(isValidTime('2500')).toBe(false);
        });
    });

    describe('collectInputsFromRequest', () => {
        it('should pull all inputs and put them in new format', () => {
            const { req } = getMockRequestAndResponse({
                cookieValues: {},
                body: {
                    startTimemonday: '0200',
                    endTimemonday: '2120',
                    startTimetuesday: '0200',
                    endTimetuesday: '2120',
                    startTimebankHoliday: '0200',
                    endTimebankHoliday: '2120',
                    startTimefriday: '0200',
                    endTimefriday: '2120',
                },
            });
            const validDays = ['monday', 'tuesday', 'bankHoliday', 'friday'];
            const result = collectInputsFromRequest(req, validDays);
            expect(result).toStrictEqual([
                { day: 'monday', endTime: '2120', startTime: '0200' },
                { day: 'tuesday', endTime: '2120', startTime: '0200' },
                { day: 'bankHoliday', endTime: '2120', startTime: '0200' },
                { day: 'friday', endTime: '2120', startTime: '0200' },
            ]);
        });
    });

    describe('collectErrors', () => {
        it('should return an array of errors for some incorrect inputs', () => {
            const inputs = [
                {
                    day: 'monday',
                    startTime: '7pm',
                    endTime: '8888888',
                },
                {
                    day: 'tuesday',
                    startTime: '-0730',
                    endTime: '2400',
                },
                {
                    day: 'wednesday',
                    startTime: '0890',
                    endTime: '0460',
                },
            ];
            const result = collectErrors(inputs);
            expect(result).toStrictEqual([
                {
                    errorMessage: 'Time must be in 2400 format',
                    id: 'start-time-monday',
                    userInput: '7pm',
                },
                {
                    errorMessage: 'Time must be in 2400 format',
                    id: 'end-time-monday',
                    userInput: '8888888',
                },
                {
                    errorMessage: 'Time must be in 2400 format',
                    id: 'start-time-tuesday',
                    userInput: '-0730',
                },
                {
                    errorMessage: '2400 is not a valid input. Use 0000.',
                    id: 'end-time-tuesday',
                    userInput: '2400',
                },
                {
                    errorMessage: 'Time must be in 2400 format',
                    id: 'start-time-wednesday',
                    userInput: '0890',
                },
                {
                    errorMessage: 'Time must be in 2400 format',
                    id: 'end-time-wednesday',
                    userInput: '0460',
                },
            ]);
        });
        it('should return no errors for empty inputs', () => {
            const inputs = [
                {
                    day: 'monday',
                    startTime: '',
                    endTime: '',
                },
                {
                    day: 'tuesday',
                    startTime: '',
                    endTime: '',
                },
            ];
            const result = collectErrors(inputs);
            expect(result).toStrictEqual([]);
        });
        it('should return no errors for valid only inputs', () => {
            const inputs = [
                {
                    day: 'monday',
                    startTime: '2359',
                    endTime: '0000',
                },
                {
                    day: 'tuesday',
                    startTime: '1345',
                    endTime: '0845',
                },
            ];
            const result = collectErrors(inputs);
            expect(result).toStrictEqual([]);
        });
        it('should return no errors for a mixture of empty inputs and valid inputs', () => {
            const inputs = [
                {
                    day: 'monday',
                    startTime: '',
                    endTime: '',
                },
                {
                    day: 'tuesday',
                    startTime: '',
                    endTime: '2100',
                },
                {
                    day: 'bank holiday',
                    startTime: '0800',
                    endTime: '',
                },
                {
                    day: 'thursday',
                    startTime: '0400',
                    endTime: '1300',
                },
            ];
            const result = collectErrors(inputs);
            expect(result).toStrictEqual([]);
        });
    });
});
