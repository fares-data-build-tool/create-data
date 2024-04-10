import React, { ReactElement } from 'react';
import { CapExpiryUnit } from '../interfaces/matchingJsonTypes';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper, { FormGroupWrapper } from '../components/FormElementWrapper';
import { CREATE_CAPS_ATTRIBUTE } from '../constants/attributes';
import { Cap, ErrorInfo, NextPageContextWithSession, RadioConditionalInputFieldset } from '../interfaces';
import { isWithErrors } from '../interfaces/typeGuards';
import { FullColumnLayout } from '../layout/Layout';
import { getAndValidateNoc, getCsrfToken, getErrorsByIds } from '../utils';
import { getSessionAttribute } from '../utils/sessions';
import { upperFirst } from 'lodash';
import { getCapByNocAndId, getFareDayEnd } from '../data/auroradb';
import BackButton from '../components/BackButton';
import RadioConditionalInput from '../components/RadioConditionalInput';

const title = 'Create Caps - Create Fares Data Service';
const description = 'Create caps page of the Create Fares Data Service';

export const expiryHintText: { [expiry: string]: string } = {
    endOfCalendarDay: 'The cap applies to journeys made before midnight',
    '24hr': 'The cap applies to journeys made within 24hrs of the first tap',
    fareDayEnd: "The cap applies to journeys made during the 'fare day' as defined by your business rules",
};

export const getFieldset = (
    errors: ErrorInfo[],
    endOfFareDay?: string,
    capExpiry?: string,
): RadioConditionalInputFieldset => {
    const CapExpiryFieldSet: RadioConditionalInputFieldset = {
        heading: {
            id: 'cap-validity',
            content: 'Is this ticket only valid on certain days or times?',
            hidden: true,
        },
        radios: [
            {
                id: 'cap-end-calendar',
                name: 'capProductValidity',
                value: 'endOfCalendarDay',
                label: 'At the end of a calendar day',
                radioButtonHint: {
                    id: 'cap-end-calendar-hint',
                    content: expiryHintText['endOfCalendarDay'],
                },
                defaultChecked: capExpiry === 'endOfCalendarDay',
            },
            {
                id: 'cap-end-of-service',
                disableAutoSelect: capExpiry !== 'fareDayEnd',
                name: 'capProductValidity',
                value: 'fareDayEnd',
                dataAriaControls: 'cap-expiry-end-of-service-required-conditional',
                label: 'Fare day end',
                radioButtonHint: {
                    id: 'cap-end-of-service-hint',
                    content: expiryHintText['fareDayEnd'],
                },
                defaultChecked: capExpiry === 'fareDayEnd',
                inputHint: {
                    id: 'product-end-time-hint',
                    content: 'You can update your fare day end in operator settings',
                    hidden: true,
                },
                inputType: 'text',
                inputs: [
                    {
                        id: 'product-end-time',
                        name: 'capProductEndTime',
                        label: 'End time',
                        disabled: true,
                        defaultValue: endOfFareDay ?? '',
                    },
                ],
                inputErrors: getErrorsByIds(['product-end-time'], errors),
            },
        ],
        radioError: getErrorsByIds(['cap-end-calendar'], errors),
    };
    return CapExpiryFieldSet;
};

interface CreateCapsProps {
    errors: ErrorInfo[];
    userInput?: Cap;
    csrfToken: string;
    editId?: number;
    fieldset: RadioConditionalInputFieldset;
}

