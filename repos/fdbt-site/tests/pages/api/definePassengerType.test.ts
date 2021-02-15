import definePassengerType, {
    passengerTypeDetailsSchema,
    formatRequestBody,
    getErrorIdFromValidityError,
} from '../../../src/pages/api/definePassengerType';
import { getMockRequestAndResponse } from '../../testData/mockData';
import {
    GROUP_PASSENGER_INFO_ATTRIBUTE,
    GROUP_PASSENGER_TYPES_ATTRIBUTE,
    GROUP_SIZE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
} from '../../../src/constants/attributes';
import * as sessions from '../../../src/utils/sessions';
import { CompanionInfo, GroupPassengerTypesCollection, GroupTicketAttribute } from '../../../src/interfaces';

describe('definePassengerType', () => {
    const writeHeadMock = jest.fn();
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

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
            ['age-range-required', 'ageRange'],
            ['proof-required', 'proof'],
            ['age-range-min', 'ageRangeMin'],
            ['age-range-max', 'ageRangeMax'],
            ['membership-card', 'proofDocuments'],
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

    it('should set the relevant attributes and redirect to /defineTimeRestrictions when no errors are found', async () => {
        const mockPassengerTypeDetails = {
            passengerType: 'adult',
            ageRange: 'Yes',
            ageRangeMin: '5',
            ageRangeMax: '10',
            proof: 'Yes',
            proofDocuments: ['Membership Card', 'Student Card'],
        };
        const { req, res } = getMockRequestAndResponse({
            body: mockPassengerTypeDetails,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await definePassengerType(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, PASSENGER_TYPE_ATTRIBUTE, mockPassengerTypeDetails);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, undefined);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/defineTimeRestrictions',
        });
    });

    it('should set the relevant attributes and redirect to /termTime when no errors are found and the user is entering a school ticket', async () => {
        const mockPassengerTypeDetails = {
            passengerType: 'schoolPupil',
            ageRange: 'No',
            proof: 'Yes',
            proofDocuments: ['Student Card'],
        };
        const { req, res } = getMockRequestAndResponse({
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'schoolService' },
            },
            body: mockPassengerTypeDetails,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await definePassengerType(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, PASSENGER_TYPE_ATTRIBUTE, mockPassengerTypeDetails);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, undefined);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/termTime',
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
                passengerType: 'adult',
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
                    id: 'membership-card',
                    errorMessage: 'Select at least one proof document',
                },
            ],
            {
                maxNumber: '',
                proofDocuments: [],
            },
        ],
        [
            {
                ageRange: 'Yes',
                ageRangeMin: '25',
                ageRangeMax: '12',
                proof: 'No',
                passengerType: 'adult',
            },
            [
                {
                    id: 'age-range-max',
                    errorMessage: 'Maximum age cannot be less than minimum age',
                },
                {
                    id: 'age-range-min',
                    errorMessage: 'Minimum age cannot be greater than maximum age',
                },
            ],
            {
                ageRangeMin: '25',
                ageRangeMax: '12',
                maxNumber: '',
            },
        ],
    ])(
        'should set the DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE and redirect to itself (i.e. /definePassengerType) when errors are present due to %s',
        async (mockUserInput, errors, mockAttributeValue) => {
            const mockPassengerTypeAttributeValue = {
                errors,
                passengerType: 'adult',
                ...mockAttributeValue,
            };
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {},
                body: mockUserInput,
                uuid: {},
                mockWriteHeadFn: writeHeadMock,
            });
            await definePassengerType(req, res);
            expect(updateSessionAttributeSpy).toBeCalledWith(
                req,
                DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE,
                mockPassengerTypeAttributeValue,
            );
            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/definePassengerType',
            });
        },
    );

    it('should set GROUP_PASSENGER_INFO_ATTRIBUTE with the first passenger type in the group, and redirect to the same page', async () => {
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
            body: mockPassengerTypeDetails,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {
                [GROUP_PASSENGER_TYPES_ATTRIBUTE]: groupPassengerTypesAttribute,
                [GROUP_SIZE_ATTRIBUTE]: groupSizeAttribute,
                [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'group' },
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
        expect(updateSessionAttributeSpy).toBeCalledWith(req, DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, undefined);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/definePassengerType?groupPassengerType=child',
        });
    });

    it('should set GROUP_PASSENGER_INFO_ATTRIBUTE with the second passenger type in the group, delete the DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE and redirect to /defineTimeRestrictions', async () => {
        const groupPassengerTypesAttribute: GroupPassengerTypesCollection = { passengerTypes: ['adult', 'child'] };
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
            cookieValues: {},
            body: mockCurrentPassengerTypeDetails,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {
                [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'group' },
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
        expect(updateSessionAttributeSpy).toBeCalledWith(req, DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, undefined);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/defineTimeRestrictions',
        });
    });
});
