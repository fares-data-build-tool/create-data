import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import upperFirst from 'lodash/upperFirst';
import { FullColumnLayout } from '../layout/Layout';
import {
    OPERATOR_COOKIE,
    PASSENGER_TYPE_ATTRIBUTE,
    MULTIPLE_PRODUCT_ATTRIBUTE,
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
} from '../constants';
import ProductRow from '../components/ProductRow';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import {
    MultiProduct,
    BaseMultipleProductAttribute,
    BaseMultipleProductAttributeWithErrors,
} from './api/multipleProducts';
import CsrfForm from '../components/CsrfForm';
import { isPassengerType } from '../interfaces/typeGuards';
import { getSessionAttribute } from '../utils/sessions';
import { isNumberOfProductsAttribute } from './howManyProducts';
import { MultipleProductAttribute } from './api/multipleProductValidity';
import { getCsrfToken } from '../utils';

const title = 'Multiple Product - Create Fares Data Service';
const description = 'Multiple Product entry page of the Create Fares Data Service';

export interface MultipleProductProps {
    numberOfProductsToDisplay: string;
    operator: string;
    passengerType: string;
    errors?: ErrorInfo[];
    userInput: MultiProduct[];
    csrfToken: string;
}

const MultipleProducts = ({
    numberOfProductsToDisplay,
    operator,
    passengerType,
    errors = [],
    userInput = [],
    csrfToken,
}: MultipleProductProps): ReactElement => (
    <FullColumnLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/multipleProducts" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <h1 className="govuk-heading-l" id="multiple-product-page-heading">
                    Enter your product details
                </h1>
                <span className="govuk-hint" id="service-operator-hint">
                    {operator} - {numberOfProductsToDisplay} Products - {upperFirst(passengerType)}
                </span>
                <div className="govuk-inset-text">For example, Super Saver ticket - 4.95 - 2</div>
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
    const csrfToken = getCsrfToken(ctx);
    const cookies = parseCookies(ctx);
    const numberOfProductsAttribute = getSessionAttribute(ctx.req, NUMBER_OF_PRODUCTS_ATTRIBUTE);

    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);

    if (
        !cookies[OPERATOR_COOKIE] ||
        !isNumberOfProductsAttribute(numberOfProductsAttribute) ||
        !isPassengerType(passengerTypeAttribute)
    ) {
        throw new Error('Necessary cookies/session not found to show multiple products page');
    }

    const operatorCookie = cookies[OPERATOR_COOKIE];
    const multiProductAttribute = getSessionAttribute(ctx.req, MULTIPLE_PRODUCT_ATTRIBUTE);
    const numberOfProductsToDisplay = numberOfProductsAttribute.numberOfProductsInput;
    const { operator } = JSON.parse(operatorCookie);

    if (isBaseMultipleProductAttributeWithErrors(multiProductAttribute) && multiProductAttribute.errors.length > 0) {
        const { errors } = multiProductAttribute;

        return {
            props: {
                numberOfProductsToDisplay,
                operator: operator.operatorPublicName,
                passengerType: passengerTypeAttribute.passengerType,
                errors,
                userInput: multiProductAttribute.products,
                csrfToken,
            },
        };
    }

    return {
        props: {
            numberOfProductsToDisplay,
            operator: operator.operatorPublicName,
            passengerType: passengerTypeAttribute.passengerType,
            userInput: [],
            csrfToken,
        },
    };
};

export default MultipleProducts;
