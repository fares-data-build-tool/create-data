/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';
import UserDataUploadComponent, { UserDataUploadsProps } from '../components/UserDataUploads';
import { FARE_ZONE_ATTRIBUTE } from '../constants';
import FareZoneExampleCsv from '../assets/files/Fare-Zone-Example.csv';
import HowToUploadFareZone from '../assets/files/How-to-Upload-a-Fare-Zone.pdf';
import { CustomAppProps, NextPageContextWithSession, ErrorInfo } from '../interfaces';
import { getSessionAttribute } from '../utils/sessions';
import { FareZoneWithErrors, FareZone } from './api/csvZoneUpload';

const title = 'CSV Zone Upload - Fares Data Build Tool';
const description = 'CSV Zone Upload page of the Fares Data Build Tool';

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

export const isFareZoneAttributeWithErrors = (
    fareZoneAttribute: FareZone | FareZoneWithErrors,
): fareZoneAttribute is FareZoneWithErrors => (fareZoneAttribute as FareZoneWithErrors).errors !== undefined;

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: UserDataUploadsProps } => {
    const fareZoneAttribute = getSessionAttribute(ctx.req, FARE_ZONE_ATTRIBUTE);
    const errors: ErrorInfo[] =
        fareZoneAttribute && isFareZoneAttributeWithErrors(fareZoneAttribute) ? fareZoneAttribute.errors : [];

    return {
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
            errors,
            detailSummary: "My CSV won't upload",
        },
    };
};

export default CsvZoneUpload;
