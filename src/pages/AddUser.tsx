import { H1 } from '@govuk-react/heading';
import { ReactElement, useState } from 'react';
import Button from '@govuk-react/button';
import { useForm } from 'react-hook-form';
import { addUserToPool } from '../data/cognito';
import getCognitoClientAndUserPool from '../utils/cognito';

export interface FormUser {
    email: string;
    nocs: string;
}

const formatNocs = (nocs: string): string =>
    nocs
        .split(',')
        .map((noc) => noc.trim())
        .join('|');

const AddUser = (): ReactElement => {
    const { register, handleSubmit, formState, reset } = useForm<FormUser>();
    const [createdUserEmail, setCreatedUserEmail] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async (formUser: FormUser) => {
        setCreatedUserEmail('');
        setError('');
        const formattedUser = { ...formUser, nocs: formatNocs(formUser.nocs) };
        reset();

        try {
            const { client, userPoolId } = await getCognitoClientAndUserPool();
            await addUserToPool(client, userPoolId, formattedUser);
            setCreatedUserEmail(formUser.email);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <>
            <H1>Add User</H1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email">User Email</label>
                <br />
                <input id="email" name="email" ref={register({ required: true })} />
                <br />
                <br />
                <label htmlFor="nocs">User National Operator Code (NOC)</label>
                <br />
                <small>
                    If the user has multiple NOCs, enter a comma-separated list. For example, &apos;NOC1,NOC2,NOC3&apos;
                </small>
                <br />
                <input id="nocs" name="nocs" ref={register({ required: true })} />
                <br />
                <br />
                <Button disabled={formState.isSubmitting}>Submit</Button>
                <br />
                {createdUserEmail && (
                    <div style={{ color: 'green' }}>
                        Account created successfully for <b>{createdUserEmail}</b>
                    </div>
                )}
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </form>
        </>
    );
};

export default AddUser;
