import chooseTimeRestrictions, {
    removeDuplicateAndEmptyTimebands,
    collectErrors,
    isValid24hrTimeFormat,
    collectInputsFromRequest,
} from '../../../src/pages/api/chooseTimeRestrictions';

import {
    FULL_TIME_RESTRICTIONS_ATTRIBUTE,
    TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE,
} from '../../../src/constants/attributes';

import * as sessions from '../../../src/utils/sessions';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('chooseTimeRestrictions', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    beforeEach(() => {
        jest.resetAllMocks();
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
                { day: 'monday', timeBands: [{ endTime: '2120', startTime: '0200' }] },
                { day: 'tuesday', timeBands: [{ endTime: '2120', startTime: '0200' }] },
                { day: 'bankHoliday', timeBands: [{ endTime: '2120', startTime: '0200' }] },
                { day: 'friday', timeBands: [{ endTime: '2120', startTime: '0200' }] },
            ]);
        });
    });

    describe('collectErrors', () => {
        it('should return an array of errors for some incorrect inputs', () => {
            const inputs = [
                {
                    day: 'monday',
                    timeBands: [
                        {
                            startTime: '7pm',
                            endTime: '8888888',
                        },
                    ],
                },
                {
                    day: 'tuesday',
                    timeBands: [
                        {
                            startTime: '-0730',
                            endTime: '2400',
                        },
                    ],
                },
                {
                    day: 'wednesday',
                    timeBands: [
                        {
                            startTime: '0890',
                            endTime: '0460',
                        },
                    ],
                },
            ];
            const result = collectErrors(inputs);
            expect(result).toStrictEqual([
                {
                    errorMessage: 'Time must be in 24hr format',
                    id: 'start-time-monday-0',
                    userInput: '7pm',
                },
                {
                    errorMessage: 'Time must be in 24hr format',
                    id: 'end-time-monday-0',
                    userInput: '8888888',
                },
                {
                    errorMessage: 'Time must be in 24hr format',
                    id: 'start-time-tuesday-0',
                    userInput: '-0730',
                },
                {
                    errorMessage: '2400 is not a valid input. Use 0000.',
                    id: 'end-time-tuesday-0',
                    userInput: '2400',
                },
                {
                    errorMessage: 'Time must be in 24hr format',
                    id: 'start-time-wednesday-0',
                    userInput: '0890',
                },
                {
                    errorMessage: 'Time must be in 24hr format',
                    id: 'end-time-wednesday-0',
                    userInput: '0460',
                },
            ]);
        });
        it('should return no errors for empty inputs', () => {
            const inputs = [
                {
                    day: 'monday',
                    timeBands: [
                        {
                            startTime: '',
                            endTime: '',
                        },
                    ],
                },
                {
                    day: 'tuesday',
                    timeBands: [
                        {
                            startTime: '',
                            endTime: '',
                        },
                    ],
                },
            ];
            const result = collectErrors(inputs);
            expect(result).toStrictEqual([]);
        });
        it('should return no errors for valid only inputs', () => {
            const inputs = [
                {
                    day: 'monday',
                    timeBands: [
                        {
                            startTime: '2359',
                            endTime: '0000',
                        },
                    ],
                },
                {
                    day: 'tuesday',
                    timeBands: [
                        {
                            startTime: '1345',
                            endTime: '0845',
                        },
                    ],
                },
            ];
            const result = collectErrors(inputs);
            expect(result).toStrictEqual([]);
        });
        it('should return errors for a mixture of empty inputs and valid inputs, according to endTime not being the only input', () => {
            const inputs = [
                {
                    day: 'monday',
                    timeBands: [
                        {
                            startTime: '',
                            endTime: '',
                        },
                    ],
                },
                {
                    day: 'tuesday',
                    timeBands: [
                        {
                            startTime: '',
                            endTime: '2100',
                        },
                    ],
                },
                {
                    day: 'bank holiday',
                    timeBands: [
                        {
                            startTime: '0800',
                            endTime: '',
                        },
                    ],
                },
                {
                    day: 'thursday',
                    timeBands: [
                        {
                            startTime: '0400',
                            endTime: '1300',
                        },
                    ],
                },
            ];
            const result = collectErrors(inputs);
            expect(result).toStrictEqual([
                {
                    errorMessage: 'Start time is required if end time is provided',
                    id: 'start-time-tuesday-0',
                    userInput: '',
                },
            ]);
        });
    });

    describe('removeDuplicateTimebands', () => {
        it('returns an array of inputs removed of duplicates', () => {
            const inputs = [
                {
                    day: 'monday',
                    timeBands: [
                        {
                            startTime: '0900',
                            endTime: '1000',
                        },
                        {
                            startTime: '0900',
                            endTime: '1000',
                        },
                        {
                            startTime: '0900',
                            endTime: '1000',
                        },
                        {
                            startTime: '0900',
                            endTime: '1030',
                        },
                    ],
                },
                {
                    day: 'tuesday',
                    timeBands: [
                        {
                            startTime: '0900',
                            endTime: '1000',
                        },
                    ],
                },
                {
                    day: 'bank holiday',
                    timeBands: [
                        {
                            startTime: '0900',
                            endTime: '1000',
                        },
                        {
                            startTime: '',
                            endTime: '',
                        },
                    ],
                },
                {
                    day: 'thursday',
                    timeBands: [
                        {
                            startTime: '0900',
                            endTime: '1000',
                        },
                        {
                            startTime: '0930',
                            endTime: '1000',
                        },
                        {
                            startTime: '0930',
                            endTime: '1000',
                        },
                        {
                            startTime: '',
                            endTime: '',
                        },
                    ],
                },
            ];
            const result = removeDuplicateAndEmptyTimebands(inputs);
            expect(result).toStrictEqual([
                {
                    day: 'monday',
                    timeBands: [
                        {
                            startTime: '0900',
                            endTime: '1000',
                        },
                        {
                            startTime: '0900',
                            endTime: '1030',
                        },
                    ],
                },
                {
                    day: 'tuesday',
                    timeBands: [
                        {
                            startTime: '0900',
                            endTime: '1000',
                        },
                    ],
                },
                {
                    day: 'bank holiday',
                    timeBands: [
                        {
                            startTime: '0900',
                            endTime: '1000',
                        },
                    ],
                },
                {
                    day: 'thursday',
                    timeBands: [
                        {
                            startTime: '0900',
                            endTime: '1000',
                        },
                        {
                            startTime: '0930',
                            endTime: '1000',
                        },
                    ],
                },
            ]);
        });
    });

    it('should update the session attribute and redirect to /fareConfirmation on valid input', () => {
        const { req, res } = getMockRequestAndResponse({
            body: { startTimemonday: '0900', endTimemonday: '1400' },
            session: { [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: { validDays: ['monday'] } },
        });
        chooseTimeRestrictions(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE, {
            fullTimeRestrictions: [{ day: 'monday', timeBands: [{ startTime: '0900', endTime: '1400' }] }],
            errors: [],
        });
        expect(res.writeHead).toBeCalledWith(302, { Location: '/fareConfirmation' });
    });

    it('should update the session attribute with errors and redirect to itself (i.e. /chooseTimeRestrictions) on invalid input', () => {
        const { req, res } = getMockRequestAndResponse({
            body: { startTimemonday: 'invalid', endTimemonday: '2600' },
            session: { [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: { validDays: ['monday'] } },
        });
        const mockErrors = [
            {
                errorMessage: expect.any(String),
                id: expect.any(String),
                userInput: expect.any(String),
            },
            {
                errorMessage: expect.any(String),
                id: expect.any(String),
                userInput: expect.any(String),
            },
        ];
        chooseTimeRestrictions(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE, {
            fullTimeRestrictions: [{ day: 'monday', timeBands: [{ startTime: 'invalid', endTime: '2600' }] }],
            errors: mockErrors,
        });
        expect(res.writeHead).toBeCalledWith(302, { Location: '/chooseTimeRestrictions' });
    });
});
