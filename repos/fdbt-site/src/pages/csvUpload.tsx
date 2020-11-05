import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';
import UserDataUploadComponent, { UserDataUploadsProps } from '../components/UserDataUploads';
import { CSV_UPLOAD_ATTRIBUTE } from '../constants';
import FaresTriangleExampleCsv from '../assets/files/Fares-Triangle-Example.csv';
import HowToUploadFaresTriangle from '../assets/files/How-to-Upload-a-Fares-Triangle.pdf';
import { NextPageContextWithSession, ErrorInfo } from '../interfaces';
import { getSessionAttribute } from '../utils/sessions';
import { getCsrfToken } from '../utils';

const title = 'CSV Upload - Create Fares Data Service';
const description = 'CSV Upload page of the Create Fares Data Service';

const CsvUpload = (uploadProps: UserDataUploadsProps): ReactElement => (
    <BaseLayout title={title} description={description} errors={uploadProps.errors}>
        <UserDataUploadComponent
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...uploadProps}
            detailBody={
                <>
                    <p>Some common issues with CSV uploads include:</p>
                    <ul className="govuk-list govuk-list--bullet">
                        <li>Commas in fare stage names</li>
                        <li>Not providing a price in every cell</li>
                        <li>Not filling in every fare stage on the diagonal row</li>
                    </ul>
                    <p>
                        Use the help file for a more detailed guide on constructing a fares triangle in the required
                        format or download the CSV template to create a new file.
                    </p>
                </>
            }
        />
    </BaseLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: UserDataUploadsProps } => {
    const csvUploadAttribute = getSessionAttribute(ctx.req, CSV_UPLOAD_ATTRIBUTE);
    const errors: ErrorInfo[] = csvUploadAttribute ? csvUploadAttribute.errors : [];
    return {
        props: {
            csvUploadApiRoute: '/api/csvUpload',
            csvUploadTitle: 'Upload fares triangle as CSV',
            csvUploadHintText:
                'Upload a fares triangle as a CSV file. Refer to the help documents section to download a help file or a fares triangle template.',
            guidanceDocDisplayName: 'Download Help File - File Type PDF - File Size 1.2MB',
            guidanceDocAttachmentUrl: HowToUploadFaresTriangle,
            guidanceDocSize: '1.2MB',
            csvTemplateDisplayName: 'Download fares triangle CSV template - File Type CSV - File Size 255B',
            csvTemplateAttachmentUrl: FaresTriangleExampleCsv,
            csvTemplateSize: '255B',
            errors,
            detailSummary: "My CSV won't upload",
            csrfToken: getCsrfToken(ctx),
        },
    };
};

export default CsvUpload;
