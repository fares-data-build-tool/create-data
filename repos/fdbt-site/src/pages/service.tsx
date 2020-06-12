import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import { ErrorInfo, CustomAppProps } from '../interfaces';
import FormElementWrapper from '../components/FormElementWrapper';
import TwoThirdsLayout from '../layout/Layout';
import { OPERATOR_COOKIE, SERVICE_COOKIE, PASSENGER_TYPE_COOKIE } from '../constants';
import { getServicesByNocCode, ServiceType } from '../data/auroradb';
import ErrorSummary from '../components/ErrorSummary';
import { getNocFromIdToken } from '../utils';
import CsrfForm from '../components/CsrfForm';

const title = 'Service - Fares Data Build Tool';
const description = 'Service selection page of the Fares Data Build Tool';
const errorId = 'service-error';

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
                    <fieldset className="govuk-fieldset" aria-describedby="service-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="service-page-heading">
                                Select a service
                            </h1>
                        </legend>
                        <span className="govuk-hint" id="service-operator-passengertype-hint">
                            {operator} - {passengerType}
                        </span>
                        <FormElementWrapper errors={error} errorId={errorId} errorClass="govuk-radios--error">
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
                            This data is taken from the Traveline National Dataset
                        </span>
                    </fieldset>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = async (ctx: NextPageContext): Promise<{ props: ServiceProps }> => {
    const cookies = parseCookies(ctx);
    const serviceCookie = cookies[SERVICE_COOKIE];
    const error: ErrorInfo[] = [];
    if (serviceCookie) {
        const serviceInfo = JSON.parse(serviceCookie);
        if (serviceInfo.errorMessage) {
            const errorInfo: ErrorInfo = { errorMessage: serviceInfo.errorMessage, id: errorId };
            error.push(errorInfo);
        }
    }

    const operatorCookie = cookies[OPERATOR_COOKIE];
    const passengerTypeCookie = cookies[PASSENGER_TYPE_COOKIE];
    const nocCode = getNocFromIdToken(ctx);

    if (!operatorCookie || !passengerTypeCookie || !nocCode) {
        throw new Error('Necessary cookies not found to show matching page');
    }

    const operatorInfo = JSON.parse(operatorCookie);
    const { operator } = operatorInfo;
    const passengerTypeInfo = JSON.parse(passengerTypeCookie);
    const { passengerType } = passengerTypeInfo;

    const services = await getServicesByNocCode(nocCode);

    if (services.length === 0) {
        throw new Error(`No services found for NOC Code: ${nocCode}`);
    }

    return { props: { operator: operator.operatorPublicName, passengerType, services, error } };
};

export default Service;
