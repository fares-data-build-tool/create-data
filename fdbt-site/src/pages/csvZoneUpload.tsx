import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';
import UserDataUploadComponent from '../components/UserDataUploads';
import { FARE_ZONE_ATTRIBUTE } from '../constants';
import FareZoneExampleCsv from '../assets/files/Fare-Zone-Example.csv';
import HowToUploadFareZone from '../assets/files/How-to-Upload-a-Fare-Zone.pdf';
import { NextPageContextWithSession, ErrorInfo, UserDataUploadsProps, FareZoneWithErrors } from '../interfaces';
import { getSessionAttribute } from '../utils/sessions';
import { getCsrfToken } from '../utils';

const title = 'CSV Zone Upload - Create Fares Data Service';
const description = 'CSV Zone Upload page of the Create Fares Data Service';

const CsvZoneUpload = (uploadProps: UserDataUploadsProps): ReactElement => (
    <BaseLayout title={title} description={description} errors={uploadProps.errors}>
        <UserDataUploadComponent
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...uploadProps}
            detailBody={
                <>
                    <p>Some common issues with fare zone uploads include:</p>
                    <ul className="govuk-list govuk-list--bullet">
                        <li>Commas in fare zone names</li>
                    </ul>
                    <p>
                        Use the help file document for a more detailed help on constructing a fare zone CSV in the
                        required format or download the .csv template to create a new file.
                    </p>
                </>
            }
        />
    </BaseLayout>
);

export const isFareZoneAttributeWithErrors = (
    fareZoneAttribute: string | FareZoneWithErrors,
): fareZoneAttribute is FareZoneWithErrors => (fareZoneAttribute as FareZoneWithErrors).errors !== undefined;

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: UserDataUploadsProps } => {
    const fareZoneAttribute = getSessionAttribute(ctx.req, FARE_ZONE_ATTRIBUTE);
    const errors: ErrorInfo[] =
        fareZoneAttribute && isFareZoneAttributeWithErrors(fareZoneAttribute) ? fareZoneAttribute.errors : [];

    return {
        props: {
            csvUploadApiRoute: '/api/csvZoneUpload',
            csvUploadTitle: 'Upload fare zone',
            csvUploadHintText:
                'Upload a fare zone as a .csv or MS Excel file. A fare zone is made up of all the relevant NaPTAN or ATCO codes within a geographical area. Refer to the help documents section to download a help file or a template.',
            guidanceDocDisplayName: 'Download Help File - File Type PDF - File Size 826KB',
            guidanceDocAttachmentUrl: HowToUploadFareZone,
            guidanceDocSize: '967KB',
            csvTemplateDisplayName: 'Download fare zone CSV template - File Type CSV - File Size 673B',
            csvTemplateAttachmentUrl: FareZoneExampleCsv,
            csvTemplateSize: '673B',
            errors,
            detailSummary: "My fare zone won't upload",
            csrfToken: getCsrfToken(ctx),
        },
    };
};

export default CsvZoneUpload;
