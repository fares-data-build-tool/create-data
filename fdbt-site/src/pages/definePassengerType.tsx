import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import TwoThirdsLayout from '../layout/Layout';
import { PASSENGER_TYPE_COOKIE } from '../constants';
import ErrorSummary from '../components/ErrorSummary';
import RadioConditionalInput, { RadioConditionalInputFieldset } from '../components/RadioConditionalInput';
import { ExtractedValidationError } from './api/definePassengerType';
import { ErrorInfo } from '../interfaces';

const title = 'Define Passenger Type - Fares Data Build Tool';
const description = 'Define Passenger Type page of the Fares Data Build Tool';

export interface ErrorCollection {
    combinedErrors: ErrorInfo[];
    ageRangeRadioError: ErrorInfo[];
    proofSelectRadioError: ErrorInfo[];
    ageRangeInputErrors: ErrorInfo[];
    proofSelectInputError: ErrorInfo[];
}

export interface DefinePassengerTypeProps {
    combinedErrors: ErrorInfo[];
    fieldsets: RadioConditionalInputFieldset[];
}

export const getFieldsets = (collectedErrors: ErrorCollection): RadioConditionalInputFieldset[] => {
    const fieldsets = [];

    const ageRangeFieldset: RadioConditionalInputFieldset = {
        heading: {
            id: 'define-passenger-age-range',
            content: 'Does the passenger type have an age range?',
        },
        radios: [
            {
                id: 'age-range-required',
                name: 'ageRange',
                value: 'Yes',
                dataAriaControls: 'age-range-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-passenger-age-range-hint',
                    content: 'Enter a minimum and/or maximum age for this passenger type.',
                },
                inputType: 'text',
                inputs: [
                    {
                        id: 'age-range-min',
                        name: 'ageRangeMin',
                        label: 'Minimum Age (if applicable)',
                    },
                    {
                        id: 'age-range-max',
                        name: 'ageRangeMax',
                        label: 'Maximum Age (if applicable)',
                    },
                ],
                inputErrors: collectedErrors.ageRangeInputErrors,
            },
            {
                id: 'age-range-not-required',
                name: 'ageRange',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: collectedErrors.ageRangeRadioError,
    };

    const proofRequiredFieldset: RadioConditionalInputFieldset = {
        heading: {
            id: 'define-passenger-proof',
            content: 'Does the passenger type require a proof document?',
        },
        radios: [
            {
                id: 'proof-required',
                name: 'proof',
                value: 'Yes',
                dataAriaControls: 'proof-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-passenger-proof-hint',
                    content: 'Select the applicable proof document(s).',
                },
                inputType: 'checkbox',
                inputs: [
                    {
                        id: 'membership-card',
                        name: 'proofDocuments',
                        label: 'Membership Card',
                    },
                    {
                        id: 'student-card',
                        name: 'proofDocuments',
                        label: 'Student Card',
                    },
                    {
                        id: 'identity-document',
                        name: 'proofDocuments',
                        label: 'Identity Document',
                    },
                ],
                inputErrors: collectedErrors.proofSelectInputError,
            },
            {
                id: 'proof-not-required',
                name: 'proof',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: collectedErrors.proofSelectRadioError,
    };
    fieldsets.push(ageRangeFieldset, proofRequiredFieldset);
    return fieldsets;
};

export const collectErrors = (error: ExtractedValidationError, collectedErrors: ErrorCollection): void => {
    switch (error.input) {
        case 'ageRange':
            collectedErrors.ageRangeRadioError.push({
                errorMessage: error.message,
                id: 'define-passenger-age-range',
            });
            break;
        case 'proof':
            collectedErrors.proofSelectRadioError.push({
                errorMessage: error.message,
                id: 'define-passenger-proof',
            });
            break;
        case 'ageRangeMin':
            collectedErrors.ageRangeInputErrors.push({
                errorMessage: error.message,
                id: 'age-range-min',
            });
            break;
        case 'ageRangeMax':
            collectedErrors.ageRangeInputErrors.push({
                errorMessage: error.message,
                id: 'age-range-max',
            });
            break;
        case 'proofDocuments':
            collectedErrors.proofSelectInputError.push({
                errorMessage: error.message,
                id: 'define-passenger-proof',
            });
            break;
        default:
            throw new Error('Could not match the following error with an expected input.');
    }
};

const DefinePassengerType = ({ combinedErrors = [], fieldsets }: DefinePassengerTypeProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={combinedErrors}>
        <form action="/api/definePassengerType" method="post">
            <ErrorSummary errors={combinedErrors} />
            <div>
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                    <h1 className="govuk-fieldset__heading" id="define-passenger-type-page-heading">
                        Provide passenger type details
                    </h1>
                </legend>
                <span className="govuk-hint" id="define-passenger-type-hint">
                    Select if the passenger type requires an age range or proof document
                </span>
                <br />
                <br />
                {fieldsets.map(fieldset => {
                    return <RadioConditionalInput fieldset={fieldset} />;
                })}
            </div>
            <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
        </form>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContext): { props: DefinePassengerTypeProps } => {
    const cookies = parseCookies(ctx);
    const passengerTypeCookie = cookies[PASSENGER_TYPE_COOKIE];

    if (!passengerTypeCookie) {
        throw new Error('Failed to retrieve PASSENGER_TYPE_COOKIE for the define passenger type page');
    }

    const collectedErrors: ErrorCollection = {
        combinedErrors: [],
        ageRangeRadioError: [],
        proofSelectRadioError: [],
        ageRangeInputErrors: [],
        proofSelectInputError: [],
    };

    const parsedPassengerTypeCookie = JSON.parse(passengerTypeCookie);
    if (parsedPassengerTypeCookie.errors) {
        parsedPassengerTypeCookie.errors.forEach((error: ExtractedValidationError) =>
            collectErrors(error, collectedErrors),
        );
        collectedErrors.combinedErrors = collectedErrors.ageRangeRadioError.concat(
            collectedErrors.proofSelectRadioError,
            collectedErrors.ageRangeInputErrors,
            collectedErrors.proofSelectInputError,
        );
    }
    const fieldsets: RadioConditionalInputFieldset[] = getFieldsets(collectedErrors);

    return { props: { combinedErrors: collectedErrors.combinedErrors, fieldsets } };
};

export default DefinePassengerType;
