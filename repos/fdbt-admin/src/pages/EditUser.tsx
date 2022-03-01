import { ReactElement, useState, useEffect } from 'react';
import { H1 } from '@govuk-react/heading';
import { BrowserRouter, Redirect, useParams } from 'react-router-dom';
import Button from '@govuk-react/button';
import { useForm } from 'react-hook-form';
import { AdminGetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';

import { adminUpdateUserAttributes, getUser } from '../data/cognito';
import {
    getCognitoClientAndUserPool,
    cogntioFormatNocs,
    humanFormatNocs,
    htmlFormatNocs,
    parseCognitoUser,
} from '../utils/cognito';
import useAsyncEffect from '../hooks/useAsyncEffect';

export interface EditFormUser {
    email: string;
    nocs: string;
}

interface EditUserProps {
    isFullAdmin: boolean;
}

type EditUserParams = {
    username: string;
};

const EditUser = ({ isFullAdmin }: EditUserProps): ReactElement => {
    const adminGetUserResponse: AdminGetUserResponse = { Username: '' };
    const [user, setUser] = useState(adminGetUserResponse);
    const [nocs, setNocs] = useState('');
    const { username } = useParams<EditUserParams>();

    const { register, handleSubmit, formState, reset } = useForm<EditFormUser>({
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
                setNocs(humanFormatNocs(parseCognitoUser(gotUser).nocs));
            }
        },
        [username],
    );

    const [updatedUserNocs, setUpdatedUserNocs] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async (formUser: EditFormUser) => {
        setUpdatedUserNocs('');
        setError('');

        const formattedUser = { ...formUser, nocs: cogntioFormatNocs(formUser.nocs) };

        reset();

        try {
            const { client, userPoolId } = await getCognitoClientAndUserPool();
            await adminUpdateUserAttributes(client, userPoolId, formattedUser);
            setUpdatedUserNocs(formUser.nocs);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    useEffect(() => {
        reset({ nocs });
    }, [nocs]);

    useEffect(() => {
        reset({ nocs: updatedUserNocs });
    }, [updatedUserNocs]);

    return isFullAdmin ? (
        <>
            <H1>Edit User</H1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email">User Email</label>
                <br />
                <small>
                    Email addresses cannot be changed, delete the existing user and create a new one if needed
                </small>
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
                <small>
                    If the user has multiple NOCs, enter a comma-separated list. For example: &apos;NOC1,NOC2,NOC3&apos;
                </small>
                <br />
                <input
                    id="nocs"
                    name="nocs"
                    ref={register({ required: true })}
                    style={{ width: `75%` }}
                    defaultValue={nocs}
                    key={nocs === 'Loading...' ? 'notLoadedYet' : 'loaded'}
                    disabled={nocs === 'Loading...'}
                    readOnly={false}
                />
                <br />
                <br />
                <Button disabled={formState.isSubmitting}>Submit</Button>
                <br />
                {updatedUserNocs && (
                    <div style={{ color: 'green' }}>
                        Account edited successfully for <b>{parseCognitoUser(user).email}</b> setting NOCs to{' '}
                        <b>{htmlFormatNocs(updatedUserNocs)}</b>
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

export default EditUser;
