import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import TwoThirdsLayout from '../layout/Layout';
import { PASSENGER_TYPE_COOKIE } from '../constants';
import { ErrorInfo, CustomAppProps } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import { deleteCookieOnServerSide } from '../utils/index';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';

const title = 'Passenger Type - Fares Data Build Tool';
const description = 'Passenger Type selection page of the Fares Data Build Tool';

const errorId = 'passenger-type-error';

type PassengerAttributes = {
    passengerTypeDisplay: string;
    passengerTypeValue: string;
    greyedOut: boolean;
};

type PassengerTypeProps = {
    errors?: ErrorInfo[];
};

const passengerTypesList: PassengerAttributes[] = [
    { passengerTypeDisplay: 'Anyone', passengerTypeValue: 'anyone', greyedOut: false },
    { passengerTypeDisplay: 'Adult', passengerTypeValue: 'adult', greyedOut: false },
    { passengerTypeDisplay: 'Child', passengerTypeValue: 'child', greyedOut: false },
    { passengerTypeDisplay: 'Infant', passengerTypeValue: 'infant', greyedOut: false },
    { passengerTypeDisplay: 'Senior', passengerTypeValue: 'senior', greyedOut: false },
    { passengerTypeDisplay: 'Student', passengerTypeValue: 'student', greyedOut: false },
    { passengerTypeDisplay: 'Young Person', passengerTypeValue: 'youngPerson', greyedOut: false },
    { passengerTypeDisplay: 'School Pupil', passengerTypeValue: 'schoolPupil', greyedOut: true },
    { passengerTypeDisplay: 'Disabled', passengerTypeValue: 'disabled', greyedOut: true },
    { passengerTypeDisplay: 'Disabled Companion', passengerTypeValue: 'disabledCompanion', greyedOut: true },
    { passengerTypeDisplay: 'Employee', passengerTypeValue: 'employee', greyedOut: true },
    { passengerTypeDisplay: 'Military', passengerTypeValue: 'military', greyedOut: true },
    { passengerTypeDisplay: 'Job Seeker', passengerTypeValue: 'jobSeeker', greyedOut: true },
    { passengerTypeDisplay: 'Guide Dog', passengerTypeValue: 'guideDog', greyedOut: true },
    { passengerTypeDisplay: 'Animal', passengerTypeValue: 'animal', greyedOut: true },
];

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
                                {passengerTypesList.map(
                                    (passenger, index): ReactElement => (
                                        <div className="govuk-radios__item" key={passenger.passengerTypeValue}>
                                            <input
                                                className="govuk-radios__input"
                                                id={`passenger-type${index}`}
                                                name="passengerType"
                                                type="radio"
                                                value={passenger.passengerTypeValue}
                                                disabled={passenger.greyedOut}
                                                aria-disabled={passenger.greyedOut}
                                            />
                                            <label
                                                className="govuk-label govuk-radios__label"
                                                htmlFor={`passenger-type${index}`}
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
