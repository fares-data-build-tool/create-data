import React, { ReactElement } from 'react';
import upperFirst from 'lodash/upperFirst';
import TwoThirdsLayout from '../layout/Layout';
import {
    OPERATOR_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    PRODUCT_DETAILS_ATTRIBUTE,
    FARE_ZONE_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
} from '../constants/attributes';
import {
    ErrorInfo,
    NextPageContextWithSession,
    ProductData,
    ProductInfo,
    ProductInfoWithErrors,
    MultiOperatorInfo,
    PointToPointProductInfo,
} from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import FormElementWrapper, { FormErrorBlock, FormGroupWrapper } from '../components/FormElementWrapper';
import ErrorSummary from '../components/ErrorSummary';
import { getSessionAttribute } from '../utils/sessions';
import { isPassengerType } from '../interfaces/typeGuards';
import { isFareZoneAttributeWithErrors } from './csvZoneUpload';
import { isServiceListAttributeWithErrors } from './serviceList';
import { getCsrfToken } from '../utils';
import ExpirySelector from 'src/components/ExpirySelector';

const title = 'Point to Point Period Product - Create Fares Data Service';
const description = 'Point to point period product details entry page of the Create Fares Data Service';

interface PointToPointPeriodProductProps {
    product: PointToPointProductInfo | null;
    operator: string;
    passengerType: string;
    hintText?: string;
    errors: ErrorInfo[];
    csrfToken: string;
}

const ProductDetails = ({
    product,
    operator,
    passengerType,
    hintText,
    csrfToken,
    errors,
}: PointToPointPeriodProductProps): ReactElement => {
    const { productName } = product || {};
    const { expiryTime, expiryUnit } = product?.carnetDetails || {};

    return (
        <TwoThirdsLayout title={title} description={description}>
            <CsrfForm action="/api/pointToPointPeriodProduct" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <div className="govuk-form-group">
                        <fieldset
                            className="govuk-fieldset"
                            aria-describedby="point-to-point-period-product-page-heading"
                        >
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="point-to-point-period-product-page-heading">
                                    Enter your product details
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="service-operator-hint">
                                {operator} - {hintText} - {upperFirst(passengerType)}
                            </span>
                            <FormGroupWrapper errors={errors} errorIds={['point-to-point-period-product-name']}>
                                <>
                                    <label className="govuk-label" htmlFor="point-to-point-period-product-name">
                                        Product Name
                                    </label>
                                    <span className="govuk-hint" id="product-name-hint">
                                        Must be between 2 and 50 characters long
                                    </span>
                                    <FormElementWrapper
                                        errors={errors}
                                        errorId="point-to-point-period-product-name"
                                        errorClass="govuk-input--error"
                                    >
                                        <input
                                            className="govuk-input govuk-input--width-30 govuk-product-name-input__inner__input"
                                            id="point-to-point-period-product-name"
                                            name="productNameInput"
                                            type="text"
                                            aria-describedby="product-name-hint"
                                            maxLength={50}
                                            defaultValue={productName || ''}
                                        />
                                    </FormElementWrapper>
                                </>
                            </FormGroupWrapper>
                            <FormGroupWrapper
                                errors={errors}
                                errorIds={['product-details-expiry-quantity', 'product-details-expiry-unit']}
                            >
                                <>
                                    <label className="govuk-label" htmlFor="product-details-expiry">
                                        Period
                                    </label>
                                    <span className="govuk-hint" id="product-expiry-hint">
                                        For example, 2 months
                                    </span>

                                    <FormErrorBlock
                                        errors={errors}
                                        errorIds={['product-details-expiry-quantity', 'product-details-expiry-unit']}
                                    />

                                    <ExpirySelector
                                        defaultDuration={expiryTime}
                                        defaultUnit={expiryUnit}
                                        quantityName="periodQuantity"
                                        quantityId="product-details-expiry-quantity"
                                        hintId="product-expiry-hint"
                                        unitName="periodUnitt"
                                        unitId="product-details-expiry-unit"
                                        errors={errors}
                                    />
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

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: PointToPointPeriodProductProps } => {
    const csrfToken = getCsrfToken(ctx);

    const operatorAttribute = getSessionAttribute(ctx.req, OPERATOR_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);
    const serviceListAttribute = getSessionAttribute(ctx.req, SERVICE_LIST_ATTRIBUTE);
    const multipleOperatorsServicesAttribute = getSessionAttribute(ctx.req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE);
    const fareZoneAttribute = getSessionAttribute(ctx.req, FARE_ZONE_ATTRIBUTE);
    const productDetailsAttribute = getSessionAttribute(ctx.req, PRODUCT_DETAILS_ATTRIBUTE);

    let hintText = '';

    if (
        !operatorAttribute?.name ||
        (!fareZoneAttribute && !serviceListAttribute && !multipleOperatorsServicesAttribute)
    ) {
        throw new Error('Failed to retrieve the necessary session objects.');
    }

    if (!isPassengerType(passengerTypeAttribute)) {
        throw new Error('Failed to retrieve passenger type attribute for product details page.');
    }

    if (fareZoneAttribute && !isFareZoneAttributeWithErrors(fareZoneAttribute)) {
        hintText = fareZoneAttribute;
    } else if (serviceListAttribute && !isServiceListAttributeWithErrors(serviceListAttribute)) {
        const { selectedServices } = serviceListAttribute;
        hintText = selectedServices.length > 1 ? 'Multiple services' : selectedServices[0].lineName;
    } else if (multipleOperatorsServicesAttribute) {
        hintText = `Multiple services across ${
            (multipleOperatorsServicesAttribute as MultiOperatorInfo[]).length
        } operators`;
    }

    return {
        props: {
            product: productDetailsAttribute && isProductInfo(productDetailsAttribute) ? productDetailsAttribute : null,
            operator: operatorAttribute.name,
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
