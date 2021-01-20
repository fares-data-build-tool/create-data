import { H1 } from '@govuk-react/heading';
import { Fragment, ReactElement, useEffect, useState } from 'react';
import { AttributeListType, UsersListType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import Table from '@govuk-react/table';
import { ATTRIBUTE_MAP, MAIN_USER_POOL_PREFIX, STATUS_MAP } from '../constants';
import { getCognitoClient, getUserPoolList, listUsersInPool } from '../data/cognito';

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

const ListUsers = (): ReactElement => {
    const [users, setUsers] = useState<UsersListType>([]);

    useEffect(() => {
        const getUsers = async (): Promise<UsersListType> => {
            const cognito = await getCognitoClient();

            const userPoolList = await getUserPoolList(cognito);
            const mainUserPool = userPoolList?.find((pool) => pool.Name?.startsWith(MAIN_USER_POOL_PREFIX));

            if (mainUserPool?.Id) {
                return listUsersInPool(cognito, mainUserPool.Id);
            }

            console.error('Failed to retrieve main user pool data');

            return [];
        };

        getUsers()
            .then((data) => setUsers(data))
            .catch((err) => {
                console.error(err);

                setUsers([]);
            });
    }, []);

    return (
        <>
            <H1>User List</H1>
            <Table>
                <Table.Row>
                    <Table.CellHeader>Email</Table.CellHeader>
                    <Table.CellHeader>Attributes</Table.CellHeader>
                    <Table.CellHeader>Status</Table.CellHeader>
                </Table.Row>
                {users.map((user) => (
                    <Table.Row key={user.Username}>
                        <Table.Cell>{user.Attributes?.find((item) => item.Name === 'email')?.Value}</Table.Cell>
                        <Table.Cell>{formatAttributes(user.Attributes || [])}</Table.Cell>
                        <Table.Cell>{STATUS_MAP[user.UserStatus || ''] ?? 'Unknown'}</Table.Cell>
                    </Table.Row>
                ))}
            </Table>
        </>
    );
};

export default ListUsers;
