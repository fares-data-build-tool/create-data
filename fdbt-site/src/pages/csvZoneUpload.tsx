import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPage } from 'next';
import Layout from '../layout/Layout';
import UserDataUpload from '../components/UserDataUploads';
import { UserDataUploadsProps } from '../utils/types';

const title = 'CSV Zone Upload Method - Fares data build tool';
const description = 'CSV Zone Upload page of the Fares data build tool';

const uploadProps: UserDataUploadsProps = {
    guidanceDocDisplayName: 'Download Help File',
    guidanceDocAttachmentUrl: '/assets/files/How-to-Upload-a-Fare-Zone.pdf',
    guidanceDocImageUrl: '/assets/images/Guidance-doc-front-page.png',
    guidanceDocSize: '1.0MB',
    csvTemplateDisplayName: 'Download Fare Zone CSV Example',
    csvTemplateAttachmentUrl: '/assets/files/Fare-Zone-Example.csv',
    csvTemplateImageUrl: '/assets/images/csv.png',
    csvTemplateSize: '600B',
};

const CsvZoneUpload: NextPage = (): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <UserDataUpload {...uploadProps} />
        </main>
    </Layout>
);

export default CsvZoneUpload;
