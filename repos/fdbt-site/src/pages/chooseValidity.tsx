import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import { NextPageContext } from 'next';
import _ from 'lodash';
import TwoThirdsLayout from '../layout/Layout';
import { PRODUCT_DETAILS_COOKIE, DAYS_VALID_COOKIE, PASSENGER_TYPE_COOKIE } from '../constants';
import CsrfForm from '../components/CsrfForm';
import { CustomAppProps } from '../interfaces';

const title = 'Choose Validity - Fares Data Build Tool';
const description = 'Choose Validity page of the Fares Data Build Tool';

interface ValidityProps {
    productName: string;
    productPrice: string;
    passengerType: string;
    daysValid: string;
    error: string;
}

const ChooseValidity = ({
    productName,
    productPrice,
    passengerType,
    daysValid,
    error,
    csrfToken,
}: ValidityProps & CustomAppProps): ReactElement => {
    let isError = false;

    if (error !== '') {
        isError = true;
    }

    return (
        <TwoThirdsLayout title={title} description={description}>
            <CsrfForm action="/api/chooseValidity" method="post" csrfToken={csrfToken}>
                <>
                    <div className="govuk-form-group">
                        <fieldset className="govuk-fieldset" aria-describedby="choose-validity-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="page-heading">
                                    What duration is your product valid for?
                                </h1>
                                <p className="govuk-hint">
                                    Product: {productName} - £{productPrice} - {_.upperFirst(passengerType)}
                                </p>
                            </legend>
                            <div className={`govuk-form-group ${isError ? 'govuk-form-group--error' : ''}`}>
                                <label className="govuk-label" htmlFor="validity">
                                    How many days is your product valid for?
                                </label>
                                <p className="govuk-hint">
                                    Enter a whole number, for example a day ticket would be 1 and two weeks would be 14
                                </p>
                                <span id="product-validity-error" className="govuk-error-message">
                                    <span className={isError ? '' : 'govuk-visually-hidden'}>{error}</span>
                                </span>
                                <input
                                    className={`govuk-input govuk-input--width-2 ${
                                        isError ? 'govuk-input--error' : ''
                                    }`}
                                    id="validity"
                                    name="validityInput"
                                    type="text"
                                    defaultValue={daysValid}
                                />
                            </div>
                        </fieldset>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);
    const productCookie = cookies[PRODUCT_DETAILS_COOKIE];
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
        if (validity.error === undefined) {
            validity.error = '';
        }
    }

    return {
        props: {
            productName: product.productName,
            productPrice: product.productPrice,
            passengerType: passengerType.passengerType,
            daysValid: !validityCookie ? '' : validity.daysValid,
            error: !validityCookie ? '' : validity.error,
        },
    };
};

export default ChooseValidity;
