import Auth from '@aws-amplify/auth';
import register from '../../../src/pages/api/register';
import * as auroradb from '../../../src/data/auroradb';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as apiUtils from '../../../src/pages/api/apiUtils';
import { USER_COOKIE } from '../../../src/constants';

jest.mock('../../../src/data/auroradb.ts');

const mockUserCognito = {
    username: 'd3eddd2a-a1c6-4201-82d3-bdab8dcbb586',
    challengeName: 'NEW_PASSWORD_REQUIRED',
    challengeParam: {
        requiredAttributes: [],
    },
};

describe('register', () => {
    const getServicesByNocCodeSpy = jest.spyOn(auroradb, 'getServicesByNocCode');
    const authSignInSpy = jest.spyOn(Auth, 'signIn');
    const authCompletePasswordSpy = jest.spyOn(Auth, 'completeNewPassword');
    const authSignOutSpy = jest.spyOn(Auth, 'signOut');
    const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');

    beforeEach(() => {
        getServicesByNocCodeSpy.mockImplementation(() =>
            Promise.resolve([{ lineName: '2AC', startDate: '01012020', description: 'linename for service ' }]),
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const writeHeadMock = jest.fn();

    const cases = [
        [
            'empty email',
            { email: '', password: 'abcdefghi', confirmPassword: 'abcdefghi', nocCode: 'DCCL', regKey: 'abcdefg' },
            {
                inputChecks: [
                    {
                        inputValue: '',
                        id: 'email',
                        error: 'Enter an email address in the correct format, like name@example.com',
                    },
                    { inputValue: '', id: 'password', error: '' },
                    { inputValue: 'DCCL', id: 'nocCode', error: '' },
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
            },
            {
                inputChecks: [
                    {
                        inputValue: 'test@test.com',
                        id: 'email',
                        error: '',
                    },
                    { inputValue: '', id: 'password', error: 'Password cannot be empty or less than 8 characters' },
                    { inputValue: 'DCCL', id: 'nocCode', error: '' },
                ],
            },
        ],
        [
            'password is empty',
            { email: 'test@test.com', password: '', confirmPassword: 'abcdefghi', nocCode: 'DCCL', regKey: 'abcdefg' },
            {
                inputChecks: [
                    {
                        inputValue: 'test@test.com',
                        id: 'email',
                        error: '',
                    },
                    { inputValue: '', id: 'password', error: 'Password cannot be empty or less than 8 characters' },
                    { inputValue: 'DCCL', id: 'nocCode', error: '' },
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
            },
            {
                inputChecks: [
                    {
                        inputValue: 'test@test.com',
                        id: 'email',
                        error: '',
                    },
                    { inputValue: '', id: 'password', error: 'Passwords do not match' },
                    { inputValue: 'DCCL', id: 'nocCode', error: '' },
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
            },
            {
                inputChecks: [
                    {
                        inputValue: 'test@test.com',
                        id: 'email',
                        error: '',
                    },
                    { inputValue: '', id: 'password', error: '' },
                    { inputValue: '', id: 'nocCode', error: 'National Operator Code cannot be empty' },
                ],
            },
        ],
    ];

    test.each(cases)('given %p, sets the correct error cookie', async (_, testData, expectedCookieValue) => {
        const { req, res } = getMockRequestAndResponse({}, testData, {}, writeHeadMock);

        await register(req, res);
        expect(setCookieSpy).toHaveBeenCalledWith(
            'localhost',
            USER_COOKIE,
            JSON.stringify(expectedCookieValue),
            req,
            res,
        );
    });

    it('should error when the service noc code is invalid', async () => {
        getServicesByNocCodeSpy.mockImplementation(() => Promise.resolve([]));

        const { req, res } = getMockRequestAndResponse(
            {},
            {
                email: 'test@test.com',
                password: 'abcdefghi',
                confirmPassword: 'abcdefghi',
                nocCode: 'abcd',
                regKey: 'abcdefg',
            },
            '',
            writeHeadMock,
        );

        const mockUserCookieValue = {
            inputChecks: [
                {
                    inputValue: 'test@test.com',
                    id: 'email',
                    error: '',
                },
                { inputValue: '', id: 'password', error: '' },
                { inputValue: 'abcd', id: 'nocCode', error: '' },
                {
                    inputValue: '',
                    id: 'email',
                    error: 'There was a problem registering your account',
                },
            ],
        };

        await register(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(
            'localhost',
            USER_COOKIE,
            JSON.stringify(mockUserCookieValue),
            req,
            res,
        );
    });

    it('should redirect when successfully signed in', async () => {
        authSignInSpy.mockImplementation(() => Promise.resolve(mockUserCognito));
        authCompletePasswordSpy.mockImplementation(() => Promise.resolve(mockUserCognito));
        authSignOutSpy.mockImplementation(() => Promise.resolve());

        const { req, res } = getMockRequestAndResponse(
            {},
            {
                email: 'test@test.com',
                password: 'abcdefghi',
                confirmPassword: 'abcdefghi',
                nocCode: 'DCCL',
                regKey: 'abcdefg',
            },
            '',
            writeHeadMock,
        );

        await register(req, res);

        expect(authSignInSpy).toHaveBeenCalledWith('test@test.com', 'abcdefg');
        expect(authCompletePasswordSpy).toHaveBeenCalledWith(mockUserCognito, 'abcdefghi', { 'custom:noc': 'DCCL' });
        expect(authSignOutSpy).toHaveBeenCalled();
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/confirmRegistration',
        });
    });

    it('should error when the sign in fails', async () => {
        authSignInSpy.mockImplementation(() => Promise.resolve());

        const mockUserCookieValue = {
            inputChecks: [
                {
                    inputValue: 'test@test.com',
                    id: 'email',
                    error: '',
                },
                { inputValue: '', id: 'password', error: '' },
                { inputValue: 'DCCL', id: 'nocCode', error: '' },
                {
                    inputValue: '',
                    id: 'email',
                    error: 'There was a problem creating your account',
                },
            ],
        };

        const { req, res } = getMockRequestAndResponse(
            {},
            {
                email: 'test@test.com',
                password: 'abcdefghi',
                confirmPassword: 'abcdefghi',
                nocCode: 'DCCL',
                regKey: 'abcdefg',
            },
            '',
            writeHeadMock,
        );

        await register(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(
            'localhost',
            USER_COOKIE,
            JSON.stringify(mockUserCookieValue),
            req,
            res,
        );
    });
});
