import { ReactElement, useEffect, useState } from 'react';
import { H1 } from '@govuk-react/heading';
import Table from '@govuk-react/table';
import { BrowserRouter, Redirect } from 'react-router-dom';

import { getBucketName, listBucketObjects } from '../data/s3';
import getS3Client from '../utils/s3';
import { NETEX_DATA_BUCKET_PREFIX, MATCHING_DATA_BUCKET_PREFIX } from '../constants';

interface ListIncompleteExportsProps {
    isFullAdmin: boolean;
}

const getDeleteUrl = (exportName: string | undefined): string => (exportName ? `/deleteExport/${exportName}` : `/`);

const getExportName = (file: string | undefined): string => (file ? file.split('/')[2] : `Error`);

const ListIncompleteExports = ({ isFullAdmin }: ListIncompleteExportsProps): ReactElement => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [exportsFromMatchingDataBucket, setExportsFromMatchingDataBucket] = useState<string[]>([]);
    const [zipsFromNetexDataBucket, setZipsFromNetexDataBucket] = useState<string[]>([]);
    const [differences, setDifferences] = useState<string[]>([]);

    useEffect(() => {
        const getExportsFromMatchingDataBucket = async (): Promise<string[]> => {
            const { client } = await getS3Client();
            const bucketName = getBucketName(MATCHING_DATA_BUCKET_PREFIX);
            const files = await listBucketObjects(client, bucketName);
            const exportsNames = files
                .filter((data) => data.Key?.includes('exports') && data.Key?.endsWith('zip'))
                .map((data) => getExportName(data.Key));
            return Array.from(new Set(exportsNames));
        };

        getExportsFromMatchingDataBucket()
            .then((data) => setExportsFromMatchingDataBucket(data))
            .catch((err) => {
                console.error(err);
                setExportsFromMatchingDataBucket([]);
            });
    }, []);

    useEffect(() => {
        const getZipsFromNetexDataBucket = async (): Promise<string[]> => {
            const { client } = await getS3Client();
            const bucketName = getBucketName(NETEX_DATA_BUCKET_PREFIX);
            const files = await listBucketObjects(client, bucketName);
            const zipNames = files.filter((data) => data.Key?.includes('zips')).map((data) => getExportName(data.Key));
            return Array.from(new Set(zipNames));
        };

        getZipsFromNetexDataBucket()
            .then((data) => setZipsFromNetexDataBucket(data))
            .catch((err) => {
                console.error(err);
                setZipsFromNetexDataBucket([]);
            });
    }, []);

    useEffect(() => {
        // list all exports in the match data bucket that don't have a zip created in the netex bucket
        const difference = exportsFromMatchingDataBucket.filter((x) => !zipsFromNetexDataBucket.includes(x));

        // stop flicker during loading of async s3 listings
        if (
            difference.length !== exportsFromMatchingDataBucket.length &&
            difference.length !== zipsFromNetexDataBucket.length
        ) {
            setDifferences(difference);
        }
        setLoaded(true);
    }, [exportsFromMatchingDataBucket, zipsFromNetexDataBucket]);

    const placeholder = (message: string) => (
        <Table.Row>
            <Table.Cell>{message}</Table.Cell>
            <Table.Cell />
        </Table.Row>
    );

    const table = (
        <>
            {differences.map((name) => (
                <Table.Row key={name}>
                    <Table.Cell>{name}</Table.Cell>
                    <Table.Cell>
                        <a href={getDeleteUrl(name)}>Delete</a>
                    </Table.Cell>
                </Table.Row>
            ))}
        </>
    );

    return isFullAdmin ? (
        <>
            <H1>Incomplete Exports List</H1>
            <small>
                This will show any currently in progress exports, that will shortly complete and be removed from this
                list
            </small>
            <Table>
                <Table.Row>
                    <Table.CellHeader>Name</Table.CellHeader>
                    <Table.CellHeader>Actions</Table.CellHeader>
                </Table.Row>
                {!loaded ? placeholder('Loading...') : <></>}
                {loaded && differences.length > 0 ? table : placeholder('No incomplete exports found')}
            </Table>
        </>
    ) : (
        <BrowserRouter>
            <Redirect to="/listUsers" />
        </BrowserRouter>
    );
};

export default ListIncompleteExports;
