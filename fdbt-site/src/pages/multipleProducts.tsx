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
import { ErrorInfo, NextPageContextWithSession, MultiProduct } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import CsrfForm from '../components/CsrfForm';
import { isPassengerType, isWithErrors } from '../interfaces/typeGuards';
import { getSessionAttribute } from '../utils/sessions';
import { isNumberOfProductsAttribute } from './howManyProducts';
import { getCsrfToken } from '../utils';

const title = 'Multiple Product - Create Fares Data Service';
const description = 'Multiple Product entry page of the Create Fares Data Service';

interface MultipleProductProps {
    numberOfProductsToDisplay: string;
    operatorName: string;
    passengerType: string;
    errors?: ErrorInfo[];
    userInput: MultiProduct[];
    csrfToken: string;
}

const MultipleProducts = ({
    numberOfProductsToDisplay,
    operatorName,
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
                    {operatorName} - {numberOfProductsToDisplay} Products - {upperFirst(passengerType)}
                </span>
                <div className="govuk-inset-text">For example, Super Saver ticket - 4.95 - 2 - Days</div>
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

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: MultipleProductProps } => {
    const csrfToken = getCsrfToken(ctx);
    const cookies = parseCookies(ctx);

    const operatorCookie = cookies[OPERATOR_COOKIE];
    const numberOfProductsAttribute = getSessionAttribute(ctx.req, NUMBER_OF_PRODUCTS_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);

    if (
        !operatorCookie ||
        !isNumberOfProductsAttribute(numberOfProductsAttribute) ||
        !isPassengerType(passengerTypeAttribute)
    ) {
        throw new Error('Necessary cookies/session not found to show multiple products page');
    }

    const { name } = JSON.parse(operatorCookie);
    const numberOfProductsToDisplay = numberOfProductsAttribute.numberOfProductsInput;

    const multiProductAttribute = getSessionAttribute(ctx.req, MULTIPLE_PRODUCT_ATTRIBUTE);

    if (isWithErrors(multiProductAttribute) && multiProductAttribute.errors.length > 0) {
        const { errors } = multiProductAttribute;
        return {
            props: {
                numberOfProductsToDisplay,
                operatorName: name,
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
            operatorName: name,
            passengerType: passengerTypeAttribute.passengerType,
            errors: isWithErrors(multiProductAttribute) ? multiProductAttribute.errors : [],
            userInput: multiProductAttribute ? multiProductAttribute.products : [],
            csrfToken,
        },
    };
};

export default MultipleProducts;
