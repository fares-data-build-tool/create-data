import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import upperFirst from 'lodash/upperFirst';
import { FullColumnLayout } from '../layout/Layout';
import {
    OPERATOR_COOKIE,
    MULTIPLE_PRODUCT_ATTRIBUTE,
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
    PASSENGER_TYPE_COOKIE,
} from '../constants';
import ProductRow from '../components/ProductRow';
import { ErrorInfo, CustomAppProps, NextPageContextWithSession } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import {
    MultiProduct,
    BaseMultipleProductAttribute,
    BaseMultipleProductAttributeWithErrors,
} from './api/multipleProducts';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { isNumberOfProductsAttribute } from './howManyProducts';
import { MultipleProductAttribute } from './api/multipleProductValidity';

const title = 'Multiple Product - Fares Data Build Tool';
const description = 'Multiple Product entry page of the Fares Data Build Tool';

export interface MultipleProductProps {
    numberOfProductsToDisplay: string;
    operator: string;
    passengerType: string;
    errors?: ErrorInfo[];
    userInput: MultiProduct[];
}

const MultipleProducts = ({
    numberOfProductsToDisplay,
    operator,
    passengerType,
    errors = [],
    userInput = [],
    csrfToken,
}: MultipleProductProps & CustomAppProps): ReactElement => (
    <FullColumnLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/multipleProducts" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="multiple-product-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="multiple-product-page-heading">
                                Enter your product details
                            </h1>
                        </legend>
                        <span className="govuk-hint" id="service-operator-hint">
                            {operator} - {numberOfProductsToDisplay} Products - {upperFirst(passengerType)}
                        </span>
                    </fieldset>
                    <div className="govuk-inset-text">For example, Super Saver ticket - £4.95 - 2</div>
                </div>
                <div className="govuk-grid-row">
                    <ProductRow
                        numberOfProductsToDisplay={numberOfProductsToDisplay}
                        errors={errors}
                        userInput={userInput}
                    />
                </div>
            </>
        </CsrfForm>
    </FullColumnLayout>
);

export const isBaseMultipleProductAttributeWithErrors = (
    multiProductAttribute:
        | undefined
        | BaseMultipleProductAttribute
        | BaseMultipleProductAttributeWithErrors
        | MultipleProductAttribute,
): multiProductAttribute is BaseMultipleProductAttributeWithErrors =>
    !!multiProductAttribute && (multiProductAttribute as BaseMultipleProductAttributeWithErrors).errors !== undefined;

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: MultipleProductProps } => {
    const cookies = parseCookies(ctx);
    const numberOfProductsAttribute = getSessionAttribute(ctx.req, NUMBER_OF_PRODUCTS_ATTRIBUTE);

    if (
        !cookies[OPERATOR_COOKIE] ||
        !isNumberOfProductsAttribute(numberOfProductsAttribute) ||
        !cookies[PASSENGER_TYPE_COOKIE]
    ) {
        throw new Error('Necessary cookies/session not found to show multiple products page');
    }

    const operatorCookie = cookies[OPERATOR_COOKIE];
    const multiProductAttribute = getSessionAttribute(ctx.req, MULTIPLE_PRODUCT_ATTRIBUTE);
    const passengerTypeInfo = JSON.parse(cookies[PASSENGER_TYPE_COOKIE]);
    const numberOfProductsToDisplay = numberOfProductsAttribute.numberOfProductsInput;
    const { operator } = JSON.parse(operatorCookie);

    if (isBaseMultipleProductAttributeWithErrors(multiProductAttribute) && multiProductAttribute.errors.length > 0) {
        const { errors } = multiProductAttribute;
        return {
            props: {
                numberOfProductsToDisplay,
                operator: operator.operatorPublicName,
                passengerType: passengerTypeInfo.passengerType,
                errors,
                userInput: multiProductAttribute.products,
            },
        };
    }

    return {
        props: {
            numberOfProductsToDisplay,
            operator: operator.operatorPublicName,
            passengerType: passengerTypeInfo.passengerType,
            userInput: [],
        },
    };
};

export default MultipleProducts;
