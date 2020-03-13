import React, { ReactElement } from 'react';
import { NextPage } from 'next';
import Layout from '../layout/Layout';
import UserDataUploadComponent from '../components/UserDataUploads';
import { UserDataUploadsProps } from '../utils/types';

const title = 'CSV Zone Upload Method - Fares data build tool';
const description = 'CSV Zone Upload page of the Fares data build tool';

const uploadProps: UserDataUploadsProps = {
    csvUploadApiRoute: '/api/csvZoneUpload',
    csvUploadHintText:
        'Please upload your fare zone as a csv below. You can refer to the documents section to down a template and help file.',
    guidanceDocDisplayName: 'Download Help File',
    guidanceDocAttachmentUrl: '/assets/files/How-to-Upload-a-Fare-Zone.pdf',
    guidanceDocSize: '1.0MB',
    csvTemplateDisplayName: 'Download Fare Zone CSV Example',
    csvTemplateAttachmentUrl: '/assets/files/Fare-Zone-Example.csv',
    csvTemplateSize: '600B',
};

const CsvZoneUpload: NextPage = (): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <UserDataUploadComponent {...uploadProps} />
        </main>
    </Layout>
);

export default CsvZoneUpload;
