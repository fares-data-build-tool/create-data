/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';
import UserDataUploadComponent, { UserDataUploadsProps } from '../components/UserDataUploads';
import { CSV_UPLOAD_ATTRIBUTE } from '../constants';
import FaresTriangleExampleCsv from '../assets/files/Fares-Triangle-Example.csv';
import HowToUploadFaresTriangle from '../assets/files/How-to-Upload-a-Fares-Triangle.pdf';
import { CustomAppProps, NextPageContextWithSession, ErrorInfo } from '../interfaces';
import { getSessionAttribute } from '../utils/sessions';

const title = 'CSV Upload - Fares Data Build Tool';
const description = 'CSV Upload page of the Fares Data Build Tool';

const CsvUpload = (uploadProps: UserDataUploadsProps & CustomAppProps): ReactElement => (
    <BaseLayout title={title} description={description} errors={uploadProps.errors}>
        <UserDataUploadComponent
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
            csvUploadHintText:
                'Upload a fares triangle as a CSV file below. Refer to the documents section to download a help file and a fares triangle template.',
            guidanceDocDisplayName: 'Download Help File',
            guidanceDocAttachmentUrl: HowToUploadFaresTriangle,
            guidanceDocSize: '600KB',
            csvTemplateDisplayName: 'Download fares triangle CSV template',
            csvTemplateAttachmentUrl: FaresTriangleExampleCsv,
            csvTemplateSize: '400B',
            errors,
            detailSummary: "My CSV won't upload",
        },
    };
};

export default CsvUpload;
