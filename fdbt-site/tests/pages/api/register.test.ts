import { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as auth from '../../../src/data/cognito';
import register from '../../../src/pages/api/register';
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
                password: 'abcdefghi',
                confirmPassword: 'abcdefghi',
                nocCode: 'DCCL',
                regKey: 'abcdefg',
                checkboxUserResearch: 'checkboxUserResearch',
            },
            {
                inputChecks: [
                    {
                        inputValue: '',
                        id: 'email',
                        error: 'Enter an email address in the correct format, like name@example.com',
                    },
                    { inputValue: '', id: 'password', error: '' },
                    { inputValue: 'DCCL', id: 'noc-code', error: '' },
                ],
            },
        ],
        [
            'password less than 8 characters',
            {
                email: 'test@test.com',
                password: 'abchi',
                confirmPassword: 'abcdefghi',
                nocCode: 'DCCL',
                regKey: 'abcdefg',
                checkboxUserResearch: 'checkboxUserResearch',
            },
            {
                inputChecks: [
                    {
                        inputValue: 'test@test.com',
                        id: 'email',
                        error: '',
                    },
                    { inputValue: '', id: 'password', error: 'Password cannot be empty or less than 8 characters' },
                    { inputValue: 'DCCL', id: 'noc-code', error: '' },
                ],
            },
        ],
        [
            'password is empty',
            {
                email: 'test@test.com',
                password: '',
                confirmPassword: 'abcdefghi',
                nocCode: 'DCCL',
                regKey: 'abcdefg',
                checkboxUserResearch: '',
            },
            {
                inputChecks: [
                    {
                        inputValue: 'test@test.com',
                        id: 'email',
                        error: '',
                    },
                    { inputValue: '', id: 'password', error: 'Password cannot be empty or less than 8 characters' },
                    { inputValue: 'DCCL', id: 'noc-code', error: '' },
                ],
            },
        ],
        [
            'passwords fields do not match',
            {
                email: 'test@test.com',
                password: 'abcdefghidddd',
                confirmPassword: 'abcdefghi',
                nocCode: 'DCCL',
                regKey: 'abcdefg',
                checkboxUserResearch: '',
            },
            {
                inputChecks: [
                    {
                        inputValue: 'test@test.com',
                        id: 'email',
                        error: '',
                    },
                    { inputValue: '', id: 'password', error: 'Passwords do not match' },
                    { inputValue: 'DCCL', id: 'noc-code', error: '' },
                ],
            },
        ],
        [
            'empty NOC field',
            {
                email: 'test@test.com',
                password: 'abcdefghidddd',
                confirmPassword: 'abcdefghidddd',
                nocCode: '',
                regKey: 'abcdefg',
                checkboxUserResearch: 'checkboxUserResearch',
            },
            {
                inputChecks: [
                    {
                        inputValue: 'test@test.com',
                        id: 'email',
                        error: '',
                    },
                    { inputValue: '', id: 'password', error: '' },
                    { inputValue: '', id: 'noc-code', error: 'National Operator Code cannot be empty' },
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

    it('should error when the service noc code is invalid', async () => {
        getServicesByNocCodeSpy.mockImplementation(() => Promise.resolve([]));

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                email: 'test@test.com',
                password: 'abcdefghi',
                confirmPassword: 'abcdefghi',
                nocCode: 'abcd',
                regKey: 'abcdefg',
            },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        const mockUserCookieValue = {
            inputChecks: [
                {
                    inputValue: 'test@test.com',
                    id: 'email',
                    error: '',
                },
                { inputValue: '', id: 'password', error: '' },
                { inputValue: 'abcd', id: 'noc-code', error: '' },
                {
                    inputValue: '',
                    id: 'email',
                    error: 'There was a problem creating your account',
                },
            ],
        };

        await register(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(USER_COOKIE, JSON.stringify(mockUserCookieValue), req, res);
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
                password: 'abcdefghi',
                confirmPassword: 'abcdefghi',
                nocCode: 'DCCL',
                regKey: 'abcdefg',
            },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        await register(req, res);

        expect(authSignInSpy).toHaveBeenCalledWith('test@test.com', 'abcdefg');
        expect(authCompletePasswordSpy).toHaveBeenCalledWith(
            'd3eddd2a-a1c6-4201-82d3-bdab8dcbb586',
            'abcdefghi',
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
                    inputValue: 'test@test.com',
                    id: 'email',
                    error: '',
                },
                { inputValue: '', id: 'password', error: '' },
                { inputValue: 'DCCL', id: 'noc-code', error: '' },
                {
                    inputValue: '',
                    id: 'email',
                    error: 'There was a problem creating your account',
                },
            ],
        };

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                email: 'test@test.com',
                password: 'abcdefghi',
                confirmPassword: 'abcdefghi',
                nocCode: 'DCCL',
                regKey: 'abcdefg',
            },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        await register(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(USER_COOKIE, JSON.stringify(mockUserCookieValue), req, res);
    });

    it('should error when the NOC does not match what is in Cognito', async () => {
        authSignInSpy.mockImplementation(() =>
            Promise.resolve({
                ChallengeName: 'NEW_PASSWORD_REQUIRED',
                ChallengeParameters: {
                    USER_ID_FOR_SRP: 'd3eddd2a-a1c6-4201-82d3-bdab8dcbb586',
                    userAttributes: JSON.stringify({
                        'custom:noc': 'FAKE',
                    }),
                },
                Session: 'session',
            }),
        );

        const mockUserCookieValue = {
            inputChecks: [
                {
                    inputValue: 'test@test.com',
                    id: 'email',
                    error: '',
                },
                { inputValue: '', id: 'password', error: '' },
                { inputValue: 'DCCL', id: 'noc-code', error: '' },
                {
                    inputValue: '',
                    id: 'email',
                    error: 'There was a problem creating your account',
                },
            ],
        };

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                email: 'test@test.com',
                password: 'abcdefghi',
                confirmPassword: 'abcdefghi',
                nocCode: 'DCCL',
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
                password: 'abcdefghi',
                confirmPassword: 'abcdefghi',
                nocCode: 'DCCL',
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
            'abcdefghi',
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
                password: 'abcdefghi',
                confirmPassword: 'abcdefghi',
                nocCode: 'DCCL',
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
            'abcdefghi',
            'session',
        );
        expect(authSignOutSpy).toHaveBeenCalled();
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/confirmRegistration',
        });
    });
});

