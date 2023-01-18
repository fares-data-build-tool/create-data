import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';
import UserDataUploadComponent from '../components/UserDataUploads';
import {
    CSV_UPLOAD_ATTRIBUTE,
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
    MULTI_MODAL_ATTRIBUTE,
    SERVICE_LIST_EXEMPTION_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
} from '../constants/attributes';
import FaresTriangleExampleCsv from '../assets/files/Fares-Triangle-Example.csv';
import HowToUploadFaresTriangle from '../assets/files/How-to-Upload-a-Fares-Triangle.pdf';
import {
    NextPageContextWithSession,
    ErrorInfo,
    UserDataUploadsProps,
    ServicesInfo,
    TxcSourceAttribute,
} from '../interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import FormElementWrapper from 'src/components/FormElementWrapper';
import {
    getAllServicesByNocCode,
    getServicesByNocCodeAndDataSource,
    getTndsServicesByNocAndModes,
} from 'src/data/auroradb';
import { redirectTo } from 'src/utils/apiUtils';
import { isServiceListAttributeWithErrors } from './serviceList';

const title = 'CSV Upload - Create Fares Data Service';
const description = 'CSV Upload page of the Create Fares Data Service';

const CsvUpload = ({ errors, ...props }: UserDataUploadsProps): ReactElement => (
    <BaseLayout title={title} description={description} errors={errors}>
        <UserDataUploadComponent
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            errors={errors}
            detailBody={
                <>
                    <p>Some common issues with fares triangle uploads include:</p>
                    <ul className="govuk-list govuk-list--bullet">
                        <li>Commas in fare stage names</li>
                        <li>Not filling in every fare stage on the diagonal row</li>
                    </ul>
                    <p>
                        Use the help file htmlFor a more detailed guide on constructing a fares triangle in the required
                        format or download the fares triangle template to create a new file.
                    </p>
                </>
            }
        />
    </BaseLayout>
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: UserDataUploadsProps }> => {
    const csvUploadAttribute = getSessionAttribute(ctx.req, CSV_UPLOAD_ATTRIBUTE);
    const errors: ErrorInfo[] = csvUploadAttribute?.errors ?? [];
    const poundsOrPence = csvUploadAttribute?.poundsOrPence ?? null;

    const ticket = getSessionAttribute(ctx.req, MATCHING_JSON_ATTRIBUTE);
    const matchingJsonMetaData = getSessionAttribute(ctx.req, MATCHING_JSON_META_DATA_ATTRIBUTE);

    const backHref =
        ticket && matchingJsonMetaData
            ? `/products/productDetails?productId=${matchingJsonMetaData?.productId}${
                  matchingJsonMetaData.serviceId ? `&serviceId=${matchingJsonMetaData?.serviceId}` : ''
              }`
            : '';

    return {
        props: {
            csvUploadApiRoute: '/api/csvUpload',
            csvUploadTitle: 'Upload fares triangle',
            csvUploadHintText:
                'Upload a fares triangle as a .csv or MS Excel file. Refer to the help documents section to download a help file or a fares triangle template.',
            guidanceDocDisplayName: 'Download Help File - File Type PDF - File Size 592KB',
            guidanceDocAttachmentUrl: HowToUploadFaresTriangle,
            guidanceDocSize: '1.2MB',
            csvTemplateDisplayName: 'Download fares triangle CSV template - File Type CSV - File Size 255B',
            csvTemplateAttachmentUrl: FaresTriangleExampleCsv,
            csvTemplateSize: '255B',
            errors,
            backHref,
            poundsOrPence,
        },
    };
};

export default CsvUpload;
