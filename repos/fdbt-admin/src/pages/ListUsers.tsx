import { Fragment, ReactElement, useEffect, useState } from 'react';
import { H1 } from '@govuk-react/heading';
import LoadingBox from '@govuk-react/loading-box';
import { AttributeType, UserType } from '@aws-sdk/client-cognito-identity-provider';
import Table from '@govuk-react/table';
import { ATTRIBUTE_MAP, STATUS_MAP } from '../constants';
import { listUsersInPool } from '../data/cognito';
import { getCognitoClientAndUserPool } from '../utils/cognito';

interface ListUsersProps {
    isFullAdmin: boolean;
}

const formatAttributes = (attributes: AttributeType[]) => {
    return attributes
        .filter((attribute) => attribute.Name && ATTRIBUTE_MAP[attribute.Name])
        .map(
            (attribute) =>
                attribute.Value !== undefined && (
                    <Fragment key={attribute.Name}>
                        <span>
                            <strong>{attribute.Name && ATTRIBUTE_MAP[attribute.Name]}</strong>: {attribute.Value.replace(/\|/g, ', ')}
                        </span>
                        <br />
                    </Fragment>
                ),
        );
};

const getAttributeValue = (user: UserType, attributeName: string): string | undefined =>
    user?.Attributes?.find((item) => item.Name === attributeName)?.Value;

const getDeleteUrl = (username?: string): string => (username ? `/deleteUser/${username}` : '/');
const getEditUrl = (username?: string): string => (username ? `/editUser/${username}` : '/');
const getResendUrl = (username?: string): string => (username ? `/resendInvite/${username}` : '/');

const sortByEmail = (a: UserType, b: UserType) => {
    const aEmail = a.Attributes?.find((attribute) => attribute.Name === 'email')?.Value || 'z';
    const bEmail = b.Attributes?.find((attribute) => attribute.Name === 'email')?.Value || 'z';
    return aEmail.localeCompare(bEmail);
};

const ListUsers = ({ isFullAdmin }: ListUsersProps): ReactElement => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const nonTestUsers = users?.filter((user) => !getAttributeValue(user, 'custom:noc')?.includes('IWBusCo'));
    const completedRegisteredUsers = nonTestUsers.filter((user) => user?.UserStatus === 'CONFIRMED');
    const pendingRegisteredUsers = nonTestUsers.filter((user) => user?.UserStatus === 'FORCE_CHANGE_PASSWORD');

    useEffect(() => {
        const getUsers = async (): Promise<UserType[]> => {
            const { client, userPoolId } = await getCognitoClientAndUserPool();

            return listUsersInPool(client, userPoolId);
        };

        getUsers()
            .then((data) => {
                setUsers(data.sort(sortByEmail));
                setLoaded(true);
            })
            .catch((err) => {
                console.error(err);

                setUsers([]);
            });
    }, []);

    return (
        <>
            <LoadingBox loading={!loaded}>
                <H1>User List</H1>
                <Table>
                    <Table.Row>
                        <Table.CellHeader>Completed Registrations</Table.CellHeader>
                        <Table.CellHeader>Pending Registrations</Table.CellHeader>
                        <Table.CellHeader>Total Registrations</Table.CellHeader>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell style={{ color: '#36B22E' }}>
                            <b>{completedRegisteredUsers.length}</b>
                        </Table.Cell>
                        <Table.Cell style={{ color: '#FF6C00' }}>
                            <b>{pendingRegisteredUsers.length}</b>
                        </Table.Cell>
                        <Table.Cell>
                            <b>{nonTestUsers.length}</b>
                        </Table.Cell>
                    </Table.Row>
                </Table>
                <br />
                <Table>
                    <Table.Row>
                        <Table.CellHeader>Email</Table.CellHeader>
                        {isFullAdmin && <Table.CellHeader>Actions</Table.CellHeader>}
                        <Table.CellHeader>Attributes</Table.CellHeader>
                        <Table.CellHeader>Status</Table.CellHeader>
                    </Table.Row>
                    {users.map((user) => (
                        <Table.Row key={user.Username}>
                            <Table.Cell>{getAttributeValue(user, 'email')}</Table.Cell>
                            {isFullAdmin && (
                                <Table.Cell>
                                    <a href={getEditUrl(user.Username)}>Edit</a>
                                    <br />
                                    <a href={getDeleteUrl(user.Username)}>Delete</a>
                                    {STATUS_MAP[user.UserStatus || ''] === 'Awaiting Registration' ? (
                                        <>
                                            <br />
                                            <a href={getResendUrl(user.Username)}>Resend</a>
                                        </>
                                    ) : (
                                        ''
                                    )}
                                </Table.Cell>
                            )}
                            <Table.Cell>{formatAttributes(user.Attributes || [])}</Table.Cell>
                            <Table.Cell>{STATUS_MAP[user.UserStatus || ''] ?? 'Unknown'}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table>
            </LoadingBox>
        </>
    );
};

export default ListUsers;
