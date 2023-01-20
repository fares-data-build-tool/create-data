import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';
import UserDataUploadComponent from '../components/UserDataUploads';
import {
    FARE_ZONE_ATTRIBUTE,
    MULTI_MODAL_ATTRIBUTE,
    SERVICE_LIST_EXEMPTION_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
} from '../constants/attributes';
import FareZoneExampleCsv from '../assets/files/Fare-Zone-Example.csv';
import HowToUploadFareZone from '../assets/files/How-to-Upload-a-Fare-Zone.pdf';
import {
    NextPageContextWithSession,
    ErrorInfo,
    UserDataUploadsProps,
    FareZoneWithErrors,
    ServicesInfo,
    TxcSourceAttribute,
} from '../interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { isServiceListAttributeWithErrors } from './serviceList';
import {
    getAllServicesByNocCode,
    getServicesByNocCodeAndDataSource,
    getTndsServicesByNocAndModes,
} from '../data/auroradb';
import { redirectTo } from '../utils/apiUtils';

const title = 'CSV Zone Upload - Create Fares Data Service';
const description = 'CSV Zone Upload page of the Create Fares Data Service';

const CsvZoneUpload = ({ errors, ...uploadProps }: UserDataUploadsProps): ReactElement => (
    <BaseLayout title={title} description={description} errors={errors}>
        <UserDataUploadComponent
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...uploadProps}
            errors={errors}
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

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: UserDataUploadsProps }> => {
    const fareZoneAttribute = getSessionAttribute(ctx.req, FARE_ZONE_ATTRIBUTE);
    const errors: ErrorInfo[] =
        fareZoneAttribute && isFareZoneAttributeWithErrors(fareZoneAttribute) ? fareZoneAttribute.errors : [];

    const nocCode = getAndValidateNoc(ctx);
    //updateSessionAttribute(ctx.req, SERVICE_LIST_EXEMPTION_ATTRIBUTE, undefined);
    const serviceListAttribute = getSessionAttribute(ctx.req, SERVICE_LIST_EXEMPTION_ATTRIBUTE);
    let dataSourceAttribute = getSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE);
    const serviceListErrors =
        serviceListAttribute && isServiceListAttributeWithErrors(serviceListAttribute)
            ? serviceListAttribute.errors
            : [];

    const modesAttribute = getSessionAttribute(ctx.req, MULTI_MODAL_ATTRIBUTE);

    if (!dataSourceAttribute) {
        const services = await getAllServicesByNocCode(nocCode);
        const hasBodsServices = services.some((service) => service.dataSource && service.dataSource === 'bods');

        if (!hasBodsServices && !modesAttribute) {
            if (ctx.res) {
                redirectTo(ctx.res, '/noServices');
            } else {
                throw new Error(`No services found for NOC Code: ${nocCode}`);
            }
        }
        // removed as TNDS is being disabled until further notice
        // const hasTndsServices = services.some((service) => service.dataSource && service.dataSource === 'tnds');
        updateSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE, {
            source: hasBodsServices ? 'bods' : 'tnds',
            hasBods: true,
            hasTnds: false,
        });
        dataSourceAttribute = getSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE) as TxcSourceAttribute;
    }

    //const { selectAll } = ctx.query;

    const selectedServices =
        serviceListAttribute &&
        !isServiceListAttributeWithErrors(serviceListAttribute) &&
        'selectedServices' in serviceListAttribute
            ? serviceListAttribute.selectedServices
            : [];
    let chosenDataSourceServices;
    if (modesAttribute) {
        chosenDataSourceServices = await getTndsServicesByNocAndModes(nocCode, modesAttribute.modes);
    }
    chosenDataSourceServices = await getServicesByNocCodeAndDataSource(nocCode, dataSourceAttribute.source);

    const selectedLineIds = selectedServices.map((service) => service.lineId);
    //console.log(chosenDataSourceServices);
    //console.log({ selectedServices });
    //const selectAll = true;
    const serviceList: ServicesInfo[] = chosenDataSourceServices.map((service) => {
        return {
            ...service,
            checked: selectedLineIds.includes(service.lineId),
        };
    });
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
            errors: [...errors],
            detailSummary: "My fare zone won't upload",
            csrfToken: getCsrfToken(ctx),
            backHref: '',
            showPriceOption: true,
            serviceList,
            buttonText: serviceList.every((service) => service.checked)
                ? 'Unselect All Services'
                : 'Select All Services',
            dataSourceAttribute,
            isFareZone: true,
            clickedYes: serviceList.some((service) => service.checked) || serviceListErrors.length > 0,
        },
    };
};

export default CsvZoneUpload;
