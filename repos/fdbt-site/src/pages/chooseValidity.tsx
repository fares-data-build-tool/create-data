import React, { ReactElement } from 'react';
import upperFirst from 'lodash/upperFirst';
import TwoThirdsLayout from '../layout/Layout';
import { PRODUCT_DETAILS_ATTRIBUTE, DURATION_VALID_ATTRIBUTE, PASSENGER_TYPE_ATTRIBUTE } from '../constants/attributes';
import CsrfForm from '../components/CsrfForm';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import FormElementWrapper, { FormGroupWrapper } from '../components/FormElementWrapper';
import ErrorSummary from '../components/ErrorSummary';
import { isPassengerType } from '../interfaces/typeGuards';
import { getSessionAttribute } from '../utils/sessions';
import { isProductInfo } from './productDetails';
import { getCsrfToken } from '../utils';

const title = 'Choose Validity - Create Fares Data Service';
const description = 'Choose Validity page of the Create Fares Data Service';

interface ValidityProps {
    productName: string;
    productPrice: string;
    passengerType: string;
    amount: string;
    errors: ErrorInfo[];
    csrfToken: string;
    duration: string;
}

const ChooseValidity = ({
    productName,
    productPrice,
    passengerType,
    amount,
    errors,
    duration,
    csrfToken,
}: ValidityProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description}>
        <CsrfForm action="/api/chooseValidity" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <fieldset className="govuk-fieldset">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                        <h1 className="govuk-fieldset__heading">How long is your product valid for?</h1>
                    </legend>
                    <div className="govuk-hint">
                        Product: {productName} - £{productPrice} - {upperFirst(passengerType)}
                    </div>
                    <div className="govuk-hint" id="choose-validity-page-hint">
                        Enter a whole number, and select a duration type. For example, 7 months.
                    </div>
                    <FormGroupWrapper errorId="validity" errors={errors}>
                        <>
                            <label className="govuk-label" htmlFor="validity">
                                Number
                            </label>
                            <FormElementWrapper errors={errors} errorId="validity" errorClass="govuk-input--error">
                                <input
                                    className="govuk-input govuk-input--width-2"
                                    id="validity"
                                    name="validityInput"
                                    type="text"
                                    defaultValue={amount}
                                    aria-describedby="choose-validity-page-hint"
                                />
                            </FormElementWrapper>
                        </>
                    </FormGroupWrapper>
                    <FormGroupWrapper errorId="validity-units" errors={errors}>
                        <>
                            <label className="govuk-label" htmlFor="validity-units">
                                Duration
                            </label>
                            <FormElementWrapper
                                errors={errors}
                                errorId="validity-units"
                                errorClass="govuk-select--error"
                            >
                                <select
                                    className="govuk-select"
                                    id="validity-units"
                                    name="duration"
                                    defaultValue={duration}
                                >
                                    <option selected value="" disabled>
                                        Select a duration
                                    </option>
                                    <option value="hour">Hours</option>
                                    <option value="day">Days</option>
                                    <option value="week">Weeks</option>
                                    <option value="month">Months</option>
                                    <option value="year">Years</option>
                                </select>
                            </FormElementWrapper>
                        </>
                    </FormGroupWrapper>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </fieldset>
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: ValidityProps } => {
    const csrfToken = getCsrfToken(ctx);
    const validityInfo = getSessionAttribute(ctx.req, DURATION_VALID_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);
    const productAttribute = getSessionAttribute(ctx.req, PRODUCT_DETAILS_ATTRIBUTE);

    if (!isProductInfo(productAttribute)) {
        throw new Error('Failed to retrieve productAttribute info for choose validity page.');
    }

    if (!isPassengerType(passengerTypeAttribute)) {
        throw new Error('Failed to retrieve passenger type session info for choose validity page.');
    }

    let amount;
    let duration;

    if (validityInfo) {
        if (validityInfo.amount) {
            amount = validityInfo.amount;
        }

        if (validityInfo.duration) {
            duration = validityInfo.duration;
        }
    }

    return {
        props: {
            productName: productAttribute.productName,
            productPrice: productAttribute.productPrice,
            passengerType: passengerTypeAttribute.passengerType,
            amount: amount ?? '',
            errors: validityInfo?.errors ?? [],
            duration: duration ?? '',
            csrfToken,
        },
    };
};

export default ChooseValidity;
