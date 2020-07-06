import definePassengerType, {
    passengerTypeDetailsSchema,
    formatRequestBody,
} from '../../../src/pages/api/definePassengerType';
import * as apiUtils from '../../../src/pages/api/apiUtils';
import { getMockRequestAndResponse } from '../../testData/mockData';
import { PASSENGER_TYPE_COOKIE } from '../../../src/constants';

describe('definePassengerType', () => {
    const writeHeadMock = jest.fn();

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
        ])('should validate that %s is %s', (candidate, validity) => {
            const result = passengerTypeDetailsSchema.isValidSync(candidate);
            expect(result).toEqual(validity);
        });
    });

    describe('formatRequestBody', () => {
        it('should remove whitespace from the request body text inputs of ageRangeMin and ageRangeMax', () => {
            const reqBodyParams = { ageRange: 'Yes', proof: 'No' };
            const { req } = getMockRequestAndResponse({
                cookieValues: {},
                body: { ageRangeMin: '   2   4', ageRangeMax: '   10   0       ', ...reqBodyParams },
            });
            const filtered = formatRequestBody(req);
            expect(filtered).toEqual({ ageRangeMin: '24', ageRangeMax: '100', ...reqBodyParams });
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

    it('should throw an error and redirect to the error page when the PASSENGER_TYPE_COOKIE and FARE_TYPE_COOKIE are missing', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { passengerType: null, fareType: null },
            body: {},
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await definePassengerType(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should set the PASSENGER_TYPE_COOKIE and redirect depending on fare type when no errors are found', async () => {
        const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');
        const mockPassengerTypeDetails = {
            ageRange: 'Yes',
            ageRangeMin: '5',
            ageRangeMax: '10',
            proof: 'Yes',
            proofDocuments: ['Membership Card', 'Student Card'],
        };
        const mockPassengerTypeCookieValue = { passengerType: 'Adult', ...mockPassengerTypeDetails };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'single' },
            body: mockPassengerTypeDetails,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await definePassengerType(req, res);
        expect(setCookieSpy).toHaveBeenCalledWith(
            PASSENGER_TYPE_COOKIE,
            JSON.stringify(mockPassengerTypeCookieValue),
            req,
            res,
        );
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/service',
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
            },
            [
                {
                    input: 'ageRangeMax',
                    message: 'Enter a minimum or maximum age',
                },
                {
                    input: 'ageRangeMin',
                    message: 'Enter a minimum or maximum age',
                },
                {
                    input: 'proofDocuments',
                    message: 'Select at least one proof document',
                },
            ],
        ],
        [
            {
                ageRange: 'Yes',
                ageRangeMin: '25',
                ageRangeMax: '12',
                proof: 'No',
            },
            [
                {
                    input: 'ageRangeMax',
                    message: 'Maximum age cannot be less than minimum age',
                },
                {
                    input: 'ageRangeMin',
                    message: 'Minimum age cannot be greater than maximum age',
                },
            ],
        ],
    ])(
        'should set the PASSENGER_TYPE_COOKIE and redirect to itself (i.e. /definePassengerType) when errors are present due to %s',
        async (mockUserInput, errors) => {
            const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');
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
            expect(setCookieSpy).toHaveBeenCalledWith(
                PASSENGER_TYPE_COOKIE,
                JSON.stringify(mockPassengerTypeCookieValue),
                req,
                res,
            );
            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/definePassengerType',
            });
        },
    );
});
