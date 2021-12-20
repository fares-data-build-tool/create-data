import React, { ReactElement } from 'react';
import { TicketType } from 'fdbt-types/matchingJsonTypes';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import RadioButtons from '../components/RadioButtons';
import {
    CARNET_FARE_TYPE_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
} from '../constants/attributes';
import { ErrorInfo, FareType, NextPageContextWithSession } from '../interfaces';
import { isTicketRepresentationWithErrors } from '../interfaces/typeGuards';
import TwoThirdsLayout from '../layout/Layout';
import { getCsrfToken, isSchemeOperator } from '../utils';
import { getSessionAttribute } from '../utils/sessions';

const title = 'Ticket Representation - Create Fares Data Service';
const description = 'Ticket Representation selection page of the Create Fares Data Service';

interface TicketRepresentationProps {
    fareType: TicketType;
    errors: ErrorInfo[];
    csrfToken: string;
    showHybrid: boolean;
    showPointToPoint: boolean;
}

const getFareTypeDesc = (fareType: TicketType) => {
    switch (fareType) {
        case 'multiOperator':
            return 'multi-operator';
        case 'flatFare':
            return 'flat fare';
        default:
            return fareType;
    }
};

const TicketRepresentation = ({
    fareType,
    errors = [],
    csrfToken,
    showHybrid,
    showPointToPoint,
}: TicketRepresentationProps): ReactElement => {
    const fareTypeDesc = getFareTypeDesc(fareType);

    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/ticketRepresentation" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="ticket-representation-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="ticket-representation-page-heading">
                                    {`Select a type of ${fareTypeDesc} ticket`}
                                </h1>
                            </legend>
                            <FormElementWrapper errors={errors} errorId="geo-zone" errorClass="govuk-radios--errors">
                                <RadioButtons
                                    inputName="ticketType"
                                    options={[
                                        {
                                            value: 'geoZone',
                                            label: 'A ticket within a geographical zone',
                                            hint: 'Unlimited travel within a geographical zone',
                                        },
                                        {
                                            value: 'multipleServices',
                                            label: 'A ticket for a set of services',
                                            hint: 'Unlimited travel on specific service or set of services',
                                        },
                                        ...(showPointToPoint
                                            ? [
                                                  {
                                                      value: 'pointToPointPeriod',
                                                      label: 'Point to Point',
                                                      hint: 'Unlimited travel between two fixed points in both directions',
                                                  },
                                              ]
                                            : []),
                                        ...(showHybrid
                                            ? [
                                                  {
                                                      value: 'hybrid',
                                                      label: 'Hybrid period ticket',
                                                      hint: 'Unlimited travel within a geographic zone and certain additional services outside that zone',
                                                  },
                                              ]
                                            : []),
                                    ]}
                                />
                            </FormElementWrapper>
                        </fieldset>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: TicketRepresentationProps } => {
    const csrfToken = getCsrfToken(ctx);
    const { fareType } = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE) as FareType;
    const ticketType = getSessionAttribute(ctx.req, TICKET_REPRESENTATION_ATTRIBUTE);
    const isCarnet = getSessionAttribute(ctx.req, CARNET_FARE_TYPE_ATTRIBUTE);
    const isScheme = isSchemeOperator(ctx);

    return {
        props: {
            fareType,
            errors: ticketType && isTicketRepresentationWithErrors(ticketType) ? ticketType.errors : [],
            csrfToken,
            showHybrid: fareType === 'period' && !isScheme,
            showPointToPoint: fareType === 'period' && !isCarnet && !isScheme,
        },
    };
};

export default TicketRepresentation;
