import React, { ReactElement } from 'react';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { FullColumnLayout } from '../layout/Layout';
import {
    SERVICE_LIST_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
} from '../constants/attributes';
import { getAllServicesByNocCode, getServicesByNocCodeAndDataSource } from '../data/auroradb';
import {
    ErrorInfo,
    NextPageContextWithSession,
    ServicesInfo,
    FareType,
    ServiceListAttribute,
    ServiceListAttributeWithErrors,
    TxcSourceAttribute,
} from '../interfaces';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import { redirectTo } from '../utils/apiUtils';
import BackButton from '../components/BackButton';

const pageTitle = 'Service List - Create Fares Data Service';
const pageDescription = 'Service List selection page of the Create Fares Data Service';

interface ServiceListProps {
    serviceList: ServicesInfo[];
    buttonText: string;
    errors: ErrorInfo[];
    multiOperator: boolean;
    dataSourceAttribute: TxcSourceAttribute;
    csrfToken: string;
    additional: boolean;
    backHref: string;
}

const ServiceList = ({
    serviceList,
    buttonText,
    csrfToken,
    errors,
    multiOperator,
    dataSourceAttribute,
    additional,
    backHref,
}: ServiceListProps): ReactElement => {
    const multiOperatorText = multiOperator ? 'of your ' : '';
    const seen: string[] = [];
    const uniqueServiceLists =
        serviceList?.filter((item) => (seen.includes(item.lineId) ? false : seen.push(item.lineId))) ?? [];

    return (
        <FullColumnLayout title={pageTitle} description={pageDescription}>
            {/* removed as TNDS is being disabled until further notice */}
            {/* {!editMode && (
                <SwitchDataSource
                    dataSourceAttribute={dataSourceAttribute}
                    pageUrl="/serviceList"
                    attributeVersion="baseOperator"
                    csrfToken={csrfToken}
                />
            )} */}
            {!!backHref && errors.length === 0 ? <BackButton href={backHref} /> : null}
            <CsrfForm action="/api/serviceList" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                            <h1 className="govuk-heading-l" id="service-list-page-heading">
                                Which {additional ? 'additional ' : multiOperatorText}services is the ticket valid for?
                            </h1>
                        </legend>

                        <span className="govuk-heading-s">Select all {multiOperatorText}services that apply</span>
                        <fieldset className="govuk-fieldset">
                            <input
                                type="submit"
                                name="selectAll"
                                value={buttonText}
                                id="select-all-button"
                                className="govuk-button govuk-button--secondary"
                            />
                            <span className="govuk-hint" id="txc-hint">
                                This data is taken from the{' '}
                                <b>
                                    {dataSourceAttribute.source === 'tnds'
                                        ? 'Traveline National Dataset (TNDS)'
                                        : 'Bus Open Data Service (BODS)'}
                                </b>
                                . If the service you are looking for is not listed, contact the BODS help desk for
                                advice <a href="/contact">here</a>.
                            </span>
                            <FormElementWrapper
                                errors={errors}
                                errorId="checkbox-0"
                                errorClass=""
                                addFormGroupError={false}
                            >
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
                                            dataSourceAttribute.source === 'tnds'
                                                ? `${lineName} - ${description}`
                                                : `${lineName} ${origin || 'N/A'} - ${destination || 'N/A'}`;

                                        const checkBoxValues = `${description}`;

                                        return (
                                            <div className="govuk-checkboxes__item" key={`checkbox-item-${lineName}`}>
                                                <input
                                                    className="govuk-checkboxes__input"
                                                    id={`checkbox-${index}`}
                                                    name={`${lineName}#${lineId}#${serviceCode}`}
                                                    type="checkbox"
                                                    value={checkBoxValues}
                                                    defaultChecked={checked}
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
                            </FormElementWrapper>
                        </fieldset>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </FullColumnLayout>
    );
};

export const isServiceListAttributeWithErrors = (
    serviceListAttribute: ServiceListAttribute | ServiceListAttributeWithErrors,
): serviceListAttribute is ServiceListAttributeWithErrors =>
    (serviceListAttribute as ServiceListAttributeWithErrors).errors !== undefined;

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: ServiceListProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const nocCode = getAndValidateNoc(ctx);
    const serviceListAttribute = getSessionAttribute(ctx.req, SERVICE_LIST_ATTRIBUTE);
    let dataSourceAttribute = getSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE);

    if (!dataSourceAttribute) {
        const services = await getAllServicesByNocCode(nocCode);
        const hasBodsServices = services.some((service) => service.dataSource && service.dataSource === 'bods');

        if (!hasBodsServices) {
            if (ctx.res) {
                redirectTo(ctx.res, '/noServices');
            } else {
                throw new Error(`No services found for NOC Code: ${nocCode}`);
            }
        }
        // removed as TNDS is being disabled until further notice
        // const hasTndsServices = services.some((service) => service.dataSource && service.dataSource === 'tnds');
        updateSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE, {
            source: 'bods',
            hasBods: true,
            hasTnds: false,
        });
        dataSourceAttribute = getSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE) as TxcSourceAttribute;
    }

    const { selectAll } = ctx.query;

    const chosenDataSourceServices = await getServicesByNocCodeAndDataSource(nocCode, dataSourceAttribute.source);

    const serviceList: ServicesInfo[] = chosenDataSourceServices.map((service) => {
        return {
            ...service,
            checked: !selectAll || (selectAll !== 'true' && selectAll !== 'false') ? false : selectAll !== 'false',
        };
    });

    const ticketJson = getSessionAttribute(ctx.req, MATCHING_JSON_ATTRIBUTE);
    const matchingJsonMetaData = getSessionAttribute(ctx.req, MATCHING_JSON_META_DATA_ATTRIBUTE);

    if (ticketJson && matchingJsonMetaData) {
        const backHref = `/products/productDetails?productId=${matchingJsonMetaData?.productId}${
            matchingJsonMetaData.serviceId ? `&serviceId=${matchingJsonMetaData?.serviceId}` : ''
        }`;

        let services: string[] = [];
        if ('selectedServices' in ticketJson) {
            services = ticketJson.selectedServices.map((service) => {
                return service.lineName;
            });
        }

        const serviceListEdit: ServicesInfo[] = chosenDataSourceServices.map((service) => {
            return {
                ...service,
                checked:
                    !selectAll || (selectAll !== 'true' && selectAll !== 'false')
                        ? services.includes(service.lineName)
                        : selectAll !== 'false',
            };
        });

        return {
            props: {
                serviceList: serviceListEdit,
                buttonText: selectAll === 'true' ? 'Unselect All Services' : 'Select All Services',
                errors:
                    serviceListAttribute && isServiceListAttributeWithErrors(serviceListAttribute)
                        ? serviceListAttribute.errors
                        : [],
                multiOperator: false,
                dataSourceAttribute,
                csrfToken,
                additional: false,
                backHref,
            },
        };
    }

    const { fareType } = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE) as FareType;
    const multiOperator = fareType === 'multiOperator';

    const ticket = getSessionAttribute(ctx.req, TICKET_REPRESENTATION_ATTRIBUTE);
    const additional = !!ticket && 'name' in ticket && ticket.name === 'hybrid';
    return {
        props: {
            serviceList,
            buttonText: selectAll === 'true' ? 'Unselect All Services' : 'Select All Services',
            errors:
                serviceListAttribute && isServiceListAttributeWithErrors(serviceListAttribute)
                    ? serviceListAttribute.errors
                    : [],
            multiOperator,
            dataSourceAttribute,
            csrfToken,
            additional,
            backHref: '',
        },
    };
};

export default ServiceList;
