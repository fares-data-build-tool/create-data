import definePassengerType, {
    passengerTypeDetailsSchema,
    formatRequestBody,
    getErrorIdFromValidityError,
} from '../../../src/pages/api/definePassengerType';
import * as apiUtils from '../../../src/pages/api/apiUtils';
import { getMockRequestAndResponse } from '../../testData/mockData';
import {
    GROUP_PASSENGER_INFO_ATTRIBUTE,
    GROUP_PASSENGER_TYPES_ATTRIBUTE,
    GROUP_SIZE_ATTRIBUTE,
    PASSENGER_TYPE_COOKIE,
    PASSENGER_TYPE_ERRORS_COOKIE,
} from '../../../src/constants';
import { GroupPassengerTypesCollection } from '../../../src/pages/api/groupPassengerTypes';
import * as sessions from '../../../src/utils/sessions';
import { CompanionInfo } from '../../../src/interfaces';
import { GroupTicketAttribute } from '../../../src/pages/api/groupSize';

describe('definePassengerType', () => {
    const writeHeadMock = jest.fn();
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');
    const deleteCookieSpy = jest.spyOn(apiUtils, 'deleteCookieOnResponseObject');

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('passengerTypeDetailsSchema', () => {
        it.each([
            [{}, false],
            [{ ageRange: 'No' }, false],
            [{ ageRange: 'Yes' }, false],
            [{ proof: 'maybe' }, false],
            [{ proof: 'No' }, false],
            [{ proof: 'Yes' }, false],
            [{ ageRange: 'Yes', proof: 'No' }, false],
            [{ ageRange: 'No', proof: 'Yes' }, false],
            [{ ageRange: 'No', proof: 'No' }, true],
            [{ ageRange: 'Yes', proof: 'No' }, false],
            [{ ageRange: 'Yes', ageRangeMin: '10', proof: 'No' }, true],
            [{ ageRange: 'Yes', ageRangeMax: '67', proof: 'No' }, true],
            [{ ageRange: 'Yes', ageRangeMin: '11', ageRangeMax: 'daddy', proof: 'No' }, false],
            [{ ageRange: 'Yes', ageRangeMin: 'asda', ageRangeMax: 'tesco', proof: 'No' }, false],
            [{ ageRange: 'Yes', ageRangeMin: '-12', ageRangeMax: '12', proof: 'No' }, false],
            [{ ageRange: 'Yes', ageRangeMin: '1.23453', ageRangeMax: '12', proof: 'No' }, false],
            [{ ageRange: 'Yes', ageRangeMin: '50', ageRangeMax: '25', proof: 'No' }, false],
            [{ ageRange: 'Yes', ageRangeMin: '12', ageRangeMax: '140', proof: 'No' }, true],
            [{ ageRange: 'No', proof: 'Yes', proofDocuments: ['Membership Card', 'Student Card'] }, true],
            [
                {
                    ageRange: 'Yes',
                    ageRangeMin: '0',
                    ageRangeMax: '150',
                    proof: 'Yes',
                    proofDocuments: ['Membership Card', 'Student Card', 'Identity Document'],
                },
                true,
            ],
            [{ maxNumber: '', maxGroupSize: '12', groupPassengerType: 'adult', ageRange: 'No', proof: 'No' }, false],
            [{ maxNumber: '24', maxGroupSize: '12', groupPassengerType: 'adult', ageRange: 'No', proof: 'No' }, false],
            [
                {
                    minNumber: 'uno',
                    maxNumber: 'dos',
                    maxGroupSize: '12',
                    groupPassengerType: 'adult',
                    ageRange: 'No',
                    proof: 'No',
                },
                false,
            ],
            [
                {
                    minNumber: '15',
                    maxNumber: '10',
                    maxGroupSize: '12',
                    groupPassengerType: 'adult',
                    ageRange: 'No',
                    proof: 'No',
                },
                false,
            ],
            [
                {
                    minNumber: '15',
                    maxNumber: '13',
                    maxGroupSize: '12',
                    groupPassengerType: 'adult',
                    ageRange: 'No',
                    proof: 'No',
                },
                false,
            ],
            [
                {
                    minNumber: '-12',
                    maxNumber: '3.45',
                    maxGroupSize: '12',
                    groupPassengerType: 'adult',
                    ageRange: 'No',
                    proof: 'No',
                },
                false,
            ],
            [{ maxNumber: '10', maxGroupSize: '12', groupPassengerType: 'adult', ageRange: 'No', proof: 'No' }, true],
            [
                {
                    minNumber: '2',
                    maxNumber: '5',
                    maxGroupSize: '12',
                    groupPassengerType: 'adult',
                    ageRange: 'No',
                    proof: 'No',
                },
                true,
            ],
        ])('should validate that %s is %s', (candidate, validity) => {
            const result = passengerTypeDetailsSchema.isValidSync(candidate);
            expect(result).toEqual(validity);
        });
    });

    describe('formatRequestBody', () => {
        it('should remove whitespace from the request body text inputs of ageRangeMin, ageRangeMax, minNumber and maxNumber', () => {
            const reqBodyParams = { ageRange: 'Yes', proof: 'No' };
            const { req } = getMockRequestAndResponse({
                cookieValues: {},
                body: {
                    ageRangeMin: '   2   4',
                    ageRangeMax: '   10   0       ',
                    minNumber: '   2   ',
                    maxNumber: '   1  0 ',
                    ...reqBodyParams,
                },
            });
            const filtered = formatRequestBody(req);
            expect(filtered).toEqual({
                ageRangeMin: '24',
                ageRangeMax: '100',
                minNumber: '2',
                maxNumber: '10',
                ...reqBodyParams,
            });
        });

        it('should force proof documents to always be an array, even if there is only one selected', () => {
            const reqBodyParams = { ageRange: 'No', proof: 'Yes' };
            const { req } = getMockRequestAndResponse({
                cookieValues: {},
                body: { proofDocuments: 'membershipCard', ...reqBodyParams },
            });
            const filtered = formatRequestBody(req);
            expect(filtered).toEqual({ proofDocuments: ['membershipCard'], ...reqBodyParams });
        });
    });

    describe('getErrorIdFromValidityError', () => {
        it.each([
            ['define-passenger-age-range', 'ageRange'],
            ['define-passenger-proof', 'proof'],
            ['age-range-min', 'ageRangeMin'],
            ['age-range-max', 'ageRangeMax'],
            ['proof-required', 'proofDocuments'],
            ['min-number-of-passengers', 'minNumber'],
            ['max-number-of-passengers', 'maxNumber'],
        ])('should return the id as %s when the error path is %s', (expectedId, errorPath) => {
            const actualId = getErrorIdFromValidityError(errorPath);
            expect(actualId).toEqual(expectedId);
        });

        it('should throw an error when the error path does not match a valid input field', () => {
            expect(() => getErrorIdFromValidityError('notValid')).toThrow();
        });
    });

    it('should throw an error and redirect to the error page when the session is invalid', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { operator: null },
            body: {},
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await definePassengerType(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should set the PASSENGER_TYPE_COOKIE, delete the PASSENGER_TYPE_ERRORS_COOKIE and redirect to /timeRestrictions when no errors are found', async () => {
        const mockPassengerTypeDetails = {
            passengerType: 'Adult',
            ageRange: 'Yes',
            ageRangeMin: '5',
            ageRangeMax: '10',
            proof: 'Yes',
            proofDocuments: ['Membership Card', 'Student Card'],
        };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'single' },
            body: mockPassengerTypeDetails,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await definePassengerType(req, res);
        expect(setCookieSpy).toBeCalledWith(PASSENGER_TYPE_COOKIE, JSON.stringify(mockPassengerTypeDetails), req, res);
        expect(deleteCookieSpy).toBeCalledWith(PASSENGER_TYPE_ERRORS_COOKIE, req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/timeRestrictions',
        });
    });

    it.each([
        [
            {
                ageRange: 'Yes',
                ageRangeMin: '',
                ageRangeMax: '',
                proof: 'Yes',
                proofDocuments: [],
                passengerType: 'Adult',
            },
            [
                {
                    id: 'age-range-max',
                    errorMessage: 'Enter a minimum or maximum age',
                },
                {
                    id: 'age-range-min',
                    errorMessage: 'Enter a minimum or maximum age',
                },
                {
                    id: 'proof-required',
                    errorMessage: 'Select at least one proof document',
                    userInput: '',
                },
            ],
        ],
        [
            {
                ageRange: 'Yes',
                ageRangeMin: '25',
                ageRangeMax: '12',
                proof: 'No',
                passengerType: 'Adult',
            },
            [
                {
                    id: 'age-range-max',
                    errorMessage: 'Maximum age cannot be less than minimum age',
                    userInput: 12,
                },
                {
                    id: 'age-range-min',
                    errorMessage: 'Minimum age cannot be greater than maximum age',
                    userInput: 25,
                },
            ],
        ],
    ])(
        'should set the PASSENGER_TYPE_ERRORS_COOKIE and redirect to itself (i.e. /definePassengerType) when errors are present due to %s',
        async (mockUserInput, errors) => {
            const mockPassengerTypeCookieValue = {
                errors,
                passengerType: 'Adult',
            };
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {},
                body: mockUserInput,
                uuid: {},
                mockWriteHeadFn: writeHeadMock,
            });
            await definePassengerType(req, res);
            expect(setCookieSpy).toBeCalledWith(
                PASSENGER_TYPE_ERRORS_COOKIE,
                JSON.stringify(mockPassengerTypeCookieValue),
                req,
                res,
            );
            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/definePassengerType',
            });
        },
    );

    it('should set GROUP_PASSENGER_INFO_ATTRIBUTE with the first passenger type in the group, delete the PASSENGER_TYPE_ERRORS_COOKIE and redirect to the same page', async () => {
        const mockPassengerTypeDetails = {
            passengerType: 'adult',
            ageRange: 'Yes',
            ageRangeMin: '5',
            ageRangeMax: '10',
            minNumber: '2',
            maxNumber: '10',
            proof: 'Yes',
            proofDocuments: ['Membership Card', 'Student Card'],
        };

        const groupPassengerTypesAttribute: GroupPassengerTypesCollection = { passengerTypes: ['adult', 'child'] };
        const groupSizeAttribute: GroupTicketAttribute = { maxGroupSize: '20' };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'single' },
            body: mockPassengerTypeDetails,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {
                [GROUP_PASSENGER_TYPES_ATTRIBUTE]: groupPassengerTypesAttribute,
                [GROUP_SIZE_ATTRIBUTE]: groupSizeAttribute,
            },
        });

        const mockPassengerCompanions: CompanionInfo[] = [
            {
                minNumber: '2',
                maxNumber: '10',
                ageRangeMin: '5',
                ageRangeMax: '10',
                proofDocuments: ['Membership Card', 'Student Card'],
                passengerType: 'adult',
            },
        ];

        await definePassengerType(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, GROUP_PASSENGER_INFO_ATTRIBUTE, mockPassengerCompanions);
        expect(deleteCookieSpy).toBeCalledWith(PASSENGER_TYPE_ERRORS_COOKIE, req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/definePassengerType?groupPassengerType=child',
        });
    });

    it('should set GROUP_PASSENGER_INFO_ATTRIBUTE with the second passenger type in the group, delete the PASSENGER_TYPE_ERRORS_COOKIE and redirect to /timeRestrictions', async () => {
        const groupPassengerTypesAttribute: GroupPassengerTypesCollection = { passengerTypes: ['child'] };
        const groupSizeAttribute: GroupTicketAttribute = { maxGroupSize: '20' };
        const mockPreviousPassengerTypeDetails: CompanionInfo[] = [
            {
                minNumber: '2',
                maxNumber: '10',
                ageRangeMin: '5',
                ageRangeMax: '10',
                proofDocuments: ['Membership Card', 'Student Card'],
                passengerType: 'adult',
            },
        ];

        const mockCurrentPassengerTypeDetails = {
            passengerType: 'child',
            ageRange: 'Yes',
            ageRangeMin: '5',
            ageRangeMax: '10',
            minNumber: '2',
            maxNumber: '10',
            proof: 'Yes',
            proofDocuments: 'Membership Card',
        };

        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'single' },
            body: mockCurrentPassengerTypeDetails,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {
                [GROUP_PASSENGER_TYPES_ATTRIBUTE]: groupPassengerTypesAttribute,
                [GROUP_SIZE_ATTRIBUTE]: groupSizeAttribute,
                [GROUP_PASSENGER_INFO_ATTRIBUTE]: mockPreviousPassengerTypeDetails,
            },
        });

        const mockPassengerCompanions: CompanionInfo[] = [
            {
                minNumber: '2',
                maxNumber: '10',
                ageRangeMin: '5',
                ageRangeMax: '10',
                proofDocuments: ['Membership Card', 'Student Card'],
                passengerType: 'adult',
            },
            {
                minNumber: '2',
                maxNumber: '10',
                ageRangeMin: '5',
                ageRangeMax: '10',
                proofDocuments: ['Membership Card'],
                passengerType: 'child',
            },
        ];

        await definePassengerType(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, GROUP_PASSENGER_INFO_ATTRIBUTE, mockPassengerCompanions);
        expect(deleteCookieSpy).toBeCalledWith(PASSENGER_TYPE_ERRORS_COOKIE, req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/timeRestrictions',
        });
    });
});
