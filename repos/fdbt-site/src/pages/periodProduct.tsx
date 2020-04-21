import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE, PERIOD_PRODUCT, CSV_ZONE_UPLOAD_COOKIE, PERIOD_SINGLE_OPERATOR_SERVICES } from '../constants';
import { PeriodProductType } from '../interfaces';

const title = 'FareType - Fares data build tool';
const description = 'Fare Type selection page of the Fares data build tool';

type PeriodProduct = {
    product: PeriodProductType;
    operator: string;
    zoneName?: string;
};

const PeriodProduct = ({ product, operator, zoneName }: PeriodProduct): ReactElement => {
    const productName = product && product.productName;
    const productPrice = product && product.productPrice;
    const productNameError = product && product.productNameError;
    const productPriceError = product && product.productPriceError;

    let priceErrorMessage = '';
    let nameErrorMessage = '';
    if (product.productPriceError !== '') {
        switch (productPriceError) {
            case 'empty':
                priceErrorMessage = 'Enter a Product Price';
                break;
            case 'notCurrency':
                priceErrorMessage = 'Enter a valid currency';
                break;
            case 'zero':
                priceErrorMessage = 'Product Price cannot be zero';
                break;
            default:
                priceErrorMessage = 'Invalid input';
        }

        if (product.productNameError !== '') {
            switch (productNameError) {
                case 'empty':
                    nameErrorMessage = 'Enter a Product Name';
                    break;
                case 'short':
                    nameErrorMessage = 'Product Name cannot be 1 character';
                    break;
                default:
                    nameErrorMessage = 'Invalid input';
            }
        }
    }

    return (
        <Layout title={title} description={description}>
            <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
                <form action="/api/periodProduct" method="post">
                    <div className="govuk-form-group">
                        <fieldset className="govuk-fieldset" aria-describedby="period-product-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                                <h1 className="govuk-fieldset__heading" id="period-product-page-heading">
                                    Enter your product details
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="service-operator-hint">
                                {operator} - {zoneName}
                            </span>
                        </fieldset>
                        <div className={`govuk-form-group ${productNameError ? 'govuk-form-group--error' : ''}`}>
                            <label className="govuk-label" htmlFor="periodProductName">
                                Product Name
                            </label>
                            <span className="govuk-hint" id="product-name-hint">
                                Please enter the name of your product
                            </span>
                            <span id="product-price-error" className="govuk-error-message">
                                <span className={productNameError ? '' : 'govuk-visually-hidden'}>
                                    {nameErrorMessage}
                                </span>
                            </span>
                            <input
                                className={`govuk-input govuk-input--width-30 govuk-product-name-input__inner__input ${
                                    productNameError ? 'govuk-input--error' : ''
                                } `}
                                id="periodProductName"
                                name="periodProductNameInput"
                                type="text"
                                maxLength={50}
                                defaultValue={productName}
                            />
                        </div>
                        <div className={`govuk-form-group ${productPriceError ? 'govuk-form-group--error' : ''}`}>
                            <label className="govuk-label" htmlFor="periodProductPrice">
                                Product Price
                            </label>
                            <span className="govuk-hint" id="product-price-hint">
                                For example, £2.99
                            </span>
                            <span id="product-price-error" className="govuk-error-message">
                                <span className={productPriceError ? '' : 'govuk-visually-hidden'}>
                                    {priceErrorMessage}
                                </span>
                            </span>
                            <div className="govuk-currency-input">
                                <div className="govuk-currency-input__inner">
                                    <span className="govuk-currency-input__inner__unit">£</span>
                                    <input
                                        className={`govuk-input govuk-input--width-10 govuk-currency-input__inner__input ${
                                            productPriceError ? 'govuk-input--error' : ''
                                        }`}
                                        aria-label="Enter amount in pounds"
                                        name="periodProductPriceInput"
                                        data-non-numeric
                                        type="text"
                                        id="periodProductPrice"
                                        defaultValue={productPrice}
                                    />
                                </div>
                            </div>
                        </div>
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

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);
    const periodProductCookie = cookies[PERIOD_PRODUCT];
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const zoneCookie = cookies[CSV_ZONE_UPLOAD_COOKIE];
    const singleOperatorCookie = cookies[PERIOD_SINGLE_OPERATOR_SERVICES];

    let props = {};

    if (!operatorCookie) {
        throw new Error('Failed to retrieve operator cookie info for period product page.');
    }

    if (!zoneCookie && !singleOperatorCookie) {
        throw new Error('Failed to retrieve zone cookie info for period product page.');
    }

    const operatorInfo = JSON.parse(operatorCookie);

    if (zoneCookie) {
        const { fareZoneName } = JSON.parse(zoneCookie);
        props = {
            zoneName: fareZoneName,
        };
    }

    if (singleOperatorCookie) {
        const { selectedServices } = JSON.parse(singleOperatorCookie);
        props = {
            zoneName: selectedServices.length > 1 ? 'Multiple Services' : selectedServices[0].lineName,
        };
    }

    return {
        props: {
            product: !periodProductCookie ? {} : JSON.parse(periodProductCookie),
            operator: operatorInfo.operator,
            ...props,
        },
    };
};

export default PeriodProduct;
