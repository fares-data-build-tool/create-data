import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { UserPoolDescriptionType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { MAIN_USER_POOL_PREFIX } from '../constants';
import * as cognito from '../data/cognito';
import AddUser from './AddUser';

const userPoolsMock: UserPoolDescriptionType[] = [
    {
        Name: `${MAIN_USER_POOL_PREFIX}-correct`,
        Id: '1',
    },
];

describe('AddUsers Component', () => {
    beforeEach(() => {
        jest.spyOn(cognito, 'getCognitoClient').mockImplementation(() =>
            Promise.resolve(new CognitoIdentityServiceProvider()),
        );

        jest.spyOn(cognito, 'getUserPoolList').mockImplementation(() => Promise.resolve(userPoolsMock));

        jest.spyOn(cognito, 'addUserToPool').mockImplementation(() => Promise.resolve());
    });

    test('displays success message when form submitted successfully', async () => {
        render(<AddUser />);

        userEvent.type(screen.getByRole('textbox', { name: /User Email/i }), 'test@example.com');

        userEvent.type(screen.getByRole('textbox', { name: /User National Operator Code/i }), '1TEST');

        userEvent.click(screen.getByText('Submit'));

        expect(await screen.findByText('Account created successfully for')).toHaveTextContent(
            'Account created successfully for test@example.com',
        );
    });

    test('displays error message when form submitted unsuccessfully', async () => {
        render(<AddUser />);

        jest.spyOn(cognito, 'addUserToPool').mockImplementation(() => {
            throw new Error('Invalid Email');
        });

        userEvent.type(screen.getByRole('textbox', { name: /User Email/i }), 'invalid_email');

        userEvent.type(screen.getByRole('textbox', { name: /User National Operator Code/i }), '1TEST');

        userEvent.click(screen.getByText('Submit'));

        expect(await screen.findByText('Invalid Email')).toBeTruthy();
    });

    test('error messages replace success messages', async () => {
        render(<AddUser />);

        userEvent.type(screen.getByRole('textbox', { name: /User Email/i }), 'test@example.com');
        userEvent.type(screen.getByRole('textbox', { name: /User National Operator Code/i }), '1TEST');
        userEvent.click(screen.getByText('Submit'));

        expect(await screen.findByText('Account created successfully for')).toHaveTextContent(
            'Account created successfully for test@example.com',
        );

        jest.spyOn(cognito, 'addUserToPool').mockImplementation(() => {
            throw new Error('Invalid Email');
        });

        userEvent.type(screen.getByRole('textbox', { name: /User Email/i }), 'invalid_email');
        userEvent.type(screen.getByRole('textbox', { name: /User National Operator Code/i }), '1TEST');
        userEvent.click(screen.getByText('Submit'));

        expect(await screen.findByText('Invalid Email')).toBeTruthy();
        expect(screen.queryByText('Account created successfully for')).toBeNull();
    });
});
