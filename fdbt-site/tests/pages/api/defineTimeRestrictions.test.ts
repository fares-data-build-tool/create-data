import defineTimeRestrictions, {
    defineTimeRestrictionsSchema,
    timeRestrictionConditionalInputSchema,
    formatRequestBody,
    getErrorIdFromValidityError,
    collectUniqueErrors,
} from '../../../src/pages/api/defineTimeRestrictions';
import * as sessions from '../../../src/utils/sessions';
import {
    getMockRequestAndResponse,
    mockTimeRestrictionsInputErrors,
    mockTimeRestrictionsRadioAndInputErrors,
} from '../../testData/mockData';
import { FARE_TYPE_ATTRIBUTE, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE } from '../../../src/constants';
import { ErrorInfo, TimeRestriction } from '../../../src/interfaces';

describe('defineTimeRestrictions', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('defineTimeRestrictionsSchema', () => {
        it.each([
            [{}, false],
            [{ timeRestriction: 'No' }, false],
            [{ timeRestriction: 'Yes' }, false],
            [{ validDaysSelected: 'maybe' }, false],
            [{ validDaysSelected: 'No' }, false],
            [{ validDaysSelected: 'Yes' }, false],
            [{ timeRestriction: 'No', validDaysSelected: 'Yes' }, false],
            [{ timeRestriction: 'No', validDaysSelected: 'No' }, true],
            [{ timeRestriction: 'Yes', startTime: '1000', validDaysSelected: 'No' }, false],
            [{ timeRestriction: 'Yes', endTime: '1800', validDaysSelected: 'No' }, false],
            [{ timeRestriction: 'Yes', startTime: '11', validDaysSelected: 'No' }, false],
            [{ timeRestriction: 'Yes', endTime: '21', validDaysSelected: 'No' }, false],
            [{ timeRestriction: 'Yes', startTime: '50', endTime: '2300', validDaysSelected: 'No' }, false],
            [{ timeRestriction: 'Yes', startTime: '11', endTime: '21', validDaysSelected: 'No' }, false],
            [{ timeRestriction: 'Yes', startTime: '1200', endTime: '1400', validDaysSelected: 'No' }, true],
            [{ timeRestriction: 'No', validDaysSelected: 'Yes', validDays: ['monday', 'saturday'] }, true],
        ])('should validate that %s is %s', (candidate, validity) => {
            const result = defineTimeRestrictionsSchema.isValidSync(candidate);
            expect(result).toEqual(validity);
        });
    });

    describe('timeRestrictionConditionalInputSchema', () => {
        it.each([
            [{ timeRestriction: 'Yes' }, false],
            [{ timeRestriction: 'Yes', startTime: '1100', endTime: 'daddy' }, false],
            [{ timeRestriction: 'Yes', startTime: 'asda', endTime: 'tesco' }, false],
            [{ timeRestriction: 'Yes', startTime: '-12', endTime: '1200' }, false],
            [{ timeRestriction: 'Yes', startTime: '1.23453', endTime: '1200' }, false],
            [{ timeRestriction: 'Yes', startTime: '1300', endTime: '1100' }, false],
            [{ timeRestriction: 'Yes', startTime: '1200', endTime: '1400' }, true],
            [{ timeRestriction: 'No' }, true],
        ])('should validate that %s is %s', (candidate, validity) => {
            const result = timeRestrictionConditionalInputSchema.isValidSync(candidate);
            expect(result).toEqual(validity);
        });
    });

    describe('formatRequestBody', () => {
        it('should remove whitespace from the request body text inputs of startTime and endTime', () => {
            const reqBodyParams = { timeRestriction: 'Yes', validDaysSelected: 'No' };
            const { req } = getMockRequestAndResponse({
                cookieValues: {},
                body: { startTime: '   2   4', endTime: '   10   0       ', ...reqBodyParams },
            });
            const filtered = formatRequestBody(req);
            expect(filtered).toEqual({ startTime: '24', endTime: '100', ...reqBodyParams });
        });

        it('should force validDaysSelected to always be an array, even if there is only one selected', () => {
            const reqBodyParams = { timeRestriction: 'No', validDaysSelected: 'Yes' };
            const { req } = getMockRequestAndResponse({
                cookieValues: {},
                body: { validDays: 'thursday', ...reqBodyParams },
            });
            const filtered = formatRequestBody(req);
            expect(filtered).toEqual({ validDays: ['thursday'], ...reqBodyParams });
        });
    });

    describe('getErrorIdFromValidityError', () => {
        it.each([
            ['define-time-restrictions', 'timeRestriction'],
            ['define-valid-days', 'validDaysSelected'],
            ['start-time', 'startTime'],
            ['end-time', 'endTime'],
            ['valid-days-required', 'validDays'],
        ])('should return the id as %s when the error path is %s', (expectedId, errorPath) => {
            const actualId = getErrorIdFromValidityError(errorPath);
            expect(actualId).toEqual(expectedId);
        });

        it('should throw an error when the error path does not match a valid input field', () => {
            expect(() => getErrorIdFromValidityError('notValid')).toThrow();
        });
    });

    describe('collectUniqueErrors', () => {
        it('should return an array of unique errors when the initialErrors and currentSchemaErrors contain the same error IDs', () => {
            const initialErrors: ErrorInfo[] = [
                {
                    id: 'start-time',
                    errorMessage: 'Enter a start or end time in 24 hour format',
                    userInput: '44',
                },
                {
                    id: 'end-time',
                    errorMessage: 'Enter a start or end time in 24 hour format',
                    userInput: '33',
                },
            ];
            const currentSchemaErrors = [
                {
                    id: 'start-time',
                    errorMessage: 'The start time cannot be later than the end time',
                    userInput: '44',
                },
                {
                    id: 'end-time',
                    errorMessage: 'The end time cannot be earlier than the start time',
                    userInput: '33',
                },
            ];
            const actualErrors = collectUniqueErrors(initialErrors, currentSchemaErrors);
            expect(actualErrors).toEqual(initialErrors);
        });
    });

    it('should throw an error and redirect to the error page when the session is invalid', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { operator: null },
            body: {},
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await defineTimeRestrictions(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should throw an error and redirect to the error page when the FARE_TYPE_ATTRIBUTE is missing', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: { [FARE_TYPE_ATTRIBUTE]: null },
        });
        await defineTimeRestrictions(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should set the TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE and redirect depending on fare type when no errors are found', async () => {
        const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
        const mockReqBody = {
            timeRestriction: 'Yes',
            startTime: '1000',
            endTime: '1200',
            validDaysSelected: 'Yes',
            validDays: 'tuesday',
        };
        const mockAttributeValue: TimeRestriction = {
            startTime: '1000',
            endTime: '1200',
            validDays: ['tuesday'],
        };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'single' },
            body: mockReqBody,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await defineTimeRestrictions(req, res);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE,
            mockAttributeValue,
        );
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/service',
        });
    });

    it.each([
        [
            {
                timeRestriction: 'Yes',
                startTime: '',
                endTime: '',
                validDaysSelected: 'Yes',
            },
            {
                timeRestriction: 'Yes',
                validDaysSelected: 'Yes',
                startTime: undefined,
                endTime: undefined,
                validDays: undefined,
                errors: mockTimeRestrictionsInputErrors,
            },
        ],
        [
            {
                timeRestriction: 'Yes',
                startTime: '',
                endTime: '',
            },
            {
                timeRestriction: 'Yes',
                validDaysSelected: undefined,
                startTime: undefined,
                endTime: undefined,
                validDays: undefined,
                errors: mockTimeRestrictionsRadioAndInputErrors,
            },
        ],
    ])(
        'should set the TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE and redirect to itself (i.e. /defineTimeRestrictions) when errors are present due to %s',
        async (mockUserInput, mockAttributeValue) => {
            const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {},
                body: mockUserInput,
                uuid: {},
                mockWriteHeadFn: writeHeadMock,
            });
            await defineTimeRestrictions(req, res);
            expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
                req,
                TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE,
                mockAttributeValue,
            );
            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/defineTimeRestrictions',
            });
        },
    );
});
