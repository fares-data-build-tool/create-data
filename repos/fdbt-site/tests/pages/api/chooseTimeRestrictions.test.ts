import { FULL_TIME_RESTRICTIONS_ATTRIBUTE, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE } from '../../../src/constants';
import chooseTimeRestrictions, {
    collectErrors,
    isValidTime,
    collectInputsFromRequest,
} from '../../../src/pages/api/chooseTimeRestrictions';
import * as sessions from '../../../src/utils/sessions';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('changePassword', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('isValidTime', () => {
        it.each([
            [true, 'a valid time', '0730'],
            [true, 'the max value', '2359'],
            [true, 'the min value', '0000'],
            [false, 'a valid time over the max value', '2400'],
            [false, 'an invalid time', '7pm'],
        ])('should return %s for %s in 2400 format', (validity, _case, value) => {
            expect(isValidTime(value)).toBe(validity);
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

    it('should update the session attribute and redirect to /fareConfirmation on valid input', () => {
        const { req, res } = getMockRequestAndResponse({
            body: { startTimemonday: '0900', endTimemonday: '1400' },
            session: { [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: { validDays: ['monday'] } },
        });
        chooseTimeRestrictions(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE, {
            fullTimeRestrictions: [{ day: 'monday', startTime: '0900', endTime: '1400' }],
            errors: [],
        });
        expect(res.writeHead).toBeCalledWith(302, { Location: '/fareConfirmation' });
    });

    it('should update the session attribute with errors and redirect to itself (i.e. /chooseTimeRestrictions) on invalid input', () => {
        const { req, res } = getMockRequestAndResponse({
            body: { startTimemonday: 'invalid', endTimemonday: '2600' },
            session: { [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: { validDays: ['monday'] } },
        });
        const mockErrors = expect.arrayContaining([
            expect.objectContaining({
                errorMessage: expect.any(String),
                id: expect.any(String),
                userInput: expect.any(String),
            }),
        ]);
        chooseTimeRestrictions(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE, {
            fullTimeRestrictions: [{ day: 'monday', startTime: 'invalid', endTime: '2600' }],
            errors: mockErrors,
        });
        expect(res.writeHead).toBeCalledWith(302, { Location: '/chooseTimeRestrictions' });
    });
});
