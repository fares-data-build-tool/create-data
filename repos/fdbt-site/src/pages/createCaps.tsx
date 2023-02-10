import React, { ReactElement, useState } from 'react';
import { ExpiryUnit } from '../interfaces/matchingJsonTypes';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper, { FormGroupWrapper } from '../components/FormElementWrapper';
import { CREATE_CAPS_ATTRIBUTE } from '../constants/attributes';
import { CapInfo, ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { isWithErrors } from '../interfaces/typeGuards';
import { FullColumnLayout } from '../layout/Layout';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { getSessionAttribute } from '../utils/sessions';
import { upperFirst } from 'lodash';
import { getCapByNocAndId } from '../data/auroradb';

const title = 'Create Caps - Create Fares Data Service';
const description = 'Create caps page of the Create Fares Data Service';

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

interface CreateCapsProps {
    errors: ErrorInfo[];
    userInput?: CapInfo;
    csrfToken: string;
    editId?: number;
}
export const isADayDuration = (duration: string | undefined, durationUnit: string | undefined): boolean =>
    !!durationUnit && !!duration && !(durationUnit === 'hour' && Number(duration) <= 24);

const CreateCaps = ({ errors = [], userInput, csrfToken, editId }: CreateCapsProps): ReactElement => {
    let optionList: string[] = [];
    Object.values(ExpiryUnit).map((unit) => {
        optionList.push(unit);
    });
    optionList = optionList.filter((option) => option !== 'term');

    const capDurationAmount = userInput?.cap.durationAmount;
    const capDurationUnit = userInput?.cap.durationAmount;

    const [showCapStartInfo, setCapStartInfo] = useState<boolean>(isADayDuration(capDurationAmount, capDurationUnit));
    const [durationAmount, setDurationAmount] = useState(capDurationAmount);
    const [durationUnit, setDurationUnit] = useState(capDurationUnit);
    const [isStartOfDay, showStartOfDay] = useState(!!userInput?.capStart?.startDay);

    const updateDurationUnit = (durationUnit: string): void => {
        setDurationUnit(durationUnit);
        setCapStartInfo(isADayDuration(durationAmount, durationUnit));
    };

    const updateDurationAmount = (durationAmount: string): void => {
        setDurationAmount(durationAmount);
        setCapStartInfo(isADayDuration(durationAmount, durationUnit));
    };

    return (
        <FullColumnLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/createCaps" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <h1 className="govuk-heading-l" id="create-caps-page-heading">
                        Create your fare caps
                    </h1>
                    <span id="purchase-method-option-hint" className="govuk-hint">
                        If cap duration is more than a day, please provide input for the cap start.
                    </span>

                    <div className="govuk-grid-row">
                        <fieldset className="govuk-fieldset">
                            <legend className="govuk-fieldset__legend govuk-visually-hidden">
                                Enter details for cap
                            </legend>
                            <div className="flex-container">
                                <div className="govuk-!-margin-left-4 govuk-!-margin-right-2">
                                    <FormGroupWrapper errors={errors} errorIds={[`cap-name`]}>
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
                                                    defaultValue={userInput && userInput.cap ? userInput.cap.name : ''}
                                                />
                                            </FormElementWrapper>
                                        </>
                                    </FormGroupWrapper>
                                </div>
                                <div className="govuk-!-margin-left-2 govuk-!-margin-right-2">
                                    <FormGroupWrapper errors={errors} errorIds={['cap-price']}>
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
                                                            defaultValue={
                                                                userInput && userInput.cap.price
                                                                    ? userInput.cap.price
                                                                    : ''
                                                            }
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
                                                            defaultValue={
                                                                userInput && userInput.cap.durationAmount
                                                                    ? userInput.cap.durationAmount
                                                                    : ''
                                                            }
                                                            onChange={(e): void => updateDurationAmount(e.target.value)}
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
                                                            defaultValue={
                                                                userInput && userInput.cap.durationUnits
                                                                    ? userInput.cap.durationUnits
                                                                    : ''
                                                            }
                                                            onChange={(e): void => updateDurationUnit(e.target.value)}
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

                            {showCapStartInfo ? (
                                <div className="govuk-!-margin-left-4 govuk-!-margin-bottom-4">
                                    <h2 className="govuk-heading-l govuk-!-margin-top-6">
                                        Define when cap is calculated from
                                    </h2>
                                    <span id="fixed-weekdays-hint" className="govuk-hint">
                                        As your cap duration is a day or longer, you need to define when your cap
                                        starts.
                                    </span>
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
                                                onChange={(): void => showStartOfDay(true)}
                                                defaultChecked={
                                                    userInput &&
                                                    userInput.capStart &&
                                                    userInput.capStart.type === 'fixedWeekdays'
                                                }
                                            />
                                            <label className="govuk-label govuk-radios__label" htmlFor="fixed-weekdays">
                                                Fixed weekdays
                                            </label>
                                        </div>

                                        <div
                                            className={`govuk-radios__conditional ${
                                                !isStartOfDay && 'govuk-visually-hidden'
                                            }`}
                                            id="conditional-fixed-weekdays"
                                        >
                                            <div className="govuk-form-group">
                                                <label className="govuk-label" htmlFor="start-day">
                                                    Start
                                                </label>
                                                <select className="govuk-select" id="start-day" name="startDay">
                                                    {daysOfWeek.map((day) => (
                                                        <option
                                                            defaultValue={day[0]}
                                                            key={day}
                                                            value={day}
                                                            selected={
                                                                userInput &&
                                                                userInput.capStart &&
                                                                userInput.capStart.startDay &&
                                                                userInput.capStart.startDay === day
                                                            }
                                                        >
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
                                                onChange={(): void => showStartOfDay(false)}
                                                defaultChecked={
                                                    userInput &&
                                                    userInput.capStart &&
                                                    userInput.capStart.type === 'rollingDays'
                                                }
                                            />
                                            <label className="govuk-label govuk-radios__label" htmlFor="rolling-days">
                                                Rolling days
                                            </label>
                                            <div id="rolling-days-hint" className="govuk-hint govuk-radios__hint">
                                                Rolling seven days from first journey
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
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

    const editId = Number.isInteger(Number(ctx.query.id)) ? Number(ctx.query.id) : undefined;
    const nocCode = getAndValidateNoc(ctx);

    //console.log(userInput);
    if (editId && !userInput) {
        userInput = await getCapByNocAndId(nocCode, editId);
        if (!userInput) {
            throw new Error('No entity for this NOC matches the passed id');
        }
    }
    //console.log(userInput);

    return {
        props: {
            errors: isWithErrors(capsAttribute) ? capsAttribute.errors : [],
            csrfToken,
            ...(userInput && { userInput }),
            ...(editId && { editId }),
        },
    };
};

export default CreateCaps;
