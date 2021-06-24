import React, { ReactElement } from 'react';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import RadioButtons from '../components/RadioButtons';
import { FARE_TYPE_ATTRIBUTE, TICKET_REPRESENTATION_ATTRIBUTE } from '../constants/attributes';
import { ErrorInfo, FareType, NextPageContextWithSession } from '../interfaces';
import { isTicketRepresentationWithErrors } from '../interfaces/typeGuards';
import TwoThirdsLayout from '../layout/Layout';
import { getCsrfToken } from '../utils';
import { getSessionAttribute } from '../utils/sessions';

const title = 'Ticket Representation - Create Fares Data Service';
const description = 'Ticket Representation selection page of the Create Fares Data Service';

interface TicketRepresentationProps {
    fareType: string;
    errors: ErrorInfo[];
    csrfToken: string;
    showHybrid: boolean;
    showPointToPoint: boolean;
}

const TicketRepresentation = ({
    fareType,
    errors = [],
    csrfToken,
    showHybrid,
    showPointToPoint,
}: TicketRepresentationProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/ticketRepresentation" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="ticket-representation-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="ticket-representation-page-heading">
                                    {`Select a type of ${
                                        fareType === 'multiOperator' ? 'multi-operator' : 'period'
                                    } ticket`}
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
                                                      hint:
                                                          'Unlimited travel between two fixed points in both directions',
                                                  },
                                              ]
                                            : []),
                                        ...(showHybrid
                                            ? [
                                                  {
                                                      value: 'hybrid',
                                                      label: 'Hybrid Period ticket',
                                                      hint:
                                                          'Unlimited travel within a geographic zone and certain additional services outside that zone',
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

    return {
        props: {
            fareType,
            errors: ticketType && isTicketRepresentationWithErrors(ticketType) ? ticketType.errors : [],
            csrfToken,
            showHybrid: process.env.STAGE !== 'prod' && fareType !== 'multiOperator',
            showPointToPoint: process.env.STAGE !== 'prod',
        },
    };
};

export default TicketRepresentation;
