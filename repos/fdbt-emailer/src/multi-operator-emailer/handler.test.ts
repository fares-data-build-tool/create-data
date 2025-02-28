import { handler } from './handler';
import { Context } from 'aws-lambda';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('fdbt-multi-operator-emailer handler', () => {
    const mockEvent = {};
    const mockContext = {} as Context;
    const mockCallback = vi.fn();

    vi.mock('../src/cognito');
    vi.mock('../src/database');
    vi.mock('../src/email');
    vi.mock('../src/ssm');

    beforeEach(() => {
        vi.resetAllMocks();

        process.env.RDS_HOST = 'mock-host';
        process.env.SERVICE_EMAIL_ADDRESS = 'mock-service-address';
        process.env.SERVICE_DOMAIN = 'mock-service-domain';
        process.env.USER_POOL_ID = 'mock-user-pool-id';
    });

    it.each(['RDS_HOST', 'SERVICE_EMAIL_ADDRESS', 'SERVICE_DOMAIN', 'USER_POOL_ID'])(
        'throws an error when the required env var %s is missing',
        async (input) => {
            process.env[input] = '';

            await expect(handler(mockEvent, mockContext, mockCallback)).rejects.toThrow(
                'Missing env vars - RDS_HOST, SERVICE_EMAIL_ADDRESS, SERVICE_DOMAIN and USER_POOL_ID must be set',
            );
        },
    );

    // test: combo of users with incomplete/complete products but not opted in
    // test: combo of users with incomplete/complete products and opted in
    // test: users with multiple nocs
});
