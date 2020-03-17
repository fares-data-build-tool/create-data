/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import UserDataUploadComponent, { UserDataUploadsProps } from '../components/UserDataUploads';
import { CSV_UPLOAD_COOKIE } from '../constants';

const title = 'CSV Upload Method - Fares data build tool';
const description = 'CSV Upload page of the Fares data build tool';

const CsvUpload = (uploadProps: UserDataUploadsProps): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <UserDataUploadComponent {...uploadProps} />
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
            error: !csvUploadCookie ? '' : csvUpload.error,
        },
    };

    return uploadProps;
};

export default CsvUpload;
