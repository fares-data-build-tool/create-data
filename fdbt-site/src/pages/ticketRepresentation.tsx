import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import { FARE_TYPE_ATTRIBUTE, TICKET_REPRESENTATION_ATTRIBUTE } from '../constants';
import { ErrorInfo, CustomAppProps, NextPageContextWithSession } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { isTicketRepresentationWithErrors } from '../interfaces/typeGuards';
import { FareType } from './api/fareType';

const title = 'Ticket Representation - Create Fares Data Service';
const description = 'Ticket Representation selection page of the Create Fares Data Service';

type TicketRepresentationProps = {
    fareType: string;
    errors: ErrorInfo[];
};

const TicketRepresentation = ({
    fareType,
    errors = [],
    csrfToken,
}: TicketRepresentationProps & CustomAppProps): ReactElement => (
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
                            <div className="govuk-radios">
                                <div className="govuk-radios__item">
                                    <input
                                        className={`govuk-radios__input ${
                                            errors.length > 0 ? 'govuk-input--error' : ''
                                        } `}
                                        id="geo-zone"
                                        name="ticketType"
                                        type="radio"
                                        value="geoZone"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="geo-zone">
                                        A ticket within a geographical zone
                                    </label>
                                </div>
                                <div className="govuk-radios__item">
                                    <input
                                        className={`govuk-radios__input ${
                                            errors.length > 0 ? 'govuk-input--error' : ''
                                        } `}
                                        id="set-of-services"
                                        name="ticketType"
                                        type="radio"
                                        value="multipleServices"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="set-of-services">
                                        A ticket for a set of services
                                    </label>
                                </div>
                            </div>
                        </FormElementWrapper>
                    </fieldset>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: TicketRepresentationProps } => {
    const { fareType } = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE) as FareType;
    const ticketType = getSessionAttribute(ctx.req, TICKET_REPRESENTATION_ATTRIBUTE);

    return {
        props: {
            fareType,
            errors: ticketType && isTicketRepresentationWithErrors(ticketType) ? ticketType.errors : [],
        },
    };
};

export default TicketRepresentation;
