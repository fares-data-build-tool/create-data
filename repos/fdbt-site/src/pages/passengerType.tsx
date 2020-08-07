import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import TwoThirdsLayout from '../layout/Layout';
import { PASSENGER_TYPE_COOKIE, PASSENGER_TYPES_LIST } from '../constants';
import { ErrorInfo, CustomAppProps } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import { deleteCookieOnServerSide } from '../utils/index';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import InsetText from '../components/InsetText';

const title = 'Passenger Type - Fares Data Build Tool';
const description = 'Passenger Type selection page of the Fares Data Build Tool';

const errorId = 'passenger-type-error';
const insetText = 'More passenger types will become available soon';

type PassengerTypeProps = {
    errors?: ErrorInfo[];
};

const PassengerType = ({ errors = [], csrfToken }: PassengerTypeProps & CustomAppProps): ReactElement => (
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
                            Relate the ticket(s) to a passenger type
                        </span>
                        <FormElementWrapper errors={errors} errorId={errorId} errorClass="govuk-radios--error">
                            <div className="govuk-radios">
                                {PASSENGER_TYPES_LIST.map(
                                    (passenger, index): ReactElement => (
                                        <div className="govuk-radios__item" key={passenger.passengerTypeValue}>
                                            <input
                                                className="govuk-radios__input"
                                                id={`passenger-type-${index}`}
                                                name="passengerType"
                                                type="radio"
                                                value={passenger.passengerTypeValue}
                                            />
                                            <label
                                                className="govuk-label govuk-radios__label"
                                                htmlFor={`passenger-type-${index}`}
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

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);

    if (cookies[PASSENGER_TYPE_COOKIE]) {
        const passengerTypeCookie = cookies[PASSENGER_TYPE_COOKIE];
        const parsedPassengerTypeCookie = JSON.parse(passengerTypeCookie);

        if (parsedPassengerTypeCookie.errorMessage) {
            const { errorMessage } = parsedPassengerTypeCookie;
            deleteCookieOnServerSide(ctx, PASSENGER_TYPE_COOKIE);
            return { props: { errors: [{ errorMessage, id: errorId }] } };
        }
    }

    return { props: {} };
};

export default PassengerType;
