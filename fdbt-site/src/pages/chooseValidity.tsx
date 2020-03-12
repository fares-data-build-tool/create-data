import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import { NextPageContext } from 'next';
import Layout from '../layout/Layout';
import { PERIOD_PRODUCT, VALIDITY_COOKIE } from '../constants';

const title = 'Select how long the period ticket is valid for - Fares data build tool';
const description = 'Period ticket validity length page of the Fares data build tool';

type ValidityProps = {
    productName: string;
    productPrice: string;
    daysValid: string;
    error: string;
};

const ChooseValidity = ({ productName, productPrice, daysValid, error }: ValidityProps): ReactElement => {
    let isError: boolean = false;

    if (error != '') {
        isError = true;
    }

    return (
        <Layout title={title} description={description}>
            <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
                <form action="/api/chooseValidity" method="post">
                    <div className={`govuk-form-group ${isError ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                                <h1 className="govuk-fieldset__heading" id="page-heading">
                                    What duration is your product valid for?
                                </h1>
                            </legend>
                            <div>
                                <label className="govuk-hint hint-text" htmlFor="validity">
                                    Product: {productName} - {productPrice}
                                </label>
                            </div>
                            <label className="govuk-label" htmlFor="validity">
                                How many days is your product valid for?
                            </label>
                            <div className="govuk-form-group">
                                <label className="govuk-hint hint-text" htmlFor="validity">
                                    Please enter a whole number, for example a day ticket would be 1 and two weeks would
                                    be 14
                                </label>
                                <span id="product-price-error" className="govuk-error-message">
                                    <span className={isError ? '' : 'govuk-visually-hidden'}>
                                        {error}
                                    </span>
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

ChooseValidity.getInitialProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);
    const productCookie = cookies[PERIOD_PRODUCT];
    const validityCookie = cookies[VALIDITY_COOKIE];

    if (!productCookie) {
        throw new Error('Failed to retrieve productCookie info for choose validity page.');
    }

    const product = JSON.parse(productCookie);

    let validity;

    if (validityCookie) {
        validity = JSON.parse(validityCookie);
    }

    return {
        productName: product.productName,
        productPrice: product.productPrice,
        daysValid: !validityCookie ? '' : validity.daysValid,
        error: !validityCookie ? '' : validity.error,
    };
};

export default ChooseValidity;
