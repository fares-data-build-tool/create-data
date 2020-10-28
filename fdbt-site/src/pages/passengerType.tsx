import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import { PASSENGER_TYPE_ATTRIBUTE, PASSENGER_TYPES_WITH_GROUP } from '../constants';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import InsetText from '../components/InsetText';
import { getSessionAttribute } from '../utils/sessions';
import { isPassengerTypeAttributeWithErrors } from '../interfaces/typeGuards';
import { getCsrfToken } from '../utils';

const title = 'Passenger Type - Create Fares Data Service';
const description = 'Passenger Type selection page of the Create Fares Data Service';

const insetText = 'More passenger types will become available soon';

type PassengerTypeProps = {
    errors?: ErrorInfo[];
    csrfToken: string;
};

const PassengerType = ({ errors = [], csrfToken }: PassengerTypeProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/passengerType" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <fieldset className="govuk-fieldset" aria-describedby="passenger-type-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="passenger-type-page-heading">
                                Select a passenger type
                            </h1>
                        </legend>
                        <span className="govuk-hint" id="passenger-type-hint">
                            Specific details of your fare type, including age range, can be entered in the next section
                        </span>
                        <FormElementWrapper
                            errors={errors}
                            errorId={`passenger-type-${PASSENGER_TYPES_WITH_GROUP[0].passengerTypeValue}`}
                            errorClass="govuk-radios--error"
                        >
                            <div className="govuk-radios">
                                {PASSENGER_TYPES_WITH_GROUP.map(
                                    (passenger): ReactElement => (
                                        <div className="govuk-radios__item" key={passenger.passengerTypeValue}>
                                            <input
                                                className="govuk-radios__input"
                                                id={`passenger-type-${passenger.passengerTypeValue}`}
                                                name="passengerType"
                                                type="radio"
                                                value={passenger.passengerTypeValue}
                                            />
                                            <label
                                                className="govuk-label govuk-radios__label"
                                                htmlFor={`passenger-type-${passenger.passengerTypeValue}`}
                                            >
                                                {`${passenger.passengerTypeDisplay}`}
                                            </label>
                                        </div>
                                    ),
                                )}
                            </div>
                        </FormElementWrapper>
                    </fieldset>
                </div>
                <InsetText text={insetText} />
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: PassengerTypeProps } => {
    const csrfToken = getCsrfToken(ctx);
    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);

    const errors: ErrorInfo[] =
        passengerTypeAttribute && isPassengerTypeAttributeWithErrors(passengerTypeAttribute)
            ? passengerTypeAttribute.errors
            : [];

    return { props: { errors, csrfToken } };
};

export default PassengerType;
