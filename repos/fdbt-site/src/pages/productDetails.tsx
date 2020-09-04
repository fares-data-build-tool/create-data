import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import upperFirst from 'lodash/upperFirst';
import TwoThirdsLayout from '../layout/Layout';
import {
    OPERATOR_COOKIE,
    PRODUCT_DETAILS_ATTRIBUTE,
    FARE_ZONE_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
    PASSENGER_TYPE_COOKIE,
} from '../constants';
import {
    ProductInfo,
    CustomAppProps,
    NextPageContextWithSession,
    ProductData,
    ProductInfoWithErrors,
    ErrorInfo,
} from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import FormElementWrapper, { FormGroupWrapper } from '../components/FormElementWrapper';
import ErrorSummary from '../components/ErrorSummary';
import { getSessionAttribute } from '../utils/sessions';
import { isFareZoneAttributeWithErrors } from './csvZoneUpload';
import { isServiceListAttributeWithErrors } from './serviceList';

const title = 'Product Details - Fares Data Build Tool';
const description = 'Product Details entry page of the Fares Data Build Tool';

type ProductDetailsProps = {
    product: ProductInfo | null;
    operator: string;
    passengerType: string;
    hintText?: string;
    errors: ErrorInfo[];
};

export const isProductInfoWithErrors = (
    productDetailsAttribute: ProductInfo | ProductData | ProductInfoWithErrors,
): productDetailsAttribute is ProductInfoWithErrors =>
    (productDetailsAttribute as ProductInfoWithErrors)?.errors !== undefined;

export const isProductInfo = (
    productDetailsAttribute: ProductInfo | ProductData | ProductInfoWithErrors,
): productDetailsAttribute is ProductInfo => (productDetailsAttribute as ProductInfo)?.productName !== undefined;

const ProductDetails = ({
    product,
    operator,
    passengerType,
    hintText,
    csrfToken,
    errors,
}: ProductDetailsProps & CustomAppProps): ReactElement => {
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
                        </fieldset>
                        <FormGroupWrapper errors={errors} errorId="product-name-error">
                            <>
                                <label className="govuk-label" htmlFor="product-details-name">
                                    Product Name
                                </label>
                                <span className="govuk-hint" id="product-name-hint">
                                    Enter the name of your product
                                </span>
                                <FormElementWrapper
                                    errors={errors}
                                    errorId="product-name-error"
                                    errorClass="govuk-input--error"
                                >
                                    <input
                                        className="govuk-input govuk-input--width-30 govuk-product-name-input__inner__input"
                                        id="product-details-name"
                                        name="productDetailsNameInput"
                                        type="text"
                                        maxLength={50}
                                        defaultValue={productName || ''}
                                    />
                                </FormElementWrapper>
                            </>
                        </FormGroupWrapper>
                        <FormGroupWrapper errors={errors} errorId="product-price-error">
                            <>
                                <label className="govuk-label" htmlFor="product-details-price">
                                    Product Price
                                </label>
                                <span className="govuk-hint" id="product-price-hint">
                                    For example, £2.99
                                </span>
                                <div className="govuk-currency-input">
                                    <div className="govuk-currency-input__inner">
                                        <span className="govuk-currency-input__inner__unit">£</span>
                                        <FormElementWrapper
                                            errors={errors}
                                            errorId="product-price-error"
                                            errorClass="govuk-input--error"
                                        >
                                            <input
                                                className="govuk-input govuk-input--width-10 govuk-currency-input__inner__input"
                                                aria-label="Enter amount in pounds"
                                                name="productDetailsPriceInput"
                                                data-non-numeric
                                                type="text"
                                                id="product-details-price"
                                                defaultValue={productPrice || ''}
                                            />
                                        </FormElementWrapper>
                                    </div>
                                </div>
                            </>
                        </FormGroupWrapper>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: ProductDetailsProps } => {
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const passengerTypeCookie = cookies[PASSENGER_TYPE_COOKIE];

    const serviceListAttribute = getSessionAttribute(ctx.req, SERVICE_LIST_ATTRIBUTE);
    const fareZoneAttribute = getSessionAttribute(ctx.req, FARE_ZONE_ATTRIBUTE);
    const productDetailsAttribute = getSessionAttribute(ctx.req, PRODUCT_DETAILS_ATTRIBUTE);

    let hintText = '';

    if (!operatorCookie || !passengerTypeCookie || (!fareZoneAttribute && !serviceListAttribute)) {
        throw new Error('Failed to retrieve the necessary cookies and/or session objects.');
    }

    const operatorTypeInfo = JSON.parse(operatorCookie);
    const passengerTypeInfo = JSON.parse(passengerTypeCookie);
    const { passengerType } = passengerTypeInfo;
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
            operator: operator.operatorPublicName,
            passengerType,
            errors:
                productDetailsAttribute && isProductInfoWithErrors(productDetailsAttribute)
                    ? productDetailsAttribute.errors
                    : [],
            hintText,
        },
    };
};

export default ProductDetails;
