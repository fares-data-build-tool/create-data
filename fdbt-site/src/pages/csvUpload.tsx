/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import { BaseLayout } from '../layout/Layout';
import UserDataUploadComponent, { UserDataUploadsProps } from '../components/UserDataUploads';
import { CSV_UPLOAD_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';
import FaresTriangleExampleCsv from '../assets/files/Fares-Triangle-Example.csv';
import HowToUploadFaresTriangle from '../assets/files/How-to-Upload-a-Fares-Triangle.pdf';

const title = 'CSV Upload - Fares Data Build Tool';
const description = 'CSV Upload page of the Fares Data Build Tool';

const errorId = 'csv-upload-error';

const CsvUpload = (uploadProps: UserDataUploadsProps): ReactElement => (
    <BaseLayout title={title} description={description} errors={uploadProps.errors}>
        <UserDataUploadComponent
            {...uploadProps}
            detailBody={
                <>
                    <p>Some common issues with csv uploads include:</p>
                    <ul className="govuk-list govuk-list--bullet">
                        <li>Commas in fare stage names</li>
                        <li>Not providing a price in every cell</li>
                        <li>Not filling in every fare stage on the diagonal row</li>
                    </ul>
                    <p>
                        Use the help file for a more detailed guide on constructing a fares triangle in the required
                        format or download the csv template to create a new file.
                    </p>
                </>
            }
        />
    </BaseLayout>
);

export const getServerSideProps = (ctx: NextPageContext): { props: UserDataUploadsProps } => {
    const cookies = parseCookies(ctx);
    const csvUploadCookie = cookies[CSV_UPLOAD_COOKIE];

    let csvUpload;

    if (csvUploadCookie) {
        csvUpload = JSON.parse(csvUploadCookie);
        if (csvUpload.error === undefined) {
            csvUpload.error = '';
        }
    }

    const uploadProps = {
        props: {
            csvUploadApiRoute: '/api/csvUpload',
            csvUploadHintText:
                'Upload a fares triangle as a csv file below. Refer to the documents section to download a help file and a fares triangle template.',
            guidanceDocDisplayName: 'Download Help File',
            guidanceDocAttachmentUrl: HowToUploadFaresTriangle,
            guidanceDocSize: '600KB',
            csvTemplateDisplayName: 'Download fares triangle csv template',
            csvTemplateAttachmentUrl: FaresTriangleExampleCsv,
            csvTemplateSize: '400B',
            errors: !csvUpload?.error ? [] : [{ errorMessage: csvUpload.error, id: errorId }],
            detailSummary: "My csv won't upload",
        },
    };

    deleteCookieOnServerSide(ctx, CSV_UPLOAD_COOKIE);

    return uploadProps;
};

export default CsvUpload;
