import { ReactElement, useEffect, useState } from 'react';
import { H1 } from '@govuk-react/heading';
import Table from '@govuk-react/table';
import { BrowserRouter, Redirect } from 'react-router-dom';
import { ObjectList } from 'aws-sdk/clients/s3';
import { UsersListType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { getCognitoClientAndUserPool } from '../utils/cognito';
import { listUsersInPool } from '../data/cognito';
import getS3Client from '../utils/s3';
import { getBucketName, listBucketObjects } from '../data/s3';
import { NETEX_DATA_BUCKET_PREFIX } from '../constants';

interface ReportingProps {
    isFullAdmin: boolean;
}

const dateIsWithinNumberOfDays = (date: Date, numberOfDays: number): boolean => {
    const today = new Date().getTime();
    const inputtedDate = date.getTime();

    const msBetweenDates = Math.abs(inputtedDate - today);

    // 👇️ convert ms to days                 hour   min  sec   ms
    const daysBetweenDates = msBetweenDates / (24 * 60 * 60 * 1000);

    return daysBetweenDates < numberOfDays;
};

const netexFilesGenerated = (activeNocs: string[], netexFiles: ObjectList, timeframe: 30 | 365): number => {
    let nocsThatHaveGeneratedNetex = 0;
    activeNocs.forEach((noc) => {
        const netexFilesForNoc = netexFiles.filter(
            (file) => file.Key?.includes(noc) && dateIsWithinNumberOfDays(file.LastModified as Date, timeframe),
        );
        if (netexFilesForNoc.length > 0) {
            nocsThatHaveGeneratedNetex += 1;
        }
    });
    return nocsThatHaveGeneratedNetex;
};

const Reporting = ({ isFullAdmin }: ReportingProps): ReactElement => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [netexFiles, setNetexFiles] = useState<ObjectList>([]);
    const [users, setUsers] = useState<UsersListType>([]);
    const [registeredNocs, setRegisteredNocs] = useState<string[]>([]);

    useEffect(() => {
        const getUsers = async (): Promise<UsersListType> => {
            const { client, userPoolId } = await getCognitoClientAndUserPool();

            return listUsersInPool(client, userPoolId);
        };

        const getExportsFromMatchingDataBucket = async (): Promise<ObjectList> => {
            const { client } = await getS3Client();
            const bucketName = getBucketName(NETEX_DATA_BUCKET_PREFIX);
            return listBucketObjects(client, bucketName);
        };

        getUsers()
            .then((data) => {
                const filteredData = data.filter((user) => {
                    const email = user.Attributes?.find((attribute) => attribute.Name === 'email')?.Value as string;
                    const hasTestNoc =
                        (user.Attributes?.find((attribute) => attribute.Name === 'custom:noc')?.Value as string) ===
                        'IWBusCo';
                    const emailToLower = email.toLowerCase();
                    const accountConfirmed = user?.UserStatus === 'CONFIRMED';

                    if (
                        !emailToLower.includes('kpmg') &&
                        !emailToLower.includes('dft.gov.uk') &&
                        !hasTestNoc &&
                        accountConfirmed
                    ) {
                        return user;
                    }

                    return false;
                });

                setUsers(filteredData);

                const nocs: string[] = [];

                filteredData.forEach((user) => {
                    const nocString = user.Attributes?.find((attribute) => attribute.Name === 'custom:noc')
                        ?.Value as string;
                    const usersNocs = [];
                    if (nocString.includes(',')) {
                        const splitNocs = nocString.split(',');
                        splitNocs.forEach((noc) => {
                            usersNocs.push(noc);
                        });
                    } else {
                        usersNocs.push(nocString);
                    }

                    usersNocs.forEach((noc) => {
                        if (!nocs.includes(noc)) {
                            nocs.push(noc);
                        }
                    });
                });

                setRegisteredNocs(nocs);

                getExportsFromMatchingDataBucket()
                    .then((netexData) => setNetexFiles(netexData))
                    .catch((err) => {
                        console.error(err);
                        setNetexFiles([]);
                    });

                setLoaded(true);
            })
            .catch((err) => {
                console.error(err);

                setUsers([]);
            });
    }, []);

    const placeholder = (
        <Table.Row>
            <Table.Cell>Loading</Table.Cell>
        </Table.Row>
    );

    const table = (
        <>
            <Table.Row key="users">
                <Table.Cell>Number of registered users, discounting any DFT or KPMG accounts</Table.Cell>
                <Table.Cell>{users.length}</Table.Cell>
            </Table.Row>
            <Table.Row key="nocs">
                <Table.Cell>Number of registered NOCs</Table.Cell>
                <Table.Cell>{registeredNocs.length}</Table.Cell>
            </Table.Row>
            <Table.Row key="30-day-netex">
                <Table.Cell>Number of NOCs who have generated NeTEx in the last 30 days</Table.Cell>
                <Table.Cell>{netexFilesGenerated(registeredNocs, netexFiles, 30)}</Table.Cell>
            </Table.Row>
            <Table.Row key="year-netex">
                <Table.Cell>Number of NOCs who have generated NeTEx in the last year</Table.Cell>
                <Table.Cell>{netexFilesGenerated(registeredNocs, netexFiles, 365)}</Table.Cell>
            </Table.Row>
        </>
    );

    return isFullAdmin ? (
        <>
            <H1>Reporting</H1>
            <Table>
                <Table.Row>
                    <Table.CellHeader>Statistic</Table.CellHeader>
                    <Table.CellHeader>Count</Table.CellHeader>
                </Table.Row>
                {loaded ? table : placeholder}
            </Table>
        </>
    ) : (
        <BrowserRouter>
            <Redirect to="/listUsers" />
        </BrowserRouter>
    );
};

export default Reporting;
