import { handler } from './handler';
import { Context } from 'aws-lambda';
import CognitoIdentityServiceProvider, { ListUsersResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as cognitoFunctions from './cognito';
import * as databaseFunctions from './database';
import * as emailFunctions from './email';
import { SES } from 'aws-sdk';

describe('fdbt-multi-operator-emailer handler', () => {
    const mockEvent = {};
    const mockContext = {} as Context;
    const mockCallback = vi.fn();

    vi.mock('mysql2/promise');

    const getCognitoClientMock = vi.spyOn(cognitoFunctions, 'getCognitoClient');
    const getIncompleteMultiOperatorProductsMock = vi.spyOn(databaseFunctions, 'getIncompleteMultiOperatorProducts');
    const getSesClientMock = vi.spyOn(emailFunctions, 'getSesClient');
    const sendEmailsMock = vi.spyOn(emailFunctions, 'sendEmails');

    beforeEach(() => {
        vi.resetAllMocks();

        process.env.RDS_HOST = 'mock-host';
        process.env.SERVICE_DOMAIN = 'mock-service-domain';
        process.env.USER_POOL_ID = 'mock-user-pool-id';
    });

    it.each(['RDS_HOST', 'SERVICE_DOMAIN', 'USER_POOL_ID'])(
        'throws an error when the required env var %s is missing',
        async (input) => {
            process.env[input] = '';

            await expect(handler(mockEvent, mockContext, mockCallback)).rejects.toThrow(
                'Missing env vars - RDS_HOST, SERVICE_DOMAIN and USER_POOL_ID must be set',
            );
        },
    );

    it('returns early if there are no incomplete products', async () => {
        getIncompleteMultiOperatorProductsMock.mockResolvedValueOnce([]);
        getSesClientMock.mockReturnValue(undefined as unknown as SES);
        sendEmailsMock.mockResolvedValueOnce(undefined);

        await handler(mockEvent, mockContext, mockCallback);

        expect(getIncompleteMultiOperatorProductsMock).toHaveBeenCalled();
        expect(getCognitoClientMock).not.toHaveBeenCalled();
    });

    it('returns early if there are no users opted in to email notifications', async () => {
        const mockListUsersResponse: ListUsersResponse = {
            Users: [],
        } as ListUsersResponse;

        const mockProducts: databaseFunctions.Product[] = [
            { productId: 'Product 1', nocCode: 'NOC1' },
            { productId: 'Product 3', nocCode: 'NOC3' },
            { productId: 'Product 4', nocCode: 'NOC4' },
        ];

        getCognitoClientMock.mockReturnValue({
            listUsers: vi.fn().mockReturnValue({
                promise: vi.fn().mockResolvedValue(mockListUsersResponse),
            }),
        } as unknown as CognitoIdentityServiceProvider);

        getIncompleteMultiOperatorProductsMock.mockResolvedValueOnce(mockProducts);

        await handler(mockEvent, mockContext, mockCallback);

        expect(getIncompleteMultiOperatorProductsMock).toHaveBeenCalled();
        expect(getCognitoClientMock).toHaveBeenCalled();
        expect(getSesClientMock).not.toHaveBeenCalled();
    });

    it('returns early if there are no email addresses matched up to incomplete products', async () => {
        const mockListUsersResponse: ListUsersResponse = {
            Users: [
                {
                    Attributes: [
                        { Name: 'email', Value: 'user1@example.com' },
                        { Name: 'custom:noc', Value: 'NOC1' },
                    ],
                },
                {
                    Attributes: [
                        { Name: 'email', Value: 'user1@example.com' },
                        { Name: 'custom:noc', Value: 'NOC2' },
                        { Name: 'custom:multiOpEmailEnabled', Value: 'false' },
                    ],
                },
            ],
        } as ListUsersResponse;

        const mockProducts: databaseFunctions.Product[] = [
            { productId: 'Product 1', nocCode: 'NOC1' },
            { productId: 'Product 3', nocCode: 'NOC3' },
            { productId: 'Product 4', nocCode: 'NOC4' },
        ];

        getCognitoClientMock.mockReturnValue({
            listUsers: vi.fn().mockReturnValue({
                promise: vi.fn().mockResolvedValue(mockListUsersResponse),
            }),
        } as unknown as CognitoIdentityServiceProvider);

        getIncompleteMultiOperatorProductsMock.mockResolvedValueOnce(mockProducts);

        await handler(mockEvent, mockContext, mockCallback);

        expect(getIncompleteMultiOperatorProductsMock).toHaveBeenCalled();
        expect(getCognitoClientMock).toHaveBeenCalled();
        expect(getSesClientMock).not.toHaveBeenCalled();
    });

    it('sends emails to users who have opted in and have incomplete products', async () => {
        const mockListUsersResponse: ListUsersResponse = {
            Users: [
                {
                    Attributes: [
                        { Name: 'email', Value: 'user1@example.com' },
                        { Name: 'custom:noc', Value: 'NOC1' },
                    ],
                },
                {
                    Attributes: [
                        { Name: 'email', Value: 'user1@example.com' },
                        { Name: 'custom:noc', Value: 'NOC2' },
                        { Name: 'custom:multiOpEmailEnabled', Value: 'false' },
                    ],
                },
                {
                    Attributes: [
                        { Name: 'email', Value: 'user3@example.com' },
                        { Name: 'custom:noc', Value: 'NOC3' },
                        { Name: 'custom:multiOpEmailEnabled', Value: 'true' },
                    ],
                },
                {
                    Attributes: [
                        { Name: 'email', Value: 'user4@example.com' },
                        { Name: 'custom:noc', Value: 'NOC1|NOC4' },
                        { Name: 'custom:multiOpEmailEnabled', Value: 'true' },
                    ],
                },
            ],
        } as ListUsersResponse;

        const mockProducts: databaseFunctions.Product[] = [
            { productId: 'Product 1', nocCode: 'NOC1' },
            { productId: 'Product 3', nocCode: 'NOC3' },
            { productId: 'Product 4', nocCode: 'NOC4' },
        ];

        getCognitoClientMock.mockReturnValue({
            listUsers: vi.fn().mockReturnValue({
                promise: vi.fn().mockResolvedValue(mockListUsersResponse),
            }),
        } as unknown as CognitoIdentityServiceProvider);

        getIncompleteMultiOperatorProductsMock.mockResolvedValueOnce(mockProducts);
        getSesClientMock.mockReturnValue(undefined as unknown as SES);
        sendEmailsMock.mockResolvedValueOnce(undefined);

        await handler(mockEvent, mockContext, mockCallback);

        expect(getIncompleteMultiOperatorProductsMock).toHaveBeenCalled();
        expect(getCognitoClientMock).toHaveBeenCalled();
        expect(getSesClientMock).toHaveBeenCalled();

        expect(sendEmailsMock).toHaveBeenCalledWith(undefined, 'mock-service-domain', [
            'user3@example.com',
            'user4@example.com',
        ]);
    });
});
