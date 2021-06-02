import React, { ReactElement } from 'react';
import upperFirst from 'lodash/upperFirst';
import { FullColumnLayout } from '../layout/Layout';
import {
    OPERATOR_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    MULTIPLE_PRODUCT_ATTRIBUTE,
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
} from '../constants/attributes';
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

    const operatorAttribute = getSessionAttribute(ctx.req, OPERATOR_ATTRIBUTE);
    const numberOfProductsAttribute = getSessionAttribute(ctx.req, NUMBER_OF_PRODUCTS_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);

    if (
        !operatorAttribute?.name ||
        !isNumberOfProductsAttribute(numberOfProductsAttribute) ||
        !isPassengerType(passengerTypeAttribute)
    ) {
        throw new Error('Necessary attributes not found to show multiple products page');
    }

    const numberOfProductsToDisplay = numberOfProductsAttribute.numberOfProductsInput;

    const multiProductAttribute = getSessionAttribute(ctx.req, MULTIPLE_PRODUCT_ATTRIBUTE);

    return {
        props: {
            numberOfProductsToDisplay,
            operatorName: operatorAttribute.name,
            passengerType: passengerTypeAttribute.passengerType,
            errors: isWithErrors(multiProductAttribute) ? multiProductAttribute.errors : [],
            userInput: multiProductAttribute ? multiProductAttribute.products : [],
            csrfToken,
        },
    };
};

export default MultipleProducts;
