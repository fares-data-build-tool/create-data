import { ReactElement, useState } from 'react';
import { H1 } from '@govuk-react/heading';
import { BrowserRouter, Redirect, useParams } from 'react-router-dom';
import Button from '@govuk-react/button';
import { useForm } from 'react-hook-form';
import { AdminGetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import useAsyncEffect from '../hooks/useAsyncEffect';
import { addUserToPool, adminDeleteUser, getUser } from '../data/cognito';
import { getCognitoClientAndUserPool, humanFormatNocs, parseCognitoUser } from '../utils/cognito';

export interface RecreateAccountUser {
    email: string;
    nocs: string;
}

interface ResendInviteProps {
    isFullAdmin: boolean;
}

type ResendInviteParams = {
    username: string;
};

const ResendInvite = ({ isFullAdmin }: ResendInviteProps): ReactElement => {
    const adminGetUserResponse: AdminGetUserResponse = { Username: '' };
    const [user, setUser] = useState(adminGetUserResponse);
    const { username } = useParams<ResendInviteParams>();

    const { register, handleSubmit, formState, reset } = useForm<RecreateAccountUser>({
        defaultValues: {
            nocs: parseCognitoUser(user).nocs,
        },
    });

    useAsyncEffect(
        async (isCanceled) => {
            const { client, userPoolId } = await getCognitoClientAndUserPool();
            const gotUser = await getUser(client, userPoolId, username);
            if (!isCanceled()) {
                setUser(gotUser);
            }
        },
        [username],
    );

    const [remadeUser, setRemadeUser] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async (formUser: RecreateAccountUser) => {
        setRemadeUser('');
        setError('');
        reset();

        try {
            const { client, userPoolId } = await getCognitoClientAndUserPool();
            await adminDeleteUser(client, userPoolId, username);
            await addUserToPool(client, userPoolId, formUser);
            setRemadeUser(formUser.email);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return isFullAdmin ? (
        <>
            <H1>Resend Invite</H1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email">User Email</label>
                <br />
                <input
                    id="email"
                    style={{ width: `50%` }}
                    value={parseCognitoUser(user).email}
                    readOnly
                    {...register('email', { required: true })}
                />
                <br />
                <br />
                <label htmlFor="nocs">User National Operator Code (NOC)</label>
                <br />
                <input
                    id="nocs"
                    style={{ width: `75%` }}
                    value={humanFormatNocs(parseCognitoUser(user).nocs)}
                    readOnly
                    {...register('nocs', { required: true })}
                />
                <br />
                <br />
                <Button buttonColour="#FFA500" disabled={formState.isSubmitting}>
                    Resend
                </Button>
                <br />
                {remadeUser && (
                    <div style={{ color: 'green' }}>
                        Invite successfully resent for <b>{parseCognitoUser(user).email}</b>
                    </div>
                )}
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </form>
        </>
    ) : (
        <BrowserRouter>
            <Redirect to="/listUsers" />
        </BrowserRouter>
    );
};

export default ResendInvite;
