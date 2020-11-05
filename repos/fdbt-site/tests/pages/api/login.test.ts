import { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as auth from '../../../src/data/cognito';
import login from '../../../src/pages/api/login';
import * as auroradb from '../../../src/data/auroradb';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as apiUtils from '../../../src/pages/api/apiUtils';
import { OPERATOR_COOKIE } from '../../../src/constants';

const mockBaseOpAuthResponse: CognitoIdentityServiceProvider.AdminInitiateAuthResponse = {
    AuthenticationResult: {
        IdToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b206bm9jIjoiVEVTVCJ9.yblgxuiLnAHzUUf9d8rH975xO8N62aqR8gUszkw6cHc',
        RefreshToken: 'eyJj',
    },
};

const mockSchemeOpAuthResponse: CognitoIdentityServiceProvider.AdminInitiateAuthResponse = {
    AuthenticationResult: {
        IdToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b206c2NoZW1lT3BlcmF0b3IiOiJTQ0hFTUVfT1BFUkFUT1IiLCJjdXN0b206c2NoZW1lUmVnaW9uQ29kZSI6IlNDSEVNRV9SRUdJT04ifQ.iZ-AJUm34FkHvXQ-zNoaqwAIT_LB708r1zj3xYvT3as',
        RefreshToken: 'eyJj',
    },
};

jest.mock('../../../src/data/auroradb.ts');

describe('login', () => {
    const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');
    const getOperatorNameByNocCodeSpy = jest.spyOn(auroradb, 'getOperatorNameByNocCode');
    const authSignInSpy = jest.spyOn(auth, 'initiateAuth');

    beforeEach(() => {
        getOperatorNameByNocCodeSpy.mockImplementation(() => Promise.resolve({ operatorPublicName: 'DCCL' }));
        authSignInSpy.mockImplementation(() => Promise.resolve(mockBaseOpAuthResponse));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const writeHeadMock = jest.fn();

    const cases = [
        [
            'incorrectly formatted email address',
            { email: 'testtfncom', password: 'abcdefghi' },
            {
                errors: [
                    {
                        id: 'email',
                        errorMessage: 'Enter an email address in the correct format, like name@example.com',
                    },
                ],
                email: 'testtfncom',
            },
        ],
        [
            'password is empty',
            { email: 'test@test.com', password: '' },
            {
                errors: [
                    {
                        id: 'password',
                        errorMessage: 'Enter a password',
                    },
                ],
                email: 'test@test.com',
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

        await login(req, res);
        expect(setCookieSpy).toHaveBeenCalledWith(OPERATOR_COOKIE, JSON.stringify(expectedCookieValue), req, res);
    });

    it('should redirect when successfully signed in as an ordinary operator', async () => {
        authSignInSpy.mockImplementation(() => Promise.resolve(mockBaseOpAuthResponse));
        const mockOperatorCookie = {
            operator: { operatorPublicName: 'DCCL' },
            noc: 'TEST',
        };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                email: 'test@test.com',
                password: 'abcdefghi',
            },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        await login(req, res);

        expect(authSignInSpy).toHaveBeenCalledWith('test@test.com', 'abcdefghi');
        expect(setCookieSpy).toHaveBeenCalledWith(OPERATOR_COOKIE, JSON.stringify(mockOperatorCookie), req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/home',
        });
    });

    it('should redirect when successfully signed in as a scheme operator', async () => {
        authSignInSpy.mockImplementation(() => Promise.resolve(mockSchemeOpAuthResponse));
        const mockOperatorCookie = {
            operator: 'SCHEME_OPERATOR',
            region: 'SCHEME_REGION',
        };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                email: 'test@test.com',
                password: 'abcdefghi',
            },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        await login(req, res);

        expect(authSignInSpy).toHaveBeenCalledWith('test@test.com', 'abcdefghi');
        expect(setCookieSpy).toHaveBeenCalledWith(OPERATOR_COOKIE, JSON.stringify(mockOperatorCookie), req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/home',
        });
    });

    it('should error when the sign in fails', async () => {
        authSignInSpy.mockImplementation(() => {
            throw new Error();
        });

        const mockUserCookieValue = {
            errors: [
                {
                    id: 'login',
                    errorMessage: 'The email address and/or password are not correct.',
                },
            ],
        };

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                email: 'test@test.com',
                password: 'abcdefghi',
            },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        await login(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(OPERATOR_COOKIE, JSON.stringify(mockUserCookieValue), req, res);
    });
});
