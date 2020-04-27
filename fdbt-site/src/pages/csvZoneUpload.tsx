/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import UserDataUploadComponent, { UserDataUploadsProps } from '../components/UserDataUploads';
import { CSV_ZONE_UPLOAD_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';

const title = 'CSV Zone Upload Method - Fares data build tool';
const description = 'CSV Zone Upload page of the Fares data build tool';

const errorId = 'csv-upload-error';

const CsvZoneUpload = (uploadProps: UserDataUploadsProps): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <UserDataUploadComponent
                {...uploadProps}
                detailBody={
                    <>
                        <p>
                            Use the Help File document for more detailed help on constructing your Fare Zone CSV, the
                            Fares Zone CSV Example document provides an example of the required format.
                        </p>
                        <p>Some common issues with the format include:</p>
                        <ul className="govuk-list govuk-list--bullet">
                            <li>Commas in Fare Zone name</li>
                        </ul>
                    </>
                }
            />
        </main>
    </Layout>
);

export const getServerSideProps = (ctx: NextPageContext): { props: UserDataUploadsProps } => {
    const cookies = parseCookies(ctx);
    const csvZoneUploadCookie = cookies[CSV_ZONE_UPLOAD_COOKIE];

    let csvZoneUpload;

    if (csvZoneUploadCookie) {
        csvZoneUpload = JSON.parse(csvZoneUploadCookie);
        if (csvZoneUpload.error === undefined) {
            csvZoneUpload.error = '';
        }
    }

    const uploadProps = {
        props: {
            csvUploadApiRoute: '/api/csvZoneUpload',
            csvUploadHintText:
                'Upload your fare zone as a csv below. You can refer to the documents section to down a template and help file.',
            guidanceDocDisplayName: 'Download Help File',
            guidanceDocAttachmentUrl: '/assets/files/How-to-Upload-a-Fare-Zone.pdf',
            guidanceDocSize: '1.0MB',
            csvTemplateDisplayName: 'Download Fare Zone CSV Example',
            csvTemplateAttachmentUrl: '/assets/files/Fare-Zone-Example.csv',
            csvTemplateSize: '600B',
            errors: !csvZoneUpload?.error ? [] : [{ errorMessage: csvZoneUpload.error, id: errorId }],
            detailSummary: 'Help with Fares Zone CSV upload',
        },
    };

    if (csvZoneUpload?.error) {
        deleteCookieOnServerSide(ctx, CSV_ZONE_UPLOAD_COOKIE);
    }

    return uploadProps;
};

export default CsvZoneUpload;
