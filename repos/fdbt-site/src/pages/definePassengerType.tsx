import React, { ReactElement } from 'react';
import lowerCase from 'lodash/lowerCase';
import TwoThirdsLayout from '../layout/Layout';
import {
    GROUP_PASSENGER_TYPES_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE,
    GROUP_PASSENGER_INFO_ATTRIBUTE,
} from '../constants/attributes';
import ErrorSummary from '../components/ErrorSummary';
import RadioConditionalInput, { createErrorId } from '../components/RadioConditionalInput';
import {
    BaseReactElement,
    CompanionInfo,
    ErrorInfo,
    NextPageContextWithSession,
    RadioConditionalInputFieldset,
    PassengerType,
} from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import FormElementWrapper from '../components/FormElementWrapper';
import { getCsrfToken, getErrorsByIds } from '../utils';
import { isPassengerType, isPassengerTypeAttributeWithErrors, isWithErrors } from '../interfaces/typeGuards';

const title = 'Define Passenger Type - Create Fares Data Service';
const description = 'Define Passenger Type page of the Create Fares Data Service';

export interface TextInputFieldset {
    heading: {
        id: string;
        content: string;
    };
    inputs: BaseReactElement[];
    inputErrors: ErrorInfo[];
}

interface DefinePassengerTypeProps {
    group: boolean;
    errors: ErrorInfo[];
    fieldsets: RadioConditionalInputFieldset[];
    numberOfPassengerTypeFieldset?: TextInputFieldset;
    passengerType: string;
    csrfToken: string;
}

