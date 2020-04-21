/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import UserDataUploadComponent, { UserDataUploadsProps } from '../components/UserDataUploads';
import { CSV_UPLOAD_COOKIE } from '../constants';
import { buildTitle, deleteCookieOnServerSide } from '../utils';

const title = 'CSV Upload Method - Fares data build tool';
const description = 'CSV Upload page of the Fares data build tool';

const errorId = 'csv-upload-error';

const CsvUpload = (uploadProps: UserDataUploadsProps): ReactElement => (
    <Layout title={buildTitle(uploadProps.errors, title)} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <UserDataUploadComponent
                {...uploadProps}
                detailBody={
                    <>
                        <p>
                            Use the Help File document for more detailed help on constructing your Fares Triangle, the
                            Fares Triangle CSV Example document provides an example of the required format.
                        </p>
                        <p>Some common issues with the format include:</p>
                        <ul className="govuk-list govuk-list--bullet">
                            <li>Commas in fare stage names</li>
                            <li>Not filling in every price</li>
                            <li>Not filling in every fare stage on the diagonal</li>
                        </ul>
                    </>
                }
            />
        </main>
    </Layout>
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
                'Please upload your fares triangle as a csv below. You can refer to the documents section to down a template and help file.',
            guidanceDocDisplayName: 'Download Help File',
            guidanceDocAttachmentUrl: '/assets/files/How-to-Upload-a-Fares-Triangle.pdf',
            guidanceDocSize: '600KB',
            csvTemplateDisplayName: 'Download Fares Triangle CSV Example',
            csvTemplateAttachmentUrl: '/assets/files/Fares-Triangle-Example.csv',
            csvTemplateSize: '400B',
            errors: !csvUpload?.error ? [] : [{ errorMessage: csvUpload.error, id: errorId }],
            detailSummary: 'Help with Fares Triangle CSV upload',
        },
    };

    deleteCookieOnServerSide(ctx, CSV_UPLOAD_COOKIE);

    return uploadProps;
};

export default CsvUpload;
