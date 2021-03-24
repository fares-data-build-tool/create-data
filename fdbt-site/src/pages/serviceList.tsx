import React, { ReactElement } from 'react';
import SwitchDataSource from '../components/SwitchDataSource';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { FullColumnLayout } from '../layout/Layout';
import { SERVICE_LIST_ATTRIBUTE, FARE_TYPE_ATTRIBUTE, TXC_SOURCE_ATTRIBUTE } from '../constants/attributes';
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
import { redirectTo } from './api/apiUtils';

const pageTitle = 'Service List - Create Fares Data Service';
const pageDescription = 'Service List selection page of the Create Fares Data Service';

interface ServiceListProps {
    serviceList: ServicesInfo[];
    buttonText: string;
    errors: ErrorInfo[];
    multiOperator: boolean;
    dataSourceAttribute: TxcSourceAttribute;
    csrfToken: string;
}

const ServiceList = ({
    serviceList,
    buttonText,
    csrfToken,
    errors,
    multiOperator,
    dataSourceAttribute,
}: ServiceListProps): ReactElement => (
    <FullColumnLayout title={pageTitle} description={pageDescription}>
        <SwitchDataSource dataSourceAttribute={dataSourceAttribute} pageUrl="/serviceList" csrfToken={csrfToken} />
        <CsrfForm action="/api/serviceList" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                        <h1 className="govuk-heading-l" id="service-list-page-heading">
                            Which {multiOperator ? 'of your ' : ''}services is the ticket valid for?
                        </h1>
                    </legend>

                    <span className="govuk-heading-s">
                        Select all {multiOperator ? 'of your ' : ''}services that apply
                    </span>
                    <fieldset className="govuk-fieldset">
                        <input
                            type="submit"
                            name="selectAll"
                            value={buttonText}
                            id="select-all-button"
                            className="govuk-button govuk-button--secondary"
                        />
                        <span className="govuk-hint" id="traveline-hint">
                            This data is taken from the{' '}
                            <b>
                                {dataSourceAttribute.source === 'tnds'
                                    ? 'Traveline National Dataset (TNDS)'
                                    : 'Bus Open Data Service (BODS)'}
                            </b>
                            . If the service you are looking for is not listed, contact the BODS help desk for advice{' '}
                            <a href="/contact">here</a>.
                        </span>
                        <FormElementWrapper
                            errors={errors}
                            errorId="checkbox-0"
                            errorClass=""
                            addFormGroupError={false}
                        >
                            <div className="govuk-checkboxes">
                                {serviceList.map((service, index) => {
                                    const { lineName, startDate, serviceCode, description, checked } = service;

                                    let checkboxTitles = `${lineName} - ${description} (Start Date ${startDate})`;

                                    if (checkboxTitles.length > 110) {
                                        checkboxTitles = `${checkboxTitles.substr(0, checkboxTitles.length - 10)}...`;
                                    }
                                    const checkBoxValues = `${description}`;

                                    return (
                                        <div className="govuk-checkboxes__item" key={`checkbox-item-${lineName}`}>
                                            <input
                                                className="govuk-checkboxes__input"
                                                id={`checkbox-${index}`}
                                                name={`${lineName}#${serviceCode}#${startDate}`}
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

export const isServiceListAttributeWithErrors = (
    serviceListAttribute: ServiceListAttribute | ServiceListAttributeWithErrors,
): serviceListAttribute is ServiceListAttributeWithErrors =>
    (serviceListAttribute as ServiceListAttributeWithErrors).errors !== undefined;

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: ServiceListProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const nocCode = getAndValidateNoc(ctx);
    const serviceListAttribute = getSessionAttribute(ctx.req, SERVICE_LIST_ATTRIBUTE);

    const services = await getAllServicesByNocCode(nocCode);
    const hasBodsServices = services.some(service => service.dataSource && service.dataSource === 'bods');
    const hasTndsServices = services.some(service => service.dataSource && service.dataSource === 'tnds');

    if (services.length === 0) {
        if (ctx.res) {
            redirectTo(ctx.res, '/noServices');
        } else {
            throw new Error(`No services found for NOC Code: ${nocCode}`);
        }
    }

    let dataSourceAttribute = getSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE);

    if (!dataSourceAttribute) {
        updateSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE, {
            source: hasBodsServices && !hasTndsServices ? 'bods' : 'tnds',
            hasBods: hasBodsServices,
            hasTnds: hasTndsServices,
        });
        dataSourceAttribute = getSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE) as TxcSourceAttribute;
    }

    const { selectAll } = ctx.query;

    const chosenDataSourceServices = await getServicesByNocCodeAndDataSource(nocCode, dataSourceAttribute?.source);

    const serviceList: ServicesInfo[] = chosenDataSourceServices.map(service => {
        return {
            ...service,
            checked: !selectAll || (selectAll !== 'true' && selectAll !== 'false') ? false : selectAll !== 'false',
        };
    });

    const { fareType } = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE) as FareType;
    const multiOperator = fareType === 'multiOperator';

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
        },
    };
};

export default ServiceList;
