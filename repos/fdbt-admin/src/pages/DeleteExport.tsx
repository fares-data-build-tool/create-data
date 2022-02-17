import { ReactElement, useState } from 'react';
import { H1 } from '@govuk-react/heading';
import { useParams } from 'react-router-dom';
import Button from '@govuk-react/button';
import { useForm } from 'react-hook-form';

import getS3Client from '../utils/s3';
import { deleteExport, getBucketName } from '../data/s3';
import { MATCHING_DATA_BUCKET_PREFIX } from '../constants';

type DeleteExportParams = {
    exportName: string;
};

export interface DeleteFormExport {
    exportName: string;
}

const getNoc = (exportName: string) => exportName.split('_')[0];

const DeleteExport = (): ReactElement => {
    const { exportName } = useParams<DeleteExportParams>();
    const [deletedExport, setDeletedExport] = useState('');
    const [error, setError] = useState('');

    const { register, handleSubmit, formState, reset } = useForm<DeleteFormExport>();

    const onSubmit = async () => {
        setDeletedExport('');
        setError('');
        reset();

        try {
            const { client } = await getS3Client();
            const bucketName = getBucketName(MATCHING_DATA_BUCKET_PREFIX);
            await deleteExport(client, bucketName, exportName);
            setDeletedExport(exportName);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <>
            <H1>Delete Export</H1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="exportName">Export Name</label>
                <br />
                <input
                    id="exportName"
                    name="exportName"
                    ref={register({ required: true })}
                    style={{ width: `50%` }}
                    value={exportName}
                    readOnly
                />
                <br />
                <br />
                <Button buttonColour="#d4351c" disabled={formState.isSubmitting}>
                    Delete
                </Button>
                <br />
                {deletedExport && (
                    <div style={{ color: 'green' }}>
                        Export <b>{exportName}</b> deleted successfully for <b>{getNoc(exportName)}</b>
                    </div>
                )}
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </form>
        </>
    );
};

export default DeleteExport;
