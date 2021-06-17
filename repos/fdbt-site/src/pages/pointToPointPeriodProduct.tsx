import React, { ReactElement } from 'react';
import upperFirst from 'lodash/upperFirst';
import TwoThirdsLayout from '../layout/Layout';
import { POINT_TO_POINT_PRODUCT_ATTRIBUTE, OPERATOR_ATTRIBUTE } from '../constants/attributes';
import { ErrorInfo, NextPageContextWithSession, PointToPointPeriodProduct } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import FormElementWrapper, { FormErrorBlock, FormGroupWrapper } from '../components/FormElementWrapper';
import ErrorSummary from '../components/ErrorSummary';
import { getSessionAttribute } from '../utils/sessions';
import { getCsrfToken } from '../utils';
import ExpirySelector from 'src/components/ExpirySelector';

const title = 'Point to Point Period Product - Create Fares Data Service';
const description = 'Point to point period product details entry page of the Create Fares Data Service';

interface PointToPointPeriodProductProps {
    product: PointToPointPeriodProduct | null;
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
    const periodValue = product?.productDuration || '';
    const periodUnits = product?.productDurationUnits || undefined;

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
                                        defaultDuration={periodValue}
                                        defaultUnit={periodUnits}
                                        quantityName="productDuration"
                                        quantityId="product-details-expiry-quantity"
                                        hintId="product-expiry-hint"
                                        unitName="durationUnits"
                                        unitId="product-details-expiry-unit"
                                        errors={errors}
                                        carnet
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
    const products = getSessionAttribute(ctx.req, POINT_TO_POINT_PRODUCT_ATTRIBUTE);
    let hintText = '';

    if (!operatorAttribute?.name) {
        throw new Error('Failed to retrieve the necessary session objects.');
    }

    return {
        props: {
            product: null,
            operator: operatorAttribute.name,
            passengerType: 'adult',
            errors: products && 'errors' in products ? products.errors : [],
            hintText,
            csrfToken,
        },
    };
};

export default ProductDetails;
