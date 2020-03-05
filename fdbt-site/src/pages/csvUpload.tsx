/* eslint-disable react/jsx-props-no-spreading */
import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPage } from 'next';
import Layout from '../layout/Layout';
import UserDataUpload from '../components/UserDataUploads';
import { UserDataUploadsProps } from '../utils/types';

const title = 'CSV Upload Method - Fares data build tool';
const description = 'CSV Upload page of the Fares data build tool';

const uploadProps: UserDataUploadsProps = {
    helpDisplayName: 'Download Help File',
    helpAttachmentUrl: '/assets/files/How-to-Upload-a-Fares-Triangle.pdf',
    helpImageUrl: '/assets/images/Guidance-doc-front-page.png',
    helpSize: '1.3MB',
    exampleDisplayName: 'Download Fares Triangle CSV Example',
    exampleAttachmentUrl: '/assets/files/Fares-Triangle-Example.csv',
    exampleImageUrl: '/assets/images/csv.png',
    exampleSize: '325B',
};

const CsvUpload: NextPage = (): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <UserDataUpload {...uploadProps} />
        </main>
    </Layout>
);

export default CsvUpload;
