import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import upperFirst from 'lodash/upperFirst';
import { FullColumnLayout } from '../layout/Layout';
import {
    MULTIPLE_PRODUCT_ATTRIBUTE,
    OPERATOR_COOKIE,
    PASSENGER_TYPE_ATTRIBUTE,
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
} from '../constants';
import { ErrorInfo, CustomAppProps, NextPageContextWithSession } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { isPassengerType } from '../interfaces/typeGuards';
import { isNumberOfProductsAttribute } from './howManyProducts';
import { isBaseMultipleProductAttributeWithErrors } from './multipleProducts';
import { Product } from './api/multipleProductValidity';

const title = 'Multiple Product Validity - Create Fares Data Service';
const description = 'Multiple Product Validity selection page of the Create Fares Data Service';

const errorId = 'twenty-four-hours-row-0';

interface MultipleProductValidityProps {
    operator: string;
    passengerType: string;
    numberOfProducts: string;
    multipleProducts: Product[];
    errors: ErrorInfo[];
}

const MultipleProductValidity = ({
    operator,
    passengerType,
    numberOfProducts,
    multipleProducts,
    errors,
    csrfToken,
}: MultipleProductValidityProps & CustomAppProps): ReactElement => (
    <FullColumnLayout title={title} description={description} errors={errors}>
        <CsrfForm
            action="/api/multipleProductValidity"
            method="post"
            className="multiple-product-validity-page"
            csrfToken={csrfToken}
        >
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <h1 className="govuk-heading-l" id="multiple-product-validity-page-heading">
                        When does the product expire?
                    </h1>
                    <span className="govuk-hint" id="operator-products-hint">
                        {operator} - {numberOfProducts} products - {upperFirst(passengerType)}
                    </span>
                    <span className="govuk-hint" id="multiple-product-validity-page-hint">
                        We need to know the time that this product would be valid until
                    </span>
                    <span className="govuk-hint" id="24hr-validity-type-hint">
                        24hr means a ticket purchased at 3pm will be valid until 3pm on its day of expiry
                    </span>
                    <span className="govuk-hint" id="calendar-validity-type-hint">
                        Calendar day means a ticket purchased at 3pm would be valid until midnight on its day of expiry
                    </span>
                    <FormElementWrapper errors={errors} errorId={errorId} errorClass="govuk-radios--error">
                        <table className="govuk-table multiple-product-validity-table">
                            <thead className="govuk-table__head">
                                <tr className="govuk-table__row">
                                    <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
                                        Product Name
                                    </th>
                                    <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
                                        Product Price
                                    </th>
                                    <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
                                        Product Duration
                                    </th>
                                    <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
                                        Choose Validity
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="govuk-table__body">
                                {multipleProducts.map((product, index) => (
                                    <tr className="govuk-table__row" key={product.productNameId}>
                                        <td className="govuk-table__cell">{product.productName}</td>
                                        <td className="govuk-table__cell">£{product.productPrice}</td>
                                        <td className="govuk-table__cell">
                                            {`${product.productDuration} day${
                                                Number(product.productDuration) > 1 ? 's' : ''
                                            }`}
                                        </td>
                                        <td className="govuk-table__cell">
                                            <span className="govuk-radios validity-select-wrapper">
                                                <span className="govuk-radios__item">
                                                    <input
                                                        className="govuk-radios__input"
                                                        id={`twenty-four-hours-row-${index}`}
                                                        name={`validity-row${index}`}
                                                        type="radio"
                                                        aria-describedby="24hr-validity-type-hint"
                                                        value="24hr"
                                                    />
                                                    <label
                                                        className="govuk-label govuk-radios__label"
                                                        htmlFor={`twenty-four-hours-row-${index}`}
                                                    >
                                                        <span className="govuk-visually-hidden">
                                                            When does the product expire? - {product.productName} -{' '}
                                                        </span>
                                                        24 hour
                                                    </label>
                                                </span>
                                                <span className="govuk-radios__item">
                                                    <input
                                                        className="govuk-radios__input"
                                                        id={`calendar-day-row-${index}`}
                                                        name={`validity-row${index}`}
                                                        type="radio"
                                                        aria-describedby="calendar-validity-type-hint"
                                                        value="endOfCalendarDay"
                                                    />
                                                    <label
                                                        className="govuk-label govuk-radios__label"
                                                        htmlFor={`calendar-day-row-${index}`}
                                                    >
                                                        <span className="govuk-visually-hidden">
                                                            When does the product expire? - {product.productName} -{' '}
                                                        </span>
                                                        Calendar
                                                    </label>
                                                </span>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </FormElementWrapper>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </FullColumnLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: MultipleProductValidityProps } => {
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];

    const multipleProductAttribute = getSessionAttribute(ctx.req, MULTIPLE_PRODUCT_ATTRIBUTE);
    const numberOfProductsAttribute = getSessionAttribute(ctx.req, NUMBER_OF_PRODUCTS_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);

    if (
        !operatorCookie ||
        !isNumberOfProductsAttribute(numberOfProductsAttribute) ||
        !multipleProductAttribute ||
        isBaseMultipleProductAttributeWithErrors(multipleProductAttribute) ||
        !isPassengerType(passengerTypeAttribute)
    ) {
        throw new Error('Necessary cookies/session not found to display the multiple product validity page');
    }
    const { operator } = JSON.parse(operatorCookie);

    const multipleProducts: Product[] = multipleProductAttribute.products;
    const numberOfProducts = numberOfProductsAttribute.numberOfProductsInput;

    const errors: ErrorInfo[] = [];
    const productWithErrors = multipleProducts.find(el => el.productValidityError);

    if (productWithErrors) {
        const error: ErrorInfo = {
            errorMessage: productWithErrors.productValidityError ?? '',
            id: errorId,
        };
        errors.push(error);
    }

    return {
        props: {
            operator: operator.operatorPublicName,
            passengerType: passengerTypeAttribute.passengerType,
            numberOfProducts,
            multipleProducts,
            errors,
        },
    };
};

export default MultipleProductValidity;
