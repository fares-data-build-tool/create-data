import React, { ReactElement, useState } from 'react';
import { BaseLayout } from '../layout/Layout';
import UserDataUploadComponent from '../components/UserDataUploads';
import {
    FARE_ZONE_ATTRIBUTE,
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
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
import FormElementWrapper from '../components/FormElementWrapper';
import BackButton from '../components/BackButton';
import ErrorSummary from '../components/ErrorSummary';
import FileAttachment from '../components/FileAttachment';
import guidanceDocImage from '../assets/images/Guidance-doc-front-page.png';
import csvImage from '../assets/images/csv.png';
import CsrfForm from '../components/CsrfForm';

const title = 'CSV Zone Upload - Create Fares Data Service';
const description = 'CSV Zone Upload page of the Create Fares Data Service';

interface CSVZoneUploadProps extends UserDataUploadsProps {
    serviceList: ServicesInfo[];
    buttonText: string;
    dataSourceAttribute: TxcSourceAttribute;
    clickedYes: boolean;
    backHref: string;
    guidanceDocDisplayName: string;
    guidanceDocAttachmentUrl: string;
    guidanceDocSize: string;
    csvTemplateDisplayName: string;
    csvTemplateAttachmentUrl: string;
    csvTemplateSize: string;
    csrfToken: string;
}

const CsvZoneUpload = ({
    errors,
    serviceList,
    clickedYes,
    dataSourceAttribute,
    buttonText,
    backHref,
    guidanceDocDisplayName,
    guidanceDocAttachmentUrl,
    guidanceDocSize,
    csvTemplateDisplayName,
    csvTemplateAttachmentUrl,
    csvTemplateSize,
    csrfToken,
    ...uploadProps
}: CSVZoneUploadProps): ReactElement => {
    const seen: string[] = [];
    const uniqueServiceLists =
        serviceList.filter((item) => (seen.includes(item.lineId) ? false : seen.push(item.lineId))) ?? [];

    const [getButtonText, updateButtonText] = useState(buttonText);
    const [checkedServices, updateChecked] = useState(uniqueServiceLists.filter((service) => service.checked));

    const toggleAllServices = (): void => {
        if (checkedServices.length !== uniqueServiceLists.length && getButtonText === 'Select All Services') {
            updateButtonText('Unselect All Services');
            updateChecked(uniqueServiceLists);
        } else {
            updateButtonText('Select All Services');
            updateChecked([]);
        }
    };

    const updateCheckedServiceList = (e: React.ChangeEvent<HTMLInputElement>, lineId: string) => {
        if (!e.target.checked) {
            updateChecked(checkedServices.filter((service) => service.lineId !== lineId));
        } else {
            const serviceToAdd = uniqueServiceLists.find((service) => service.lineId === lineId);
            if (serviceToAdd) {
                updateChecked([...checkedServices, serviceToAdd]);
            }
        }
    };

    return (
        <BaseLayout title={title} description={description} errors={errors}>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    {!!backHref && errors.length === 0 ? <BackButton href={backHref} /> : null}
                    <ErrorSummary errors={errors} />
                    <CsrfForm
                        action="/api/csvZoneUpload"
                        method="post"
                        encType="multipart/form-data"
                        csrfToken={csrfToken}
                    >
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
                                        Use the help file document for a more detailed help on constructing a fare zone
                                        CSV in the required format or download the .csv template to create a new file.
                                    </p>
                                </>
                            }
                        />

                        <div>
                            <div className="govuk-warning-text">
                                <span className="govuk-warning-text__icon" aria-hidden="true">
                                    !
                                </span>
                                <strong className="govuk-warning-text__text">
                                    <span className="govuk-warning-text__assistive">Warning</span>
                                    If there are services exempt, you can omit them by selecting yes below and selecting
                                    the services you want to omit.
                                </strong>
                            </div>
                            <div className="govuk-form-group">
                                <fieldset className="govuk-fieldset">
                                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                                        <h2 className="govuk-fieldset__heading">
                                            Are there services within this zone which are not included?
                                        </h2>
                                    </legend>
                                    <FormElementWrapper
                                        errorId="checkbox-0"
                                        errorClass="govuk-form-group--error"
                                        errors={errors}
                                    >
                                        <div className="govuk-radios" data-module="govuk-radios">
                                            <div className="govuk-radios__item">
                                                <input
                                                    className="govuk-radios__input"
                                                    id="yes"
                                                    name="exempt"
                                                    type="radio"
                                                    value="yes"
                                                    data-aria-controls="conditional-yes"
                                                    defaultChecked={clickedYes}
                                                />
                                                <label className="govuk-label govuk-radios__label" htmlFor="yes">
                                                    Yes
                                                </label>
                                            </div>
                                            <div
                                                className="govuk-radios__conditional govuk-radios__conditional--hidden"
                                                id="conditional-yes"
                                            >
                                                <div className="govuk-form-group">
                                                    <fieldset className="govuk-fieldset">
                                                        <input
                                                            type="button"
                                                            name="selectAll"
                                                            value={getButtonText}
                                                            id="select-all-button"
                                                            className="govuk-button govuk-button--secondary"
                                                            onClick={toggleAllServices}
                                                        />
                                                        <div className="govuk-checkboxes">
                                                            {uniqueServiceLists.map((service, index) => {
                                                                const {
                                                                    lineName,
                                                                    lineId,
                                                                    serviceCode,
                                                                    description,
                                                                    checked,
                                                                    origin,
                                                                    destination,
                                                                } = service;

                                                                const checkboxTitles =
                                                                    dataSourceAttribute &&
                                                                    dataSourceAttribute.source === 'tnds'
                                                                        ? `${lineName} - ${description}`
                                                                        : `${lineName} ${origin || 'N/A'} - ${
                                                                              destination || 'N/A'
                                                                          }`;

                                                                const checkBoxValues = `${description}`;

                                                                return (
                                                                    <div
                                                                        className="govuk-checkboxes__item"
                                                                        key={`checkbox-item-${lineName}`}
                                                                    >
                                                                        <input
                                                                            className="govuk-checkboxes__input"
                                                                            id={`checkbox-${index}`}
                                                                            name={`${lineName}#${lineId}#${serviceCode}`}
                                                                            type="checkbox"
                                                                            value={checkBoxValues}
                                                                            checked={
                                                                                !!checkedServices.find(
                                                                                    (service) =>
                                                                                        service.lineId === lineId,
                                                                                )
                                                                            }
                                                                            defaultChecked={checked}
                                                                            onChange={(e) =>
                                                                                updateCheckedServiceList(e, lineId)
                                                                            }
                                                                        />
                                                                        <label
                                                                            className="govuk-label govuk-checkboxes__label"
                                                                            htmlFor={`checkbox-${index}`}
                                                                        >
                                                                            {checkboxTitles}
                                                                        </label>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </fieldset>
                                                </div>
                                            </div>
                                            <div className="govuk-radios__item">
                                                <input
                                                    className="govuk-radios__input"
                                                    id="no"
                                                    name="exempt"
                                                    type="radio"
                                                    value="no"
                                                    defaultChecked={!clickedYes}
                                                />
                                                <label className="govuk-label govuk-radios__label" htmlFor="no">
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    </FormElementWrapper>
                                </fieldset>
                            </div>
                        </div>
                    </CsrfForm>
                </div>

                <div className="govuk-grid-column-one-third">
                    <h2 className="govuk-heading-s">Help documents</h2>
                    <FileAttachment
                        displayName={guidanceDocDisplayName}
                        attachmentUrl={`${guidanceDocAttachmentUrl}`}
                        imageUrl={guidanceDocImage}
                        size={guidanceDocSize}
                    />
                    <FileAttachment
                        displayName={csvTemplateDisplayName}
                        attachmentUrl={`${csvTemplateAttachmentUrl}`}
                        imageUrl={csvImage}
                        size={csvTemplateSize}
                    />
                </div>
            </div>
        </BaseLayout>
    );
};

export const isFareZoneAttributeWithErrors = (
    fareZoneAttribute: string | FareZoneWithErrors,
): fareZoneAttribute is FareZoneWithErrors => (fareZoneAttribute as FareZoneWithErrors).errors !== undefined;

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: CSVZoneUploadProps }> => {
    const fareZoneAttribute = getSessionAttribute(ctx.req, FARE_ZONE_ATTRIBUTE);
    const errors: ErrorInfo[] =
        fareZoneAttribute && isFareZoneAttributeWithErrors(fareZoneAttribute) ? fareZoneAttribute.errors : [];

    const ticket = getSessionAttribute(ctx.req, MATCHING_JSON_ATTRIBUTE);
    const matchingJsonMetaData = getSessionAttribute(ctx.req, MATCHING_JSON_META_DATA_ATTRIBUTE);

    const backHref =
        ticket && matchingJsonMetaData ? `/products/productDetails?productId=${matchingJsonMetaData?.productId}` : '';

    const nocCode = getAndValidateNoc(ctx);
    const serviceListAttribute = getSessionAttribute(ctx.req, SERVICE_LIST_EXEMPTION_ATTRIBUTE);
    let dataSourceAttribute = getSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE);

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
    const serviceList: ServicesInfo[] = chosenDataSourceServices.map((service) => {
        return {
            ...service,
            checked: selectedLineIds.includes(service.lineId),
        };
    });

    const commonProps = {
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
        backHref,
        dataSourceAttribute,
    };

    const getButtonText = (serviceList: ServicesInfo[]) => {
        return serviceList.every((service) => service.checked) ? 'Unselect All Services' : 'Select All Services';
    };

    const hasClickedYes = (serviceList: ServicesInfo[]) => {
        return serviceList.some((service) => service.checked);
    };

    if (ticket && matchingJsonMetaData) {
        let services: string[] = [];
        if ('exemptedServices' in ticket && ticket.exemptedServices) {
            services = ticket.exemptedServices.map((service) => {
                return service.lineId;
            });
        }

        const serviceListEdit: ServicesInfo[] = chosenDataSourceServices.map((service) => {
            return {
                ...service,
                checked: services.includes(service.lineId),
            };
        });
        return {
            props: {
                ...commonProps,
                serviceList: serviceListEdit,
                buttonText: getButtonText(serviceListEdit),
                clickedYes: hasClickedYes(serviceListEdit),
            },
        };
    }
    return {
        props: {
            ...commonProps,
            serviceList,
            buttonText: getButtonText(serviceList),
            clickedYes: hasClickedYes(serviceList),
        },
    };
};

export default CsvZoneUpload;
