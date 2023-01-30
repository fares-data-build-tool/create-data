import { ReactElement, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { H1 } from '@govuk-react/heading';
import Table from '@govuk-react/table';
import Details from '@govuk-react/details';
import LoadingBox from '@govuk-react/loading-box';
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

const mapIntoArrayOfArrays = (input: string[]): string[][] => {
    return input.map((item) => [item]);
};

const dateIsWithinNumberOfDays = (date: Date, numberOfDays: number): boolean => {
    const today = new Date().getTime();
    const inputtedDate = date.getTime();

    const msBetweenDates = Math.abs(inputtedDate - today);

    // 👇️ convert ms to days                 hour   min  sec   ms
    const daysBetweenDates = msBetweenDates / (24 * 60 * 60 * 1000);

    return daysBetweenDates < numberOfDays;
};

const netexFileMatchesNoc = (fileName: string, noc: string): boolean => {
    const nocPart = fileName.split('/exports/')[0];
    return nocPart === noc;
};

const netexFilesGenerated = (activeNocs: string[], netexFiles: ObjectList, timeframe: 30 | 365): string[] => {
    const nocsThatHaveGeneratedNetex: string[] = [];
    activeNocs.forEach((noc) => {
        const netexFilesForNoc = netexFiles.find(
            (file) =>
                netexFileMatchesNoc(file.Key as string, noc) &&
                dateIsWithinNumberOfDays(file.LastModified as Date, timeframe),
        );
        if (netexFilesForNoc) {
            nocsThatHaveGeneratedNetex.push(noc);
        }
    });
    return nocsThatHaveGeneratedNetex;
};

const Reporting = ({ isFullAdmin }: ReportingProps): ReactElement => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [users, setUsers] = useState<UsersListType>([]);
    const [registeredNocs, setRegisteredNocs] = useState<string[]>([]);
    const [thirtyDayNetex, setThirtyDayNetex] = useState<string[]>([]);
    const [yearNetex, setYearNetex] = useState<string[]>([]);

    const getUsers = async (): Promise<UsersListType> => {
        const { client, userPoolId } = await getCognitoClientAndUserPool();

        return listUsersInPool(client, userPoolId);
    };

    const getExportsFromMatchingDataBucket = async (): Promise<ObjectList> => {
        const { client } = await getS3Client();
        const bucketName = getBucketName(NETEX_DATA_BUCKET_PREFIX);
        return listBucketObjects(client, bucketName);
    };

    useEffect(() => {
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
                    if (nocString.includes('|')) {
                        const splitNocs = nocString.split('|');
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

                setRegisteredNocs(nocs.sort());

                getExportsFromMatchingDataBucket()
                    .then((netexData) => {
                        setThirtyDayNetex(netexFilesGenerated(nocs.sort(), netexData, 30));
                        setYearNetex(netexFilesGenerated(nocs.sort(), netexData, 365));
                        setLoaded(true);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.error(err);
                setUsers([]);
            });
    }, []);

    return isFullAdmin ? (
        <>
            <LoadingBox loading={!loaded}>
                <H1>Reporting</H1>
                <Table>
                    <Table.Row key="users">
                        <Table.Cell>Registered users, discounting any DFT or KPMG accounts</Table.Cell>
                        <Table.Cell>{users.length}</Table.Cell>
                    </Table.Row>
                    <Table.Row key="nocs">
                        <Table.Cell>
                            <Details summary="Registered NOCs">
                                {' '}
                                <CSVLink data={mapIntoArrayOfArrays(registeredNocs)}>Download as csv</CSVLink>
                                <br />
                                {registeredNocs.join(', ')}
                            </Details>
                        </Table.Cell>
                        <Table.Cell>{registeredNocs.length}</Table.Cell>
                    </Table.Row>
                    <Table.Row key="30-day-netex">
                        <Table.Cell>
                            <Details summary="NOCs who have generated NeTEx in the last 30 days">
                                <CSVLink data={mapIntoArrayOfArrays(thirtyDayNetex)}>Download as csv</CSVLink>
                                <br />
                                {thirtyDayNetex.join(', ')}
                            </Details>
                        </Table.Cell>
                        <Table.Cell>{thirtyDayNetex.length}</Table.Cell>
                    </Table.Row>
                    <Table.Row key="year-netex">
                        <Table.Cell>
                            <Details summary="NOCs who have generated NeTEx in the last year">
                                <CSVLink data={mapIntoArrayOfArrays(yearNetex)}>Download as csv</CSVLink>
                                <br />
                                {yearNetex.join(', ')}
                            </Details>
                        </Table.Cell>
                        <Table.Cell>{yearNetex.length}</Table.Cell>
                    </Table.Row>
                </Table>
            </LoadingBox>
        </>
    ) : (
        <BrowserRouter>
            <Redirect to="/listUsers" />
        </BrowserRouter>
    );
};

export default Reporting;
