import { render, screen } from '@testing-library/react';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { UserPoolDescriptionType, UserType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { MAIN_USER_POOL_PREFIX } from '../constants';
import * as cognito from '../data/cognito';
import ListUsers from './ListUsers';

const userPoolsMock: UserPoolDescriptionType[] = [
    {
        Name: `incorrect-${MAIN_USER_POOL_PREFIX}`,
        Id: '1',
    },
    {
        Name: `${MAIN_USER_POOL_PREFIX}-correct`,
        Id: '2',
    },
    {
        Name: `other-user-pool`,
        Id: '3',
    },
];

const usersMock: UserType[] = [
    {
        Username: '111111-aaaaaa-111111',
        Attributes: [
            {
                Name: 'email',
                Value: 'test@example.com',
            },
            {
                Name: 'custom:noc',
                Value: '1TEST',
            },
        ],
        UserStatus: 'CONFIRMED',
    },
    {
        Username: '222222-bbbbbb-222222',
        Attributes: [
            {
                Name: 'email',
                Value: 'test2@example.com',
            },
            {
                Name: 'custom:noc',
                Value: '2TEST',
            },
        ],
        UserStatus: 'CONFIRMED',
    },
    {
        Username: '333333-cccccc-333333',
        Attributes: [
            {
                Name: 'email',
                Value: 'test3@example.com',
            },
            {
                Name: 'custom:noc',
                Value: 'SCHEME1',
            },
            {
                Name: 'custom:schemeOperator',
                Value: 'Awesome Scheme Name',
            },
            {
                Name: 'custom:schemeRegionCode',
                Value: 'Y',
            },
        ],
        UserStatus: 'FORCE_CHANGE_PASSWORD',
    },
];

describe('ListUsers Component', () => {
    beforeEach(() => {
        jest.spyOn(cognito, 'getCognitoClient').mockImplementation(() =>
            Promise.resolve(new CognitoIdentityServiceProvider()),
        );

        jest.spyOn(cognito, 'getUserPoolList').mockImplementation(() => Promise.resolve(userPoolsMock));

        jest.spyOn(cognito, 'listUsersInPool').mockImplementation(() => Promise.resolve(usersMock));
    });

    test('displays email for each user', async () => {
        render(<ListUsers />);

        expect(await screen.findByText('test@example.com'));
        expect(await screen.findByText('test2@example.com'));
        expect(await screen.findByText('test3@example.com'));
    });

    test('displays correct attributes against each user', async () => {
        render(<ListUsers />);

        expect((await screen.findByText('test@example.com')).closest('tr')).toHaveTextContent('NOC: 1TEST');
        expect((await screen.findByText('test2@example.com')).closest('tr')).toHaveTextContent('NOC: 2TEST');
        expect((await screen.findByText('test3@example.com')).closest('tr')).toHaveTextContent('NOC: SCHEME1');
        expect((await screen.findByText('test3@example.com')).closest('tr')).toHaveTextContent(
            'Scheme Name: Awesome Scheme Name',
        );
        expect((await screen.findByText('test3@example.com')).closest('tr')).toHaveTextContent('Scheme Region: Y');
    });

    test('displays correct status against each user', async () => {
        render(<ListUsers />);

        expect((await screen.findByText('test@example.com')).closest('tr')).toHaveTextContent('Registered');
        expect((await screen.findByText('test2@example.com')).closest('tr')).toHaveTextContent('Registered');
        expect((await screen.findByText('test3@example.com')).closest('tr')).toHaveTextContent('Awaiting Registration');
    });
});
