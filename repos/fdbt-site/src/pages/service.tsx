import React, { ReactElement } from 'react';
import upperFirst from 'lodash/upperFirst';
import { ErrorInfo, NextPageContextWithSession, ServiceType, TxcSourceAttribute } from '../interfaces';
import FormElementWrapper from '../components/FormElementWrapper';
import TwoThirdsLayout from '../layout/Layout';
import {
    OPERATOR_ATTRIBUTE,
    SERVICE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
} from '../constants/attributes';
import { getServicesByNocCodeAndDataSource } from '../data/auroradb';
import ErrorSummary from '../components/ErrorSummary';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import CsrfForm from '../components/CsrfForm';
import { isPassengerType, isServiceAttributeWithErrors } from '../interfaces/typeGuards';
import { getSessionAttribute } from '../utils/sessions';
import { redirectTo } from './api/apiUtils';
// import SwitchDataSource from '../components/SwitchDataSource';

const title = 'Service - Create Fares Data Service';
const description = 'Service selection page of the Create Fares Data Service';
const errorId = 'service';

interface ServiceProps {
    operator: string;
    passengerType: string;
    services: ServiceType[];
    error: ErrorInfo[];
    dataSourceAttribute: TxcSourceAttribute;
    csrfToken: string;
}

const Service = ({
    operator,
    passengerType,
    services,
    dataSourceAttribute,
    error,
    csrfToken,
}: ServiceProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={error}>
        <CsrfForm action="/api/service" method="post" csrfToken={csrfToken}>
            <>
                <label htmlFor="service">
                    <h1 className="govuk-heading-l" id="service-page-heading">
                        Select a service
                    </h1>
                </label>
                <span className="govuk-hint" id="service-operator-passenger-type-hint">
                    {operator} - {upperFirst(passengerType)}
                </span>
                <ErrorSummary errors={error} />
                <div className={`govuk-form-group ${error.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <FormElementWrapper errors={error} errorId={errorId} errorClass="govuk-select--error">
                        <select className="govuk-select" id="service" name="service" defaultValue="">
                            <option value="" disabled>
                                Select One
                            </option>
                            {services.map(service => (
                                <option
                                    key={`${service.lineName}#${service.startDate}`}
                                    value={`${service.lineName}#${service.startDate}`}
                                    className="service-option"
                                >
                                    {service.lineName} - Start date {service.startDate}
                                </option>
                            ))}
                        </select>
                    </FormElementWrapper>
                    <span className="govuk-hint hint-text" id="traveline-hint">
                        This data is taken from the{' '}
                        <b>
                            {dataSourceAttribute.source === 'tnds'
                                ? 'Traveline National Dataset (TNDS)'
                                : 'Bus Open Data Service (BODS)'}
                        </b>
                        . If the service you are looking for is not listed, contact the BODS help desk for advice{' '}
                        <a href="/contact">here</a>
                    </span>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
        {/* <SwitchDataSource dataSourceAttribute={dataSourceAttribute} pageUrl="/service" csrfToken={csrfToken} /> */}
    </TwoThirdsLayout>
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: ServiceProps }> => {
    const csrfToken = getCsrfToken(ctx);

    const serviceAttribute = getSessionAttribute(ctx.req, SERVICE_ATTRIBUTE);

    const error: ErrorInfo[] =
        serviceAttribute && isServiceAttributeWithErrors(serviceAttribute) ? serviceAttribute.errors : [];

    const operatorAttribute = getSessionAttribute(ctx.req, OPERATOR_ATTRIBUTE);
    const nocCode = getAndValidateNoc(ctx);

    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);

    if (!operatorAttribute?.name || !isPassengerType(passengerTypeAttribute) || !nocCode) {
        throw new Error('Could not render the service selection page. Necessary attributes not found.');
    }

    const dataSourceAttribute = getSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE);
    if (!dataSourceAttribute) {
        throw new Error('Data source attribute not found');
    }
    const services = await getServicesByNocCodeAndDataSource(nocCode, dataSourceAttribute?.source);

    if (services.length === 0) {
        if (ctx.res) {
            redirectTo(ctx.res, '/noServices');
        } else {
            throw new Error(`No services found in TNDS or BODS for NOC Code: ${nocCode}`);
        }
    }

    return {
        props: {
            operator: operatorAttribute.name,
            passengerType: passengerTypeAttribute.passengerType,
            services,
            error,
            dataSourceAttribute,
            csrfToken,
        },
    };
};

export default Service;
