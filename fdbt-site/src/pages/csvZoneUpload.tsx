/* eslint-disable react/jsx-props-no-spreading */
import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPage } from 'next';
import Layout from '../layout/Layout';
import UserDataUpload from '../components/UserDataUploads';
import { UserDataUploadsProps } from '../utils/types';

const title = 'CSV Zone Upload Method - Fares data build tool';
const description = 'CSV Zone Upload page of the Fares data build tool';

const uploadProps: UserDataUploadsProps = {
    helpDisplayName: 'fffffff',
    helpAttachmentUrl: 'fffffff',
    helpImageUrl: 'fffffff',
    helpSize: 'fffffff',
    exampleDisplayName: 'fffffff',
    exampleAttachmentUrl: 'fffffff',
    exampleImageUrl: 'fffffff',
    exampleSize: 'fffffff',
};

const CsvZoneUpload: NextPage = (): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <UserDataUpload {...uploadProps} />
        </main>
    </Layout>
);

export default CsvZoneUpload;
