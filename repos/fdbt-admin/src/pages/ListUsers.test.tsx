import { render, screen, within } from '@testing-library/react';
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

const usersMockWithIWBusCoNoc: UserType[] = [
    {
        Username: '111111-aaaaaa-111111',
        Attributes: [
            {
                Name: 'email',
                Value: 'test@example.com',
            },
            {
                Name: 'custom:noc',
                Value: 'IWBusCo',
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

    const registrationCountTableData = [
        ['Completed Registrations', 0, '2'],
        ['Pending Registrations', 1, '1'],
        ['Total Registrations', 2, '3'],
    ];

    test.each(registrationCountTableData)(
        '%s column at position %i displays value %s',
        async (header, columnPosition, value) => {
            render(<ListUsers />);

            const headerRow = (await screen.findAllByRole('row'))[0];
            const columnHeader = within(headerRow).getAllByRole('columnheader')[columnPosition as number];
            const valueRow = (await screen.findAllByRole('row'))[1];
            const cell = within(valueRow).getAllByRole('cell')[columnPosition as number];

            expect(columnHeader).toHaveTextContent(header as string);
            expect(cell).toHaveTextContent(value as string);
        },
    );

    const registrationCountTableDataExcludingIWBusCoUsers = [
        ['Completed Registrations', 0, '1'],
        ['Pending Registrations', 1, '1'],
        ['Total Registrations', 2, '2'],
    ];

    test.each(registrationCountTableDataExcludingIWBusCoUsers)(
        '%s column at position %i displays value %s, excluding users with IWBusCo NOC',
        async (header, columnPosition, value) => {
            jest.spyOn(cognito, 'listUsersInPool').mockImplementation(() => Promise.resolve(usersMockWithIWBusCoNoc));

            render(<ListUsers />);

            const headerRow = (await screen.findAllByRole('row'))[0];
            const columnHeader = within(headerRow).getAllByRole('columnheader')[columnPosition as number];
            const valueRow = (await screen.findAllByRole('row'))[1];
            const cell = within(valueRow).getAllByRole('cell')[columnPosition as number];

            expect(columnHeader).toHaveTextContent(header as string);
            expect(cell).toHaveTextContent(value as string);
        },
    );

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

    test('sorts users by email alphabetically', async () => {
        render(<ListUsers />);

        expect((await screen.findByText('test@example.com')).closest('tbody')?.childNodes[1]).toHaveTextContent(
            'test@example.com',
        );
        expect((await screen.findByText('test@example.com')).closest('tbody')?.childNodes[2]).toHaveTextContent(
            'test2@example.com',
        );
        expect((await screen.findByText('test@example.com')).closest('tbody')?.childNodes[3]).toHaveTextContent(
            'test3@example.com',
        );
    });
});