describe('register pipe split logic', () => {
    const mockAuthResponse: CognitoIdentityServiceProvider.AdminInitiateAuthResponse = {
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ChallengeParameters: {
            USER_ID_FOR_SRP: 'd3eddd2a-a1c6-4201-82d3-bdab8dcbb586',
            userAttributes: JSON.stringify({
                'custom:noc': 'DCCL|TEST|1234',
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

    it('should split NOCs into seperate ones if seperated by a pipe, and check if the users matches any', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                email: 'test@test.com',
                password: 'abcdefghi',
                confirmPassword: 'abcdefghi',
                nocCode: 'DCCL',
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
            'abcdefghi',
            'session',
        );
        expect(authSignOutSpy).toHaveBeenCalled();
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/confirmRegistration',
        });
    });

    it('should error if no NOCs match', async () => {
        authSignInSpy.mockImplementation(() =>
            Promise.resolve({
                ChallengeName: 'NEW_PASSWORD_REQUIRED',
                ChallengeParameters: {
                    USER_ID_FOR_SRP: 'd3eddd2a-a1c6-4201-82d3-bdab8dcbb586',
                    userAttributes: JSON.stringify({
                        'custom:noc': 'FAKE',
                    }),
                },
                Session: 'session',
            }),
        );

        const mockUserCookieValue = {
            inputChecks: [
                {
                    inputValue: 'test@test.com',
                    id: 'email',
                    error: '',
                },
                { inputValue: '', id: 'password', error: '' },
                { inputValue: 'DCCL', id: 'noc-code', error: '' },
                {
                    inputValue: '',
                    id: 'email',
                    error: 'There was a problem creating your account',
                },
            ],
        };

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                email: 'test@test.com',
                password: 'abcdefghi',
                confirmPassword: 'abcdefghi',
                nocCode: 'DCCL',
                regKey: 'abcdefg',
            },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        await register(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(USER_COOKIE, JSON.stringify(mockUserCookieValue), req, res);
    });
});
