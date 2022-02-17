import { ReactElement, useState } from 'react';
import { H1 } from '@govuk-react/heading';
import { useParams } from 'react-router-dom';
import Button from '@govuk-react/button';
import { useForm } from 'react-hook-form';
import { AdminGetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';

import useAsyncEffect from '../hooks/useAsyncEffect';
import { adminDeleteUser, getUser } from '../data/cognito';
import { getCognitoClientAndUserPool, humanFormatNocs, parseCognitoUser } from '../utils/cognito';

export interface DeleteFormUser {
    email: string;
    nocs: string;
}

type DeleteUserParams = {
    username: string;
};

const DeleteUser = (): ReactElement => {
    const adminGetUserResponse: AdminGetUserResponse = { Username: '' };
    const [user, setUser] = useState(adminGetUserResponse);
    const { username } = useParams<DeleteUserParams>();

    const { register, handleSubmit, formState, reset } = useForm<DeleteFormUser>({
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

    const [deletedUser, setDeletedUser] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async (formUser: DeleteFormUser) => {
        setDeletedUser('');
        setError('');
        reset();

        try {
            const { client, userPoolId } = await getCognitoClientAndUserPool();
            await adminDeleteUser(client, userPoolId, username);
            setDeletedUser(formUser.email);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <>
            <H1>Delete User</H1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email">User Email</label>
                <br />
                <input
                    id="email"
                    name="email"
                    ref={register({ required: true })}
                    style={{ width: `50%` }}
                    value={parseCognitoUser(user).email}
                    readOnly
                />
                <br />
                <br />
                <label htmlFor="nocs">User National Operator Code (NOC)</label>
                <br />
                <input
                    id="nocs"
                    name="nocs"
                    ref={register({ required: true })}
                    style={{ width: `75%` }}
                    value={humanFormatNocs(parseCognitoUser(user).nocs)}
                    readOnly
                />
                <br />
                <br />
                <Button buttonColour="#d4351c" disabled={formState.isSubmitting}>
                    Delete
                </Button>
                <br />
                {deletedUser && (
                    <div style={{ color: 'green' }}>
                        Account deleted successfully for <b>{parseCognitoUser(user).email}</b>
                    </div>
                )}
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </form>
        </>
    );
};

export default DeleteUser;
