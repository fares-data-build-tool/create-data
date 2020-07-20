/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import { BaseLayout } from '../layout/Layout';
import UserDataUploadComponent, { UserDataUploadsProps } from '../components/UserDataUploads';
import { CSV_ZONE_UPLOAD_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';
import FareZoneExampleCsv from '../assets/files/Fare-Zone-Example.csv';
import HowToUploadFareZone from '../assets/files/How-to-Upload-a-Fare-Zone.pdf';
import { CustomAppProps } from '../interfaces';

const title = 'CSV Zone Upload - Fares Data Build Tool';
const description = 'CSV Zone Upload page of the Fares Data Build Tool';

const errorId = 'csv-upload-error';

const CsvZoneUpload = (uploadProps: UserDataUploadsProps & CustomAppProps): ReactElement => (
    <BaseLayout title={title} description={description} errors={uploadProps.errors}>
        <UserDataUploadComponent
            {...uploadProps}
            detailBody={
                <>
                    <p>Some common issues with CSV uploads include:</p>
                    <ul className="govuk-list govuk-list--bullet">
                        <li>Commas in fare zone names</li>
                    </ul>
                    <p>
                        Use the help file document for a more detailed help on constructing a fare zone CSV in the
                        required format or download the CSV template to create a new file.
                    </p>
                </>
            }
        />
    </BaseLayout>
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
                'Upload a fare zone as a CSV file below. Refer to the documents section to download a help file and a template.',
            guidanceDocDisplayName: 'Download Help File',
            guidanceDocAttachmentUrl: HowToUploadFareZone,
            guidanceDocSize: '1.0MB',
            csvTemplateDisplayName: 'Download fare zone CSV template',
            csvTemplateAttachmentUrl: FareZoneExampleCsv,
            csvTemplateSize: '600B',
            errors: !csvZoneUpload?.error ? [] : [{ errorMessage: csvZoneUpload.error, id: errorId }],
            detailSummary: "My CSV won't upload",
        },
    };

    if (csvZoneUpload?.error) {
        deleteCookieOnServerSide(ctx, CSV_ZONE_UPLOAD_COOKIE);
    }

    return uploadProps;
};

export default CsvZoneUpload;
