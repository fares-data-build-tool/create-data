import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import {
    OPERATOR_COOKIE,
    PRODUCT_DETAILS_COOKIE,
    CSV_ZONE_UPLOAD_COOKIE,
    SERVICE_LIST_COOKIE,
    PASSENGER_TYPE_COOKIE,
} from '../constants';
import { ProductInfo } from '../interfaces';

const title = 'Product Details - Fares Data Build Tool';
const description = 'Product Details entry page of the Fares Data Build Tool';

type ProductDetailsProps = {
    product: ProductInfo;
    operator: string;
    passengerType: string;
    hintText?: string;
};

const ProductDetails = ({ product, operator, passengerType, hintText }: ProductDetailsProps): ReactElement => {
    const productName = product && product.productName;
    const productPrice = product && product.productPrice;
    const productNameError = product && product.productNameError;
    const productPriceError = product && product.productPriceError;

    return (
        <Layout title={title} description={description}>
            <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
                <form action="/api/productDetails" method="post">
                    <div className="govuk-form-group">
                        <fieldset className="govuk-fieldset" aria-describedby="product-details-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                                <h1 className="govuk-fieldset__heading" id="product-details-page-heading">
                                    Enter your product details
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="service-operator-hint">
                                {operator} - {hintText} - {passengerType}
                            </span>
                        </fieldset>
                        <div className={`govuk-form-group ${productNameError ? 'govuk-form-group--error' : ''}`}>
                            <label className="govuk-label" htmlFor="productDetailsName">
                                Product Name
                            </label>
                            <span className="govuk-hint" id="product-name-hint">
                                Enter the name of your product
                            </span>
                            <span id="product-name-error" className="govuk-error-message">
                                <span className={productNameError ? '' : 'govuk-visually-hidden'}>
                                    {productNameError}
                                </span>
                            </span>
                            <input
                                className={`govuk-input govuk-input--width-30 govuk-product-name-input__inner__input ${
                                    productNameError ? 'govuk-input--error' : ''
                                } `}
                                id="productDetailsName"
                                name="productDetailsNameInput"
                                type="text"
                                maxLength={50}
                                defaultValue={productName}
                            />
                        </div>
                        <div className={`govuk-form-group ${productPriceError ? 'govuk-form-group--error' : ''}`}>
                            <label className="govuk-label" htmlFor="productDetailsPrice">
                                Product Price
                            </label>
                            <span className="govuk-hint" id="product-price-hint">
                                For example, £2.99
                            </span>
                            <span id="product-price-error" className="govuk-error-message">
                                <span className={productPriceError ? '' : 'govuk-visually-hidden'}>
                                    {productPriceError}
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
                                        name="productDetailsPriceInput"
                                        data-non-numeric
                                        type="text"
                                        id="productDetailsPrice"
                                        defaultValue={productPrice}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </form>
            </main>
        </Layout>
    );
};

export const getServerSideProps = (ctx: NextPageContext): { props: ProductDetailsProps } => {
    const cookies = parseCookies(ctx);
    const productDetailsCookie = cookies[PRODUCT_DETAILS_COOKIE];
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const passengerTypeCookie = cookies[PASSENGER_TYPE_COOKIE];
    const zoneCookie = cookies[CSV_ZONE_UPLOAD_COOKIE];
    const serviceListCookie = cookies[SERVICE_LIST_COOKIE];

    let props = {};

    if (!operatorCookie) {
        throw new Error('Failed to retrieve operator cookie info for product details page.');
    }

    if (!passengerTypeCookie) {
        throw new Error('Failed to retrieve passenger type cookie info for product details page.');
    }

    if (!zoneCookie && !serviceListCookie) {
        throw new Error('Failed to retrieve zone or service list cookie info for product details page.');
    }

    const operatorTypeInfo = JSON.parse(operatorCookie);
    const passengerTypeInfo = JSON.parse(passengerTypeCookie);
    const { passengerType } = passengerTypeInfo;
    const { operator } = operatorTypeInfo;

    if (zoneCookie) {
        const { fareZoneName } = JSON.parse(zoneCookie);
        props = {
            hintText: fareZoneName,
        };
    } else if (serviceListCookie) {
        const { selectedServices } = JSON.parse(serviceListCookie);
        props = {
            hintText: selectedServices.length > 1 ? 'Multiple Services' : selectedServices[0].split('#')[0],
        };
    }

    return {
        props: {
            product: !productDetailsCookie ? {} : JSON.parse(productDetailsCookie),
            operator,
            passengerType,
            ...props,
        },
    };
};

export default ProductDetails;
