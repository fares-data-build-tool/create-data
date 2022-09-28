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
    RETURN_SERVICE_ATTRIBUTE,
} from '../constants/attributes';
import { getServiceByIdAndDataSource, getServicesByNocCodeAndDataSource } from '../data/auroradb';
import ErrorSummary from '../components/ErrorSummary';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import CsrfForm from '../components/CsrfForm';
import { isPassengerType, isWithErrors } from '../interfaces/typeGuards';
import { getSessionAttribute, getRequiredSessionAttribute } from '../utils/sessions';
import { redirectTo } from '../utils/apiUtils';

const title = 'Return Service - Create Fares Data Service';
const description = 'Service selection page of the Create Fares Data Service';
const errorId = 'returnService';

interface ReturnServiceProps {
    operator: string;
    passengerType: string;
    services: ServiceType[];
    error: ErrorInfo[];
    dataSourceAttribute: TxcSourceAttribute;
    csrfToken: string;
    selectedServiceId: number;
}

const ReturnService = ({
    operator,
    passengerType,
    services,
    dataSourceAttribute,
    error,
    csrfToken,
    selectedServiceId,
}: ReturnServiceProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={error}>
        <CsrfForm action="/api/returnService" method="post" csrfToken={csrfToken}>
            <>
                <label htmlFor="service">
                    <h1 className="govuk-heading-l" id="service-page-heading">
                        Select another service for return leg
                    </h1>
                </label>
                <span className="govuk-hint" id="service-operator-passenger-type-hint">
                    {operator} - {upperFirst(passengerType)}
                </span>
                <ErrorSummary errors={error} />
                <div className={`govuk-form-group ${error.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <FormElementWrapper errors={error} errorId={errorId} errorClass="govuk-select--error">
                        <select
                            className="govuk-select"
                            id="service"
                            name="serviceId"
                            defaultValue={error.length > 0 && error[0].userInput ? error[0].userInput : undefined}
                        >
                            <option value="" disabled>
                                Select One
                            </option>
                            {services
                                .filter((service) => {
                                    return service.id != selectedServiceId;
                                })
                                .map((service) => (
                                    <option key={`${service.id}`} value={`${service.id}`} className="service-option">
                                        {dataSourceAttribute.source === 'tnds'
                                            ? `${service.lineName} - Start date ${service.startDate}`
                                            : `${service.lineName} ${service.origin || 'N/A'} - ${
                                                  service.destination || 'N/A'
                                              } (Start date ${service.startDate})`}
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
        {/* removed as TNDS is being disabled until further notice */}
        {/* <SwitchDataSource
            dataSourceAttribute={dataSourceAttribute}
            pageUrl="/returnService"
            attributeVersion="baseOperator"
            csrfToken={csrfToken}
        /> */}
    </TwoThirdsLayout>
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: ReturnServiceProps }> => {
    const csrfToken = getCsrfToken(ctx);

    const returnServiceAttribute = getSessionAttribute(ctx.req, RETURN_SERVICE_ATTRIBUTE);
    const selectedServiceAttribute = getSessionAttribute(ctx.req, SERVICE_ATTRIBUTE);

    const error: ErrorInfo[] =
        returnServiceAttribute && isWithErrors(returnServiceAttribute) ? returnServiceAttribute.errors : [];

    const operatorAttribute = getSessionAttribute(ctx.req, OPERATOR_ATTRIBUTE);
    const nocCode = getAndValidateNoc(ctx);

    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);

    if (!operatorAttribute?.name || !isPassengerType(passengerTypeAttribute) || !nocCode) {
        throw new Error('Could not render the service selection page. Necessary attributes not found.');
    }

    const dataSourceAttribute = getRequiredSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE);
    const services = await getServicesByNocCodeAndDataSource(nocCode, dataSourceAttribute.source);

    if (services.length === 0) {
        if (ctx.res) {
            redirectTo(ctx.res, '/noServices');
        } else {
            throw new Error(`No services found in TNDS or BODS for NOC Code: ${nocCode}`);
        }
    }

    const dataSource = dataSourceAttribute.source;

    const servicesWithOneDirection = (
        await Promise.all(
            services.map(async (service) => {
                const rawService = await getServiceByIdAndDataSource(nocCode, service.id, dataSource);

                const directions = Array.from(
                    rawService.journeyPatterns.reduce((set, pattern) => {
                        set.add(pattern.direction);
                        return set;
                    }, new Set<string>()),
                );

                const outboundDirection = directions.find((it) => ['outbound', 'clockwise'].includes(it));
                const inboundDirection = directions.find((it) => ['inbound', 'antiClockwise'].includes(it));

                if (!inboundDirection || !outboundDirection) {
                    return service;
                }

                return;
            }),
        )
    ).filter((service) => service !== undefined);

    return {
        props: {
            operator: operatorAttribute.name,
            passengerType: passengerTypeAttribute.passengerType,
            services: servicesWithOneDirection as ServiceType[],
            error,
            dataSourceAttribute,
            csrfToken,
            selectedServiceId:
                selectedServiceAttribute && 'id' in selectedServiceAttribute ? selectedServiceAttribute.id : 0,
        },
    };
};

export default ReturnService;
