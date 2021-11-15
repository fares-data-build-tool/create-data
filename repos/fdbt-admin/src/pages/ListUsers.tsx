import { H1 } from '@govuk-react/heading';
import { Fragment, ReactElement, useEffect, useState } from 'react';
import { AttributeListType, UsersListType, UserType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import Table from '@govuk-react/table';
import { ATTRIBUTE_MAP, STATUS_MAP } from '../constants';
import { listUsersInPool } from '../data/cognito';
import getCognitoClientAndUserPool from '../utils/cognito';

const formatAttributes = (attributes: AttributeListType) => {
    return attributes
        .filter((attribute) => ATTRIBUTE_MAP[attribute.Name])
        .map((attribute) => (
            <Fragment key={attribute.Name}>
                <span>
                    <strong>{ATTRIBUTE_MAP[attribute.Name]}</strong>: {attribute.Value}
                </span>
                <br />
            </Fragment>
        ));
};

const getAttributeValue = (user: UserType, attributeName: string): string | undefined =>
    user?.Attributes?.find((item) => item.Name === attributeName)?.Value;

const sortByEmail = (a: UserType, b: UserType) => {
    const aEmail = a.Attributes?.find((attribute) => attribute.Name === 'email')?.Value || 'z';
    const bEmail = b.Attributes?.find((attribute) => attribute.Name === 'email')?.Value || 'z';

    return aEmail.localeCompare(bEmail);
};

const ListUsers = (): ReactElement => {
    const [users, setUsers] = useState<UsersListType>([]);

    useEffect(() => {
        const getUsers = async (): Promise<UsersListType> => {
            const { client, userPoolId } = await getCognitoClientAndUserPool();

            return listUsersInPool(client, userPoolId);
        };

        getUsers()
            .then((data) => setUsers(data.sort(sortByEmail)))
            .catch((err) => {
                console.error(err);

                setUsers([]);
            });
    }, []);

    const nonTestUsers = users?.filter((user) => !getAttributeValue(user, 'custom:noc')?.includes('IWBusCo'));

    const completedRegisteredUsers = nonTestUsers.filter((user) => user?.UserStatus === 'CONFIRMED');

    const pendingRegisteredUsers = nonTestUsers.filter((user) => user?.UserStatus === 'FORCE_CHANGE_PASSWORD');

    return (
        <>
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
            <Table>
                <Table.Row>
                    <Table.CellHeader>Email</Table.CellHeader>
                    <Table.CellHeader>Attributes</Table.CellHeader>
                    <Table.CellHeader>Status</Table.CellHeader>
                </Table.Row>
                {users.map((user) => (
                    <Table.Row key={user.Username}>
                        <Table.Cell>{getAttributeValue(user, 'email')}</Table.Cell>
                        <Table.Cell>{formatAttributes(user.Attributes || [])}</Table.Cell>
                        <Table.Cell>{STATUS_MAP[user.UserStatus || ''] ?? 'Unknown'}</Table.Cell>
                    </Table.Row>
                ))}
            </Table>
        </>
    );
};

export default ListUsers;
