import Auth from '@aws-amplify/auth';
import login from '../../../src/pages/api/login';
import * as auroradb from '../../../src/data/auroradb';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as apiUtils from '../../../src/pages/api/apiUtils';
import { OPERATOR_COOKIE } from '../../../src/constants';

jest.mock('../../../src/data/auroradb.ts');

const mockUserCognito = {
    signInUserSession: {
        idToken: {
            jwtToken: 'eyJra',
        },
        refreshToken: {
            token: 'eyJj',
        },
    },
    attributes: { 'custom:noc': 'DCCL' },
};

describe('login', () => {
    const getOperatorNameByNocCodeSpy = jest.spyOn(auroradb, 'getOperatorNameByNocCode');
    const authSignInSpy = jest.spyOn(Auth, 'signIn');
    const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');

    beforeEach(() => {
        getOperatorNameByNocCodeSpy.mockImplementation(() => Promise.resolve({ operatorPublicName: 'DCCL' }));
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
                        id: 'login',
                        errorMessage: 'The email address and/or password are not correct.',
                    },
                ],
            },
        ],
    ];

    test.each(cases)('given %p, sets the correct error cookie', async (_, testData, expectedCookieValue) => {
        const { req, res } = getMockRequestAndResponse({}, testData, {}, writeHeadMock);

        await login(req, res);
        expect(setCookieSpy).toHaveBeenCalledWith(
            'localhost',
            OPERATOR_COOKIE,
            JSON.stringify(expectedCookieValue),
            req,
            res,
        );
    });

    it('should redirect when successfully signed in', async () => {
        authSignInSpy.mockImplementation(() => Promise.resolve(mockUserCognito));

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
        authSignInSpy.mockImplementation(() => Promise.resolve());

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

        expect(setCookieSpy).toHaveBeenCalledWith(
            'localhost',
            OPERATOR_COOKIE,
            JSON.stringify(mockUserCookieValue),
            req,
            res,
        );
    });
});
