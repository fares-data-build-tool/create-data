import { CognitoIdentityServiceProvider } from 'aws-sdk';
import register from '../../../src/pages/api/register';
import * as auth from '../../../src/data/cognito';
import * as auroradb from '../../../src/data/auroradb';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as apiUtils from '../../../src/pages/api/apiUtils';
import { USER_COOKIE } from '../../../src/constants';

jest.mock('../../../src/data/auroradb.ts');

describe('register', () => {
    const mockAuthResponse: CognitoIdentityServiceProvider.AdminInitiateAuthResponse = {
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ChallengeParameters: {
            USER_ID_FOR_SRP: 'd3eddd2a-a1c6-4201-82d3-bdab8dcbb586',
            userAttributes: JSON.stringify({
                'custom:noc': 'DCCL',
            }),
        },
        Session: 'session',
    };

    const getServicesByNocCodeSpy = jest.spyOn(auroradb, 'getServicesByNocCode');
    const authSignInSpy = jest.spyOn(auth, 'initiateAuth');
    const authCompletePasswordSpy = jest.spyOn(auth, 'respondToNewPasswordChallenge');
    const authUpdateAttributesSpy = jest.spyOn(auth, 'updateUserAttributes');
    const authSignOutSpy = jest.spyOn(auth, 'globalSignOut');
    const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');

    beforeEach(() => {
        authSignInSpy.mockImplementation(() => Promise.resolve(mockAuthResponse));
        authCompletePasswordSpy.mockImplementation(() => Promise.resolve());
        authSignOutSpy.mockImplementation(() => Promise.resolve());
        authUpdateAttributesSpy.mockImplementation(() => Promise.resolve());
        getServicesByNocCodeSpy.mockImplementation(() =>
            Promise.resolve([
                {
                    lineName: '2AC',
                    startDate: '01012020',
                    description: 'linename for service ',
                    serviceCode: 'NW_05_BLAC_2C_1',
                },
            ]),
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const writeHeadMock = jest.fn();

    const cases = [
        [
            'empty email',
            {
                email: '',
                password: 'chromosoneTelepathyDinosaur',
                confirmPassword: 'chromosoneTelepathyDinosaur',
                regKey: 'abcdefg',
                checkboxUserResearch: 'checkboxUserResearch',
            },
            {
                inputChecks: [
                    {
                        userInput: '',
                        id: 'email',
                        errorMessage: 'Enter an email address in the correct format, like name@example.com',
                    },
                ],
            },
        ],
        [
            'password less than 8 characters',
            {
                email: 'test@test.com',
                password: 'abchi',
                confirmPassword: 'abchi',
                regKey: 'abcdefg',
                checkboxUserResearch: 'checkboxUserResearch',
            },
            {
                inputChecks: [
                    {
                        userInput: 'test@test.com',
                        id: 'email',
                        errorMessage: '',
                    },
                    {
                        userInput: '',
                        id: 'password',
                        errorMessage: 'Password must be at least 8 characters long',
                    },
                ],
            },
        ],
        [
            'password is empty',
            {
                email: 'test@test.com',
                password: '',
                confirmPassword: 'chromosoneTelepathyDinosaur',
                regKey: 'abcdefg',
                checkboxUserResearch: '',
            },
            {
                inputChecks: [
                    {
                        userInput: 'test@test.com',
                        id: 'email',
                        errorMessage: '',
                    },
                    {
                        userInput: '',
                        id: 'password',
                        errorMessage: 'Enter a password',
                    },
                ],
            },
        ],
        [
            'passwords fields do not match',
            {
                email: 'test@test.com',
                password: 'chromosoneTelepathyDinosaur',
                confirmPassword: 'chromosoneTelepathyDinosa',
                regKey: 'abcdefg',
                checkboxUserResearch: '',
            },
            {
                inputChecks: [
                    {
                        userInput: 'test@test.com',
                        id: 'email',
                        errorMessage: '',
                    },
                    { userInput: '', id: 'password', errorMessage: 'Passwords do not match' },
                ],
            },
        ],
    ];

    test.each(cases)('given %p, sets the correct error cookie', async (_, testData, expectedCookieValue) => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: testData,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        await register(req, res);
        expect(setCookieSpy).toHaveBeenCalledWith(USER_COOKIE, JSON.stringify(expectedCookieValue), req, res);
    });

    it('should redirect when successfully signed in', async () => {
        authSignInSpy.mockImplementation(() => Promise.resolve(mockAuthResponse));
        authCompletePasswordSpy.mockImplementation(() => Promise.resolve());
        authSignOutSpy.mockImplementation(() => Promise.resolve());
        authUpdateAttributesSpy.mockImplementation(() => Promise.resolve());

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                email: 'test@test.com',
                password: 'chromosoneTelepathyDinosaur',
                confirmPassword: 'chromosoneTelepathyDinosaur',
                regKey: 'abcdefg',
            },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        await register(req, res);

        expect(authSignInSpy).toHaveBeenCalledWith('test@test.com', 'abcdefg');
        expect(authCompletePasswordSpy).toHaveBeenCalledWith(
            'd3eddd2a-a1c6-4201-82d3-bdab8dcbb586',
            'chromosoneTelepathyDinosaur',
            'session',
        );
        expect(authSignOutSpy).toHaveBeenCalled();
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/confirmRegistration',
        });
    });

    it('should error when the sign in fails', async () => {
        authSignInSpy.mockImplementation(() => {
            throw new Error('Auth failed');
        });

        const mockUserCookieValue = {
            inputChecks: [
                {
                    userInput: 'test@test.com',
                    id: 'email',
                    errorMessage: '',
                },
                {
                    userInput: '',
                    id: 'email',
                    errorMessage: 'There was a problem creating your account',
                },
            ],
        };

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                email: 'test@test.com',
                password: 'chromosoneTelepathyDinosaur',
                confirmPassword: 'chromosoneTelepathyDinosaur',
                regKey: 'abcdefg',
            },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        await register(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(USER_COOKIE, JSON.stringify(mockUserCookieValue), req, res);
    });

    it('should update user attributes as contactable=yes if yes', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                email: 'test@test.com',
                password: 'chromosoneTelepathyDinosaur',
                confirmPassword: 'chromosoneTelepathyDinosaur',
                regKey: 'abcdefg',
                contactable: 'yes',
            },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        await register(req, res);

        expect(authUpdateAttributesSpy).toHaveBeenCalledWith('test@test.com', [
            { Name: 'custom:contactable', Value: 'yes' },
        ]);
        expect(authSignInSpy).toHaveBeenCalledWith('test@test.com', 'abcdefg');
        expect(authCompletePasswordSpy).toHaveBeenCalledWith(
            'd3eddd2a-a1c6-4201-82d3-bdab8dcbb586',
            'chromosoneTelepathyDinosaur',
            'session',
        );
        expect(authSignOutSpy).toHaveBeenCalled();
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/confirmRegistration',
        });
    });

    it('should update user attributes as contactable=no if empty', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                email: 'test@test.com',
                password: 'chromosoneTelepathyDinosaur',
                confirmPassword: 'chromosoneTelepathyDinosaur',
                regKey: 'abcdefg',
                contactable: '',
            },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        await register(req, res);

        expect(authUpdateAttributesSpy).toHaveBeenCalledWith('test@test.com', [
            { Name: 'custom:contactable', Value: 'no' },
        ]);
        expect(authSignInSpy).toHaveBeenCalledWith('test@test.com', 'abcdefg');
        expect(authCompletePasswordSpy).toHaveBeenCalledWith(
            'd3eddd2a-a1c6-4201-82d3-bdab8dcbb586',
            'chromosoneTelepathyDinosaur',
            'session',
        );
        expect(authSignOutSpy).toHaveBeenCalled();
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/confirmRegistration',
        });
    });
});
