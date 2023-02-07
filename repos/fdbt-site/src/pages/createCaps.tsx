import React, { ReactElement, useState } from 'react';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper, { FormGroupWrapper } from '../components/FormElementWrapper';
import { CREATE_CAPS_ATTRIBUTE } from '../constants/attributes';
import { Cap, ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { isWithErrors } from '../interfaces/typeGuards';
import { FullColumnLayout } from '../layout/Layout';
import { getCsrfToken } from '../utils';
import { getSessionAttribute } from '../utils/sessions';
import { upperFirst } from 'lodash';
import { isADayDuration } from './api/createCaps';
import { ExpiryUnit } from '../interfaces/matchingJsonTypes';

const title = 'Create Caps - Create Fares Data Service';
const description = 'Create caps page of the Create Fares Data Service';
const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

interface CreateCapsProps {
    errors: ErrorInfo[];
    userInput: Cap | null;
    csrfToken: string;
}

const CreateCaps = ({ errors = [], userInput, csrfToken }: CreateCapsProps): ReactElement => {
    const optionList: string[] = [];
    Object.values(ExpiryUnit).map((unit) => {
        optionList.push(unit);
    });

    const [showCapStartInfo, setCapStartInfo] = useState<boolean>(false);
    //const [durationAmount, setDurationAmount] = useState<Number>();

    const handleDuration = (durationUnit: string): void => {
        setCapStartInfo(isADayDuration('2', durationUnit));
    };

    return (
        <FullColumnLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/createCaps" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <h1 className="govuk-heading-l" id="create-caps-page-heading">
                        Create your fare caps
                    </h1>

                    <div className="govuk-grid-row">
                        <fieldset className="govuk-fieldset">
                            <legend className="govuk-fieldset__legend govuk-visually-hidden">
                                Enter details for cap
                            </legend>
                            <div className="flex-container">
                                <div className="govuk-!-margin-left-4 govuk-!-margin-right-2">
                                    <FormGroupWrapper errors={errors} errorIds={[`cap-name`]} hideErrorBar>
                                        <>
                                            <label className="govuk-label" htmlFor="cap-name">
                                                <span className="govuk-visually-hidden">Cap Name - Cap 0</span>
                                                <span aria-hidden>Cap name</span>
                                            </label>
                                            <span className="govuk-hint" id="cap-name-hint">
                                                50 characters max
                                            </span>{' '}
                                            <FormElementWrapper
                                                errors={errors}
                                                errorId="cap-name"
                                                errorClass="govuk-input--error"
                                                hideText
                                                addFormGroupError={false}
                                            >
                                                <input
                                                    className="govuk-input govuk-input--width-40 govuk-product-name-input__inner__input"
                                                    id="cap-name"
                                                    name="capName"
                                                    type="text"
                                                    aria-describedby="cap-name-hint"
                                                    maxLength={50}
                                                    defaultValue={userInput ? userInput.name : ''}
                                                />
                                            </FormElementWrapper>
                                        </>
                                    </FormGroupWrapper>
                                </div>
                                <div className="govuk-!-margin-left-2 govuk-!-margin-right-2">
                                    <FormGroupWrapper errors={errors} hideErrorBar errorIds={['cap-price']}>
                                        <>
                                            <>
                                                <label className="govuk-label" htmlFor="cap-price">
                                                    <span className="govuk-visually-hidden">
                                                        Cap Price, in pounds - Cap
                                                    </span>
                                                    <span aria-hidden>Price</span>
                                                </label>
                                                <span className="govuk-hint" id="cap-price-hint">
                                                    e.g. 2.99
                                                </span>
                                            </>

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
                                                            defaultValue={userInput?.price ?? ''}
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
                                        hideErrorBar
                                    >
                                        <>
                                            <label className="govuk-label" htmlFor="cap-period-duration">
                                                Cap duration
                                            </label>
                                            <span className="govuk-hint" id="cap-duration-hint">
                                                For example, 3 days
                                            </span>
                                            {/* */}

                                            <div className="govuk-input__wrapper expiry-selector-wrapper">
                                                <>
                                                    <FormElementWrapper
                                                        errors={errors || []}
                                                        errorId="cap-period-duration-quantity"
                                                        errorClass="govuk-input--error"
                                                        hideText
                                                        addFormGroupError={true}
                                                    >
                                                        <input
                                                            className="govuk-input govuk-input--width-3"
                                                            name="capDuration"
                                                            type="text"
                                                            id="cap-period-duration-quantity"
                                                            aria-describedby="cap-duration-hint"
                                                            defaultValue={userInput?.durationAmount ?? ''}
                                                        />
                                                    </FormElementWrapper>
                                                    <FormElementWrapper
                                                        errors={errors || []}
                                                        errorId="cap-duration-unit"
                                                        errorClass="govuk-select--error"
                                                        hideText
                                                    >
                                                        {/* eslint-disable-next-line jsx-a11y/no-onchange */}
                                                        <select
                                                            className="govuk-select govuk-select--width-3 expiry-selector-units"
                                                            name="capDurationUnits"
                                                            id="cap-duration-unit"
                                                            defaultValue={userInput?.durationUnits ?? undefined}
                                                            onChange={(e): void => handleDuration(e.target.value)}
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
                                                </>
                                            </div>
                                        </>
                                    </FormGroupWrapper>
                                </div>
                            </div>
                        </fieldset>

                        {showCapStartInfo ? (
                            <div className="govuk-form-group">
                                <fieldset className="govuk-fieldset" aria-describedby="fixed-weekdays-hint">
                                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                        <h1 className="govuk-fieldset__heading">Define when cap is calculated from</h1>
                                    </legend>
                                    <h2 className="govuk-heading-m govuk-!-margin-top-6">Business week</h2>
                                    <span id="fixed-weekdays-hint" className="govuk-hint">
                                        Which day does your cap&apos;s calculation start on?
                                    </span>
                                    <div className="govuk-radios" data-module="govuk-radios">
                                        <div className="govuk-radios__item">
                                            <input
                                                className="govuk-radios__input"
                                                id="fixed-weekdays"
                                                name="capStart"
                                                type="radio"
                                                value="fixedWeekdays"
                                                data-aria-controls="conditional-fixed-weekdays"
                                            />
                                            <label className="govuk-label govuk-radios__label" htmlFor="fixed-weekdays">
                                                Fixed weekdays
                                            </label>
                                        </div>
                                        <div
                                            className="govuk-radios__conditional govuk-radios__conditional--hidden"
                                            id="conditional-fixed-weekdays"
                                        >
                                            <div className="govuk-form-group">
                                                <label className="govuk-label" htmlFor="start-day">
                                                    Start
                                                </label>
                                                <select className="govuk-select" id="start-day" name="startDay">
                                                    {daysOfWeek.map((day) => (
                                                        <option defaultValue={day[0]} key={day} value={day}>
                                                            {upperFirst(day)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="govuk-radios__item">
                                            <input
                                                className="govuk-radios__input"
                                                id="rolling-days"
                                                name="capStart"
                                                type="radio"
                                                value="rollingDays"
                                                aria-describedby="rolling-days-hint"
                                            />
                                            <label className="govuk-label govuk-radios__label" htmlFor="rolling-days">
                                                Rolling days
                                            </label>
                                            <div id="rolling-days-hint" className="govuk-hint govuk-radios__hint">
                                                Rolling seven days from first journey
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        ) : null}

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

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: CreateCapsProps } => {
    const csrfToken = getCsrfToken(ctx);
    const capsAttribute = getSessionAttribute(ctx.req, CREATE_CAPS_ATTRIBUTE);
    //console.log(capsAttribute);

    return {
        props: {
            errors: isWithErrors(capsAttribute) ? capsAttribute.errors : [],
            userInput: capsAttribute && 'name' in capsAttribute ? capsAttribute : null,
            csrfToken,
        },
    };
};

export default CreateCaps;
