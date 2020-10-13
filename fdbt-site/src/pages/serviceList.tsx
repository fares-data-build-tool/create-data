import React, { ReactElement } from 'react';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { FullColumnLayout } from '../layout/Layout';
import { SERVICE_LIST_ATTRIBUTE, FARE_TYPE_ATTRIBUTE } from '../constants';
import { ServiceType, getServicesByNocCode } from '../data/auroradb';
import { CustomAppProps, ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { getAndValidateNoc } from '../utils';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { ServiceListAttribute, ServiceListAttributeWithErrors } from './api/serviceList';
import { FareType } from './api/fareType';

const pageTitle = 'Service List - Fares Data Build Tool';
const pageDescription = 'Service List selection page of the Fares Data Build Tool';

export interface ServicesInfo extends ServiceType {
    checked?: boolean;
}

export interface ServiceListProps {
    serviceList: ServicesInfo[];
    buttonText: string;
    errors: ErrorInfo[];
    multiOp: boolean;
}

const ServiceList = ({
    serviceList,
    buttonText,
    csrfToken,
    errors,
    multiOp,
}: ServiceListProps & CustomAppProps): ReactElement => (
    <FullColumnLayout title={pageTitle} description={pageDescription}>
        <CsrfForm action="/api/serviceList" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <fieldset className="govuk-fieldset">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                            <h1 className="govuk-heading-l" id="service-list-page-heading">
                                Which {multiOp ? 'of your ' : ''}services is the ticket valid for?
                            </h1>
                        </legend>

                        <span className="govuk-heading-s">
                            Select all {multiOp ? 'of your ' : ''}services that apply
                        </span>

                        <input
                            type="submit"
                            name="selectAll"
                            value={buttonText}
                            id="select-all-button"
                            className="govuk-button govuk-button--secondary"
                        />
                        <span className="govuk-hint" id="traveline-hint">
                            This data is taken from the Traveline National Dataset.
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
    const nocCode = getAndValidateNoc(ctx);
    const serviceListAttribute = getSessionAttribute(ctx.req, SERVICE_LIST_ATTRIBUTE);

    if (!nocCode) {
        throw new Error('Necessary cookies not found to show serviceList page');
    }

    const services = await getServicesByNocCode(nocCode);

    const { selectAll } = ctx.query;

    const serviceList: ServicesInfo[] = services.map(service => {
        return {
            ...service,
            checked: !selectAll || (selectAll !== 'true' && selectAll !== 'false') ? false : selectAll !== 'false',
        };
    });

    const { fareType } = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE) as FareType;
    const multiOp = fareType === 'multiOp';

    return {
        props: {
            serviceList,
            buttonText: selectAll === 'true' ? 'Unselect All Services' : 'Select All Services',
            errors:
                serviceListAttribute && isServiceListAttributeWithErrors(serviceListAttribute)
                    ? serviceListAttribute.errors
                    : [],
            multiOp,
        },
    };
};

export default ServiceList;