const CreateCaps = ({ errors = [], userInput, csrfToken, editId, fieldset }: CreateCapsProps): ReactElement => {
    const optionList: string[] = Object.values(CapExpiryUnit).filter((option) => option !== 'term');

    return (
        <FullColumnLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/createCaps" method="post" csrfToken={csrfToken}>
                <>
                    {!!editId && errors.length === 0 ? <BackButton href="/viewCaps" /> : null}
                    <ErrorSummary errors={errors} />
                    <h1 className="govuk-heading-l" id="create-caps-page-heading">
                        Create your fare caps
                    </h1>
                    <span id="create-cap-hint" className="govuk-hint">
                        If cap duration is more than a day, provide input for the cap start.
                    </span>

                    <div className="govuk-grid-row">
                        <fieldset className="govuk-fieldset">
                            <legend className="govuk-fieldset__legend govuk-visually-hidden">
                                Enter details for cap
                            </legend>
                            <div className="flex-container">
                                <div className="govuk-!-margin-left-4 govuk-!-margin-right-2">
                                    <FormGroupWrapper errors={errors} errorIds={['cap-name']}>
                                        <>
                                            <label className="govuk-label" htmlFor="cap-name">
                                                <span className="govuk-visually-hidden">Cap Name</span>
                                                <span aria-hidden>Cap name</span>
                                            </label>
                                            <span className="govuk-hint" id="cap-name-hint">
                                                50 characters max
                                            </span>
                                            <FormElementWrapper
                                                errors={errors}
                                                errorId="cap-name"
                                                errorClass="govuk-input--error"
                                                hideText
                                            >
                                                <input
                                                    className="govuk-input govuk-input--width-40 govuk-product-name-input__inner__input"
                                                    id="cap-name"
                                                    name="capName"
                                                    type="text"
                                                    aria-describedby="cap-name-hint"
                                                    maxLength={50}
                                                    defaultValue={
                                                        userInput && userInput.capDetails
                                                            ? userInput.capDetails.name
                                                            : ''
                                                    }
                                                />
                                            </FormElementWrapper>
                                        </>
                                    </FormGroupWrapper>
                                </div>
                                <div className="govuk-!-margin-left-2 govuk-!-margin-right-2">
                                    <FormGroupWrapper errors={errors} errorIds={['cap-price']}>
                                        <>
                                            <label className="govuk-label" htmlFor="cap-price">
                                                <span className="govuk-visually-hidden">Cap Price, in pounds</span>
                                                <span aria-hidden>Price</span>
                                            </label>
                                            <span className="govuk-hint" id="cap-price-hint">
                                                e.g. 2.99
                                            </span>

                                            <div className="govuk-currency-input">
                                                <div className="govuk-currency-input__inner">
                                                    <span className="govuk-currency-input__inner__unit">£</span>
                                                    <FormElementWrapper
                                                        errors={errors}
                                                        errorId="cap-price"
                                                        errorClass="govuk-input--error"
                                                        hideText
                                                        addFormGroupError={false}
                                                    >
                                                        <input
                                                            className="govuk-input govuk-input--width-4 govuk-currency-input__inner__input"
                                                            name="capPrice"
                                                            data-non-numeric
                                                            type="text"
                                                            aria-describedby="cap-price-hint"
                                                            id="cap-price"
                                                            defaultValue={userInput?.capDetails.price || ''}
                                                        />
                                                    </FormElementWrapper>
                                                </div>
                                            </div>
                                        </>
                                    </FormGroupWrapper>
                                </div>
                                <div className="govuk-!-margin-left-2 govuk-!-margin-right-2">
                                    <FormGroupWrapper
                                        errors={errors}
                                        errorIds={['cap-period-duration-quantity', 'cap-period-duration-unit']}
                                    >
                                        <>
                                            <label className="govuk-label" htmlFor="cap-period-duration">
                                                Cap duration
                                            </label>
                                            <span className="govuk-hint" id="cap-duration-hint">
                                                For example, 3 days
                                            </span>

                                            <div className="govuk-input__wrapper expiry-selector-wrapper">
                                                <FormElementWrapper
                                                    errors={errors}
                                                    errorId="cap-period-duration-quantity"
                                                    errorClass="govuk-input--error"
                                                    hideText
                                                >
                                                    <input
                                                        className="govuk-input govuk-input--width-3"
                                                        name="capDuration"
                                                        type="text"
                                                        id="cap-period-duration-quantity"
                                                        aria-describedby="cap-duration-hint"
                                                        defaultValue={userInput?.capDetails.durationAmount || ''}
                                                    />
                                                </FormElementWrapper>
                                                <FormElementWrapper
                                                    errors={errors}
                                                    errorId="cap-duration-unit"
                                                    errorClass="govuk-select--error"
                                                    hideText
                                                >
                                                    {/* eslint-disable-next-line jsx-a11y/no-onchange */}
                                                    <select
                                                        className="govuk-select govuk-select--width-3 expiry-selector-units"
                                                        name="capDurationUnits"
                                                        id="cap-duration-unit"
                                                        defaultValue={userInput?.capDetails.durationUnits || ''}
                                                    >
                                                        <option value="" disabled key="select-one">
                                                            Select One
                                                        </option>

                                                        {optionList.map((unit) => (
                                                            <option value={unit} key={unit}>{`${upperFirst(unit)}${
                                                                unit !== 'no expiry' ? 's' : ''
                                                            }`}</option>
                                                        ))}
                                                    </select>
                                                </FormElementWrapper>
                                            </div>
                                        </>
                                    </FormGroupWrapper>
                                </div>
                            </div>

                            <div className="govuk-!-margin-left-2 govuk-!-margin-right-2 govuk-!-margin-top-4">
                                <FormGroupWrapper errors={errors} errorIds={['cap-expiry']}>
                                    <fieldset className="govuk-fieldset" aria-describedby="cap-expiry-page-heading">
                                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                            <h2 className="govuk-fieldset__heading" id="cap-expiry-page-heading">
                                                When does the cap expire?
                                            </h2>
                                        </legend>
                                        <span className="govuk-hint" id="cap-expiry-hint">
                                            We need to know the time that this cap would be valid until
                                        </span>
                                        <RadioConditionalInput key={fieldset.heading.id} fieldset={fieldset} />
                                    </fieldset>
                                </FormGroupWrapper>
                            </div>
                        </fieldset>
                        <input type="hidden" name="id" value={editId} />
                        <input
                            type="submit"
                            value="Continue"
                            id="continue-button"
                            className="govuk-button govuk-!-margin-left-3"
                        />
                    </div>
                </>
            </CsrfForm>
        </FullColumnLayout>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: CreateCapsProps }> => {
    const csrfToken = getCsrfToken(ctx);

    const capsAttribute = getSessionAttribute(ctx.req, CREATE_CAPS_ATTRIBUTE);
    let userInput = capsAttribute ? capsAttribute : undefined;
    const id = Number(ctx.query.id);
    const editId = Number.isInteger(id) ? id : undefined;
    const nocCode = getAndValidateNoc(ctx);
    const endOfFareDay = await getFareDayEnd(nocCode);

    if (editId && !userInput) {
        userInput = await getCapByNocAndId(nocCode, editId);
        if (!userInput) {
            throw new Error('No entity for this NOC matches the passed id');
        }
    }

    const errors = isWithErrors(capsAttribute) ? capsAttribute.errors : [];

    const fieldset: RadioConditionalInputFieldset = getFieldset(
        errors,
        endOfFareDay,
        userInput?.capDetails.capExpiry.productValidity,
    );
    return {
        props: {
            errors,
            csrfToken,
            ...(userInput && { userInput }),
            ...(editId && { editId }),
            fieldset,
        },
    };
};

export default CreateCaps;
