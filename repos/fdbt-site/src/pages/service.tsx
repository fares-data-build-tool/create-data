import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import upperFirst from 'lodash/upperFirst';
import { ErrorInfo, CustomAppProps, NextPageContextWithSession } from '../interfaces';
import FormElementWrapper from '../components/FormElementWrapper';
import TwoThirdsLayout from '../layout/Layout';
import { OPERATOR_COOKIE, SERVICE_ATTRIBUTE, PASSENGER_TYPE_ATTRIBUTE } from '../constants';
import { getServicesByNocCode, ServiceType } from '../data/auroradb';
import ErrorSummary from '../components/ErrorSummary';
import { getAndValidateNoc } from '../utils';
import CsrfForm from '../components/CsrfForm';
import { isPassengerType, isServiceAttributeWithErrors } from '../interfaces/typeGuards';
import { getSessionAttribute } from '../utils/sessions';

const title = 'Service - Fares Data Build Tool';
const description = 'Service selection page of the Fares Data Build Tool';
const errorId = 'service';

type ServiceProps = {
    operator: string;
    passengerType: string;
    services: ServiceType[];
    error: ErrorInfo[];
};

const Service = ({
    operator,
    passengerType,
    services,
    error,
    csrfToken,
}: ServiceProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={error}>
        <CsrfForm action="/api/service" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={error} />
                <div className={`govuk-form-group ${error.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <label htmlFor="service">
                        <h1 className="govuk-heading-l" id="service-page-heading">
                            Select a service
                        </h1>
                    </label>

                    <span className="govuk-hint" id="service-operator-passenger-type-hint">
                        {operator} - {upperFirst(passengerType)}
                    </span>
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
                        This data is taken from the Traveline National Dataset (TNDS). If any of your services are not
                        listed, contact your local transport authority for further advice.
                    </span>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: ServiceProps }> => {
    const cookies = parseCookies(ctx);

    const serviceAttribute = getSessionAttribute(ctx.req, SERVICE_ATTRIBUTE);

    const error: ErrorInfo[] =
        serviceAttribute && isServiceAttributeWithErrors(serviceAttribute) ? serviceAttribute.errors : [];

    const operatorCookie = cookies[OPERATOR_COOKIE];
    const nocCode = getAndValidateNoc(ctx);

    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);

    if (!operatorCookie || !isPassengerType(passengerTypeAttribute) || !nocCode) {
        throw new Error('Could not render the service selection page. Necessary cookies not found.');
    }

    const operatorInfo = JSON.parse(operatorCookie);
    const { operator } = operatorInfo;

    const services = await getServicesByNocCode(nocCode);

    if (services.length === 0) {
        throw new Error(`No services found for NOC Code: ${nocCode}`);
    }

    return {
        props: {
            operator: operator.operatorPublicName,
            passengerType: passengerTypeAttribute.passengerType,
            services,
            error,
        },
    };
};

export default Service;
