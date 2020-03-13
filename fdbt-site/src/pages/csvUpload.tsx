/* eslint-disable react/jsx-props-no-spreading */
import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPage } from 'next';
import Layout from '../layout/Layout';
import UserDataUploadComponent from '../components/UserDataUploads';
import { UserDataUploadsProps } from '../utils/types';

const title = 'CSV Upload Method - Fares data build tool';
const description = 'CSV Upload page of the Fares data build tool';

const uploadProps: UserDataUploadsProps = {
    csvUploadApiRoute: '/api/csvUpload',
    csvUploadHintText:
        'Please upload your fares triangle as a csv below. You can refer to the documents section to down a template and help file.',
    guidanceDocDisplayName: 'Download Help File',
    guidanceDocAttachmentUrl: '/assets/files/How-to-Upload-a-Fares-Triangle.pdf',
    guidanceDocSize: '600KB',
    csvTemplateDisplayName: 'Download Fares Triangle CSV Example',
    csvTemplateAttachmentUrl: '/assets/files/Fares-Triangle-Example.csv',
    csvTemplateSize: '400B',
};

const CsvUpload: NextPage = (): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <UserDataUploadComponent {...uploadProps} />
        </main>
    </Layout>
);

export default CsvUpload;
