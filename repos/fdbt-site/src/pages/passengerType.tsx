import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { PASSENGER_TYPE_COOKIE } from '../constants';
import { ErrorInfo } from '../types';
import ErrorSummary from '../components/ErrorSummary';
import { deleteCookieOnServerSide, buildTitle, unescapeAndDecodeCookieServerSide } from '../utils/index';
import FormElementWrapper from '../components/FormElementWrapper';

const title = 'Passenger Type - Fares Data Build Tool';
const description = 'Passenger Type selection page of the Fares Data Build Tool';

const errorId = 'passenger-type-error';

type PassengerAttributes = {
    passengerType: string;
    greyedOut: boolean;
};

type PassengerTypeProps = {
    errors?: ErrorInfo[];
};

const passengerTypesList: PassengerAttributes[] = [
    { passengerType: 'Any', greyedOut: false },
    { passengerType: 'Adult', greyedOut: false },
    { passengerType: 'Child', greyedOut: false },
    { passengerType: 'Infant', greyedOut: false },
    { passengerType: 'Senior', greyedOut: false },
    { passengerType: 'School Pupil', greyedOut: true },
    { passengerType: 'Student', greyedOut: false },
    { passengerType: 'Young Person', greyedOut: false },
    { passengerType: 'Disabled', greyedOut: true },
    { passengerType: 'Disabled Companion', greyedOut: true },
    { passengerType: 'Employee', greyedOut: true },
    { passengerType: 'Military', greyedOut: true },
    { passengerType: 'Job Seeker', greyedOut: true },
    { passengerType: 'Guide Dog', greyedOut: true },
    { passengerType: 'Animal', greyedOut: true },
];

const PassengerType = ({ errors = [] }: PassengerTypeProps): ReactElement => {
    return (
        <Layout title={buildTitle(errors, title)} description={description}>
            <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
                <form action="/api/passengerType" method="post">
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="passenger-type-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                                <h1 className="govuk-fieldset__heading" id="passenger-type-page-heading">
                                    Select a passenger type
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="passenger-type-hint">
                                Relate the ticket(s) to a passenger type
                            </span>
                            <FormElementWrapper errors={errors} errorId={errorId} errorClass="govuk-radios--error">
                                <div className="govuk-radios">
                                    {passengerTypesList.map(
                                        (passenger, index): ReactElement => (
                                            <div className="govuk-radios__item" key={passenger.passengerType}>
                                                <input
                                                    className="govuk-radios__input"
                                                    id={`passenger-type${index}`}
                                                    name="passengerType"
                                                    type="radio"
                                                    value={passenger.passengerType}
                                                    disabled={passenger.greyedOut}
                                                    aria-disabled={passenger.greyedOut}
                                                />
                                                <label
                                                    className="govuk-label govuk-radios__label"
                                                    htmlFor={`passenger-type${index}`}
                                                >
                                                    {`${passenger.passengerType}`}
                                                </label>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </FormElementWrapper>
                        </fieldset>
                    </div>
                    <input
                        type="submit"
                        value="Continue"
                        id="continue-button"
                        className="govuk-button govuk-button--start"
                    />
                </form>
            </main>
        </Layout>
    );
};

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);

    if (cookies[PASSENGER_TYPE_COOKIE]) {
        const passengerTypeCookie = unescapeAndDecodeCookieServerSide(cookies, PASSENGER_TYPE_COOKIE);
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
