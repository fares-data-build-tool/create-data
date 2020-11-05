import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import upperFirst from 'lodash/upperFirst';
import TwoThirdsLayout from '../layout/Layout';
import {
    OPERATOR_COOKIE,
    PASSENGER_TYPE_ATTRIBUTE,
    PRODUCT_DETAILS_ATTRIBUTE,
    FARE_ZONE_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
} from '../constants';
import { ErrorInfo, NextPageContextWithSession, ProductData, ProductInfo, ProductInfoWithErrors } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import FormElementWrapper, { FormGroupWrapper } from '../components/FormElementWrapper';
import ErrorSummary from '../components/ErrorSummary';
import { getSessionAttribute } from '../utils/sessions';
import { isPassengerType } from '../interfaces/typeGuards';
import { isFareZoneAttributeWithErrors } from './csvZoneUpload';
import { isServiceListAttributeWithErrors } from './serviceList';
import { getCsrfToken, isSchemeOperator } from '../utils';

const title = 'Product Details - Create Fares Data Service';
const description = 'Product Details entry page of the Create Fares Data Service';

type ProductDetailsProps = {
    product: ProductInfo | null;
    operator: string;
    passengerType: string;
    hintText?: string;
    errors: ErrorInfo[];
    csrfToken: string;
};

export const isProductInfoWithErrors = (
    productDetailsAttribute: ProductInfo | ProductData | ProductInfoWithErrors,
): productDetailsAttribute is ProductInfoWithErrors =>
    (productDetailsAttribute as ProductInfoWithErrors)?.errors !== undefined;

export const isProductInfo = (
    productDetailsAttribute: ProductInfo | ProductData | ProductInfoWithErrors | undefined,
): productDetailsAttribute is ProductInfo => (productDetailsAttribute as ProductInfo)?.productName !== undefined;

export const isProductData = (
    productDetailsAttribute: ProductInfo | ProductData | ProductInfoWithErrors | undefined,
): productDetailsAttribute is ProductData => (productDetailsAttribute as ProductData).products !== undefined;

const ProductDetails = ({
    product,
    operator,
    passengerType,
    hintText,
    csrfToken,
    errors,
}: ProductDetailsProps): ReactElement => {
    const productName = product && product.productName;
    const productPrice = product && product.productPrice;

    return (
        <TwoThirdsLayout title={title} description={description}>
            <CsrfForm action="/api/productDetails" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <div className="govuk-form-group">
                        <fieldset className="govuk-fieldset" aria-describedby="product-details-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="product-details-page-heading">
                                    Enter your product details
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="service-operator-hint">
                                {operator} - {hintText} - {upperFirst(passengerType)}
                            </span>
                            <FormGroupWrapper errors={errors} errorId="product-details-name">
                                <>
                                    <label className="govuk-label" htmlFor="product-details-name">
                                        Product Name
                                    </label>
                                    <span className="govuk-hint" id="product-name-hint">
                                        Must be between 2 and 50 characters long
                                    </span>
                                    <FormElementWrapper
                                        errors={errors}
                                        errorId="product-details-name"
                                        errorClass="govuk-input--error"
                                    >
                                        <input
                                            className="govuk-input govuk-input--width-30 govuk-product-name-input__inner__input"
                                            id="product-details-name"
                                            name="productDetailsNameInput"
                                            type="text"
                                            aria-describedby="product-name-hint"
                                            maxLength={50}
                                            defaultValue={productName || ''}
                                        />
                                    </FormElementWrapper>
                                </>
                            </FormGroupWrapper>
                            <FormGroupWrapper errors={errors} errorId="product-details-price">
                                <>
                                    <label className="govuk-label" htmlFor="product-details-price">
                                        Product Price, in pounds
                                    </label>
                                    <span className="govuk-hint" id="product-price-hint">
                                        For example, 2.99
                                    </span>
                                    <div className="govuk-currency-input">
                                        <div className="govuk-currency-input__inner">
                                            <span className="govuk-currency-input__inner__unit">£</span>
                                            <FormElementWrapper
                                                errors={errors}
                                                errorId="product-details-price"
                                                errorClass="govuk-input--error"
                                            >
                                                <input
                                                    className="govuk-input govuk-input--width-10 govuk-currency-input__inner__input"
                                                    name="productDetailsPriceInput"
                                                    data-non-numeric
                                                    type="text"
                                                    id="product-details-price"
                                                    aria-describedby="product-price-hint"
                                                    defaultValue={productPrice || ''}
                                                />
                                            </FormElementWrapper>
                                        </div>
                                    </div>
                                </>
                            </FormGroupWrapper>
                        </fieldset>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: ProductDetailsProps } => {
    const csrfToken = getCsrfToken(ctx);
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];

    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);
    const serviceListAttribute = getSessionAttribute(ctx.req, SERVICE_LIST_ATTRIBUTE);
    const fareZoneAttribute = getSessionAttribute(ctx.req, FARE_ZONE_ATTRIBUTE);
    const productDetailsAttribute = getSessionAttribute(ctx.req, PRODUCT_DETAILS_ATTRIBUTE);

    let hintText = '';

    if (!operatorCookie || (!fareZoneAttribute && !serviceListAttribute)) {
        throw new Error('Failed to retrieve the necessary cookies and/or session objects.');
    }

    if (!isPassengerType(passengerTypeAttribute)) {
        throw new Error('Failed to retrieve passenger type cookie info for product details page.');
    }

    const operatorTypeInfo = JSON.parse(operatorCookie);
    const { operator } = operatorTypeInfo;

    if (fareZoneAttribute && !isFareZoneAttributeWithErrors(fareZoneAttribute)) {
        hintText = fareZoneAttribute.fareZoneName;
    } else if (serviceListAttribute && !isServiceListAttributeWithErrors(serviceListAttribute)) {
        const { selectedServices } = serviceListAttribute;
        hintText = selectedServices.length > 1 ? 'Multiple Services' : selectedServices[0].split('#')[0];
    }

    return {
        props: {
            product: productDetailsAttribute && isProductInfo(productDetailsAttribute) ? productDetailsAttribute : null,
            operator: isSchemeOperator(ctx) ? operator : operator.operatorPublicName,
            passengerType: passengerTypeAttribute.passengerType,
            errors:
                productDetailsAttribute && isProductInfoWithErrors(productDetailsAttribute)
                    ? productDetailsAttribute.errors
                    : [],
            hintText,
            csrfToken,
        },
    };
};

export default ProductDetails;
