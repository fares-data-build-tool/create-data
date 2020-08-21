import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import { NextPageContext } from 'next';
import upperFirst from 'lodash/upperFirst';
import TwoThirdsLayout from '../layout/Layout';
import { PRODUCT_DETAILS_ATTRIBUTE, DAYS_VALID_COOKIE, PASSENGER_TYPE_COOKIE } from '../constants';
import CsrfForm from '../components/CsrfForm';
import { CustomAppProps, ErrorInfo } from '../interfaces';
import FormElementWrapper from '../components/FormElementWrapper';
import ErrorSummary from '../components/ErrorSummary';

const title = 'Choose Validity - Fares Data Build Tool';
const description = 'Choose Validity page of the Fares Data Build Tool';

interface ValidityProps {
    productName: string;
    productPrice: string;
    passengerType: string;
    daysValid: string;
    errors: ErrorInfo[];
}

const ChooseValidity = ({
    productName,
    productPrice,
    passengerType,
    daysValid,
    errors,
    csrfToken,
}: ValidityProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description}>
        <CsrfForm action="/api/chooseValidity" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${errors.length ? 'govuk-form-group--error' : ''}`}>
                    <fieldset className="govuk-fieldset" aria-describedby="choose-validity-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="choose-validity-page-heading">
                                How many days is your product valid for?
                            </h1>
                            <p className="govuk-hint">
                                Product: {productName} - £{productPrice} - {upperFirst(passengerType)}
                            </p>
                            <label className="govuk-visually-hidden" htmlFor="validity">
                                Days valid
                            </label>
                            <p className="govuk-hint" id="choose-validity-page-hint">
                                Enter a whole number. For example: a day ticket would be 1 and two weeks would be 14
                            </p>
                        </legend>
                        <FormElementWrapper errors={errors} errorId="validity-error" errorClass="govuk-input--error">
                            <input
                                className="govuk-input govuk-input--width-2"
                                id="validity"
                                name="validityInput"
                                type="text"
                                defaultValue={daysValid}
                            />
                        </FormElementWrapper>
                    </fieldset>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContext): { props: ValidityProps } => {
    const cookies = parseCookies(ctx);
    const productCookie = cookies[PRODUCT_DETAILS_ATTRIBUTE];
    const passengerTypeCookie = cookies[PASSENGER_TYPE_COOKIE];
    const validityCookie = cookies[DAYS_VALID_COOKIE];

    if (!productCookie) {
        throw new Error('Failed to retrieve productCookie info for choose validity page.');
    }

    if (!passengerTypeCookie) {
        throw new Error('Failed to retrieve passengerTypeCookie info for choose validity page.');
    }

    const product = JSON.parse(productCookie);
    const passengerType = JSON.parse(passengerTypeCookie);

    let validity;

    if (validityCookie) {
        validity = JSON.parse(validityCookie);
    }

    return {
        props: {
            productName: product.productName,
            productPrice: product.productPrice,
            passengerType: passengerType.passengerType,
            daysValid: validity?.daysValid ?? '',
            errors: validity?.error ? [validity.error] : [],
        },
    };
};

export default ChooseValidity;