export const getFieldsets = (
    errors: ErrorInfo[],
    passengerType: string,
    passengerInfo?: PassengerType | CompanionInfo,
): RadioConditionalInputFieldset[] => {
    const fieldsets: RadioConditionalInputFieldset[] = [];

    const ageRangeFieldset: RadioConditionalInputFieldset = {
        heading: {
            id: 'define-passenger-age-range',
            content: `Do ${lowerCase(passengerType)} passengers have an age range?`,
        },
        radios: [
            {
                id: 'age-range-required',
                name: 'ageRange',
                value: 'Yes',
                dataAriaControls: 'age-range-required-conditional',
                label: 'Yes',
                inputHint: {
                    id: 'define-passenger-age-range-hint',
                    content: 'Enter a minimum and/or maximum age for this passenger type.',
                },
                inputType: 'text',
                inputs: [
                    {
                        id: 'age-range-min',
                        name: 'ageRangeMin',
                        label: 'Minimum Age (if applicable)',
                        defaultValue: passengerInfo?.ageRangeMin || '',
                    },
                    {
                        id: 'age-range-max',
                        name: 'ageRangeMax',
                        label: 'Maximum Age (if applicable)',
                        defaultValue: passengerInfo?.ageRangeMax || '',
                    },
                ],
                inputErrors: getErrorsByIds(['age-range-min', 'age-range-max'], errors),
            },
            {
                id: 'age-range-not-required',
                name: 'ageRange',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: getErrorsByIds(['age-range-required'], errors),
    };

    const proofRequiredFieldset: RadioConditionalInputFieldset = {
        heading: {
            id: 'define-passenger-proof',
            content: `Do ${lowerCase(passengerType)} passengers require a proof document?`,
        },
        radios: [
            {
                id: 'proof-required',
                name: 'proof',
                value: 'Yes',
                dataAriaControls: 'proof-required-conditional',
                label: 'Yes',
                inputHint: {
                    id: 'define-passenger-proof-hint',
                    content: 'Select the applicable proof document(s).',
                },
                inputType: 'checkbox',
                inputs: [
                    {
                        id: 'membership-card',
                        name: 'proofDocuments',
                        label: 'Membership Card',
                        defaultChecked: passengerInfo?.proofDocuments?.includes('membershipCard') || false,
                    },
                    {
                        id: 'student-card',
                        name: 'proofDocuments',
                        label: 'Student Card',
                        defaultChecked: passengerInfo?.proofDocuments?.includes('studentCard') || false,
                    },
                    {
                        id: 'identity-document',
                        name: 'proofDocuments',
                        label: 'Identity Document',
                        defaultChecked: passengerInfo?.proofDocuments?.includes('identityDocument') || false,
                    },
                ],
                inputErrors: getErrorsByIds(['membership-card'], errors),
            },
            {
                id: 'proof-not-required',
                name: 'proof',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: getErrorsByIds(['proof-required'], errors),
    };

    fieldsets.push(ageRangeFieldset);

    if (!passengerType || (passengerType && passengerType !== 'adult')) {
        fieldsets.push(proofRequiredFieldset);
    }

    return fieldsets;
};

export const getNumberOfPassengerTypeFieldset = (
    errors: ErrorInfo[],
    passengerType: string,
    passengerInfo?: CompanionInfo,
): TextInputFieldset => ({
    heading: {
        id: 'number-of-passenger-type-heading',
        content: `How many ${lowerCase(passengerType)} passengers can be in the group?`,
    },
    inputs: [
        {
            id: 'min-number-of-passengers',
            name: 'minNumber',
            label: 'Minimum (optional)',
            defaultValue: passengerInfo?.minNumber || '',
        },
        {
            id: 'max-number-of-passengers',
            name: 'maxNumber',
            label: 'Maximum (required)',
            defaultValue: passengerInfo?.maxNumber || '',
        },
    ],
    inputErrors: getErrorsByIds(['min-number-of-passengers', 'max-number-of-passengers'], errors),
});

export const numberOfPassengerTypeQuestion = (fieldset: TextInputFieldset): ReactElement => {
    const error = fieldset.inputErrors.length > 0;
    return (
        <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''}`}>
            <fieldset className="govuk-fieldset" aria-describedby={fieldset.heading.id}>
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                    <h2 className="govuk-fieldset__heading" id={fieldset.heading.id}>
                        {fieldset.heading.content}
                    </h2>
                </legend>
                {fieldset.inputs.map(input => {
                    const errorId = createErrorId(input, fieldset.inputErrors);
                    const defaultValue =
                        fieldset.inputErrors.find(inputError => inputError.id === input.id)?.userInput ||
                        fieldset.inputs.find(userInput => userInput.id === input.id)?.defaultValue ||
                        '';
                    return (
                        <div
                            key={input.id}
                            className={`govuk-form-group${errorId !== '' ? ' govuk-form-group--error' : ''}`}
                        >
                            <label className="govuk-label" htmlFor={input.id}>
                                {input.label}
                            </label>
                            <FormElementWrapper
                                errors={fieldset.inputErrors}
                                errorId={errorId}
                                errorClass="govuk-input--error"
                            >
                                <input
                                    className="govuk-input govuk-input--width-2"
                                    id={input.id}
                                    name={input.name}
                                    type="text"
                                    defaultValue={defaultValue}
                                />
                            </FormElementWrapper>
                        </div>
                    );
                })}
            </fieldset>
            <br />
            <br />
        </div>
    );
};

const DefinePassengerType = ({
    group,
    errors = [],
    fieldsets,
    numberOfPassengerTypeFieldset,
    csrfToken,
    passengerType,
}: DefinePassengerTypeProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/definePassengerType" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div>
                    <h1 className="govuk-heading-l" id="define-passenger-type-page-heading">
                        Provide passenger type details
                    </h1>
                    {group === false ? (
                        <span className="govuk-hint" id="define-passenger-type-hint">
                            Select if the passenger type requires an age range or proof document
                        </span>
                    ) : (
                        ''
                    )}
                    <br />
                    <br />
                    {group === true && numberOfPassengerTypeFieldset
                        ? numberOfPassengerTypeQuestion(numberOfPassengerTypeFieldset)
                        : ''}
                    {fieldsets.map(fieldset => {
                        return <RadioConditionalInput key={fieldset.heading.id} fieldset={fieldset} />;
                    })}
                </div>
                <input value={passengerType} type="hidden" name="passengerType" />
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: DefinePassengerTypeProps } => {
    const csrfToken = getCsrfToken(ctx);
    const groupPassengerTypes = getSessionAttribute(ctx.req, GROUP_PASSENGER_TYPES_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);
    const passengerTypeErrorsAttribute = getSessionAttribute(ctx.req, DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE);

    if (
        !passengerTypeAttribute ||
        (!isPassengerType(passengerTypeAttribute) && (!ctx.query.groupPassengerType || !groupPassengerTypes))
    ) {
        throw new Error('Failed to retrieve passenger type details for the define passenger type page');
    }

    const errors: ErrorInfo[] = isWithErrors(passengerTypeErrorsAttribute) ? passengerTypeErrorsAttribute.errors : [];

    let passengerType = ctx?.query?.groupPassengerType as string;

    const group =
        !!groupPassengerTypes &&
        !isPassengerTypeAttributeWithErrors(passengerTypeAttribute) &&
        passengerTypeAttribute.passengerType === 'group';

    if (!passengerType) {
        if (isPassengerTypeAttributeWithErrors(passengerTypeAttribute)) {
            throw new Error('Incorrect passenger type found');
        }
        passengerType = passengerTypeAttribute.passengerType;
    }

    let numberOfPassengerTypeFieldset = group ? getNumberOfPassengerTypeFieldset(errors, passengerType) : undefined;

    let passengerInfo;
    const groupPassengerInfo = getSessionAttribute(ctx.req, GROUP_PASSENGER_INFO_ATTRIBUTE);

    if (isWithErrors(passengerTypeErrorsAttribute)) {
        passengerInfo = passengerTypeErrorsAttribute;
        numberOfPassengerTypeFieldset = getNumberOfPassengerTypeFieldset(errors, passengerType, passengerInfo);
    } else if (group) {
        if (!isWithErrors(passengerTypeErrorsAttribute) && groupPassengerInfo) {
            passengerInfo = groupPassengerInfo.find(info => info.passengerType === passengerType);
        }
        numberOfPassengerTypeFieldset = getNumberOfPassengerTypeFieldset(errors, passengerType, passengerInfo);
    } else if (!group && passengerTypeAttribute && !isWithErrors(passengerTypeAttribute)) {
        passengerInfo = passengerTypeAttribute;
    }

    const radioFieldsets = getFieldsets(errors, passengerType, passengerInfo);

    if (numberOfPassengerTypeFieldset) {
        return {
            props: {
                group,
                errors,
                fieldsets: radioFieldsets,
                numberOfPassengerTypeFieldset,
                passengerType,
                csrfToken,
            },
        };
    }

    return {
        props: { group, errors, fieldsets: radioFieldsets, passengerType, csrfToken },
    };
};

export default DefinePassengerType;
