import { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as auth from '../../../src/data/cognito';
import login from '../../../src/pages/api/login';
import * as auroradb from '../../../src/data/auroradb';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as apiUtils from '../../../src/pages/api/apiUtils';
import { OPERATOR_COOKIE } from '../../../src/constants';

const mockAuthResponse: CognitoIdentityServiceProvider.AdminInitiateAuthResponse = {
    AuthenticationResult: {
        IdToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b206bm9jIjoiVEVTVCJ9.yblgxuiLnAHzUUf9d8rH975xO8N62aqR8gUszkw6cHc',
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
        authSignInSpy.mockImplementation(() => Promise.resolve(mockAuthResponse));
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
            },
        ],
    ];

    test.each(cases)('given %p, sets the correct error cookie', async (_, testData, expectedCookieValue) => {
        const { req, res } = getMockRequestAndResponse({}, testData, {}, writeHeadMock);

        await login(req, res);
        expect(setCookieSpy).toHaveBeenCalledWith(OPERATOR_COOKIE, JSON.stringify(expectedCookieValue), req, res);
    });

    it('should redirect when successfully signed in', async () => {
        const { req, res } = getMockRequestAndResponse(
            {},
            {
                email: 'test@test.com',
                password: 'abcdefghi',
            },
            '',
            writeHeadMock,
        );

        await login(req, res);

        expect(authSignInSpy).toHaveBeenCalledWith('test@test.com', 'abcdefghi');
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/fareType',
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

        const { req, res } = getMockRequestAndResponse(
            {},
            {
                email: 'test@test.com',
                password: 'abcdefghi',
            },
            '',
            writeHeadMock,
        );

        await login(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(OPERATOR_COOKIE, JSON.stringify(mockUserCookieValue), req, res);
    });
});
