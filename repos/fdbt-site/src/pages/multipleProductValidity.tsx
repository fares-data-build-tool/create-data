/* eslint-disable jsx-a11y/no-onchange */
import React, { ReactElement, useState } from 'react';
import { parseCookies } from 'nookies';
import upperFirst from 'lodash/upperFirst';
import { FullColumnLayout } from '../layout/Layout';
import {
    MULTIPLE_PRODUCT_ATTRIBUTE,
    OPERATOR_COOKIE,
    PASSENGER_TYPE_ATTRIBUTE,
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
} from '../constants';
import { ErrorInfo, NextPageContextWithSession, MultiProduct } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { isPassengerType, isWithErrors } from '../interfaces/typeGuards';
import { isNumberOfProductsAttribute } from './howManyProducts';
import { getCsrfToken } from '../utils';

const title = 'Multiple Product Validity - Create Fares Data Service';
const description = 'Multiple Product Validity selection page of the Create Fares Data Service';

interface MultipleProductValidityProps {
    operatorName: string;
    passengerType: string;
    numberOfProducts: string;
    multipleProducts: MultiProduct[];
    errors: ErrorInfo[];
    csrfToken: string;
    endTimes: string[];
}

const MultipleProductValidity = ({
    operatorName,
    passengerType,
    numberOfProducts,
    multipleProducts,
    errors,
    csrfToken,
    endTimes,
}: MultipleProductValidityProps): ReactElement => {
    const [listOfEndTimes, setListOfEndTimes] = useState(endTimes || []);

    const handleSelection = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const id = event.target.id.toString();
        const index = id.split('-')[2];
        const idToShow = `validity-end-time-${index}`;

        if (event.currentTarget.value === 'endOfServiceDay') {
            setListOfEndTimes([...listOfEndTimes, idToShow]);
        } else {
            const removedItems = listOfEndTimes.filter(obj => obj !== idToShow);
            setListOfEndTimes([...removedItems]);
        }
    };

    return (
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
                            {operatorName} - {numberOfProducts} products - {upperFirst(passengerType)}
                        </span>
                        <span className="govuk-hint" id="multiple-product-validity-page-hint">
                            We need to know the time that this product would be valid until
                        </span>
                        <span className="govuk-hint" id="24hr-validity-type-hint">
                            24hr means a ticket purchased at 3pm will be valid until 3pm on its day of expiry
                        </span>
                        <span className="govuk-hint" id="calendar-validity-type-hint">
                            Calendar day means a ticket purchased at 3pm would be valid until midnight on its day of
                            expiry
                        </span>
                        <span className="govuk-hint" id="end-service-day-validity-type-hint">
                            End of service day means a ticket is valid beyond midnight and expires in line with the end
                            of your service day
                        </span>
                        <table className="govuk-table multiple-product-validity-table">
                            <thead className="govuk-table__head">
                                <tr className="govuk-table__row">
                                    <th scope="col" className="govuk-table__header govuk-!-width-one-fifth">
                                        Name
                                    </th>
                                    <th scope="col" className="govuk-table__header govuk-!-width-one-fifth">
                                        Price
                                    </th>
                                    <th scope="col" className="govuk-table__header govuk-!-width-one-fifth">
                                        Duration
                                    </th>
                                    <th scope="col" className="govuk-table__header govuk-!-width-one-fifth">
                                        Expiry
                                    </th>
                                    {listOfEndTimes.length > 0 && (
                                        <th scope="col" className="govuk-table__header govuk-!-width-one-fifth">
                                            End time for service day (24hr format)
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="govuk-table__body">
                                {multipleProducts.map((product, index) => {
                                    return (
                                        <tr className="govuk-table__row" key={product.productNameId}>
                                            <td className="govuk-table__cell">{product.productName}</td>
                                            <td className="govuk-table__cell">£{product.productPrice}</td>
                                            <td className="govuk-table__cell">
                                                {`${product.productDuration} ${product.productDurationUnits}${
                                                    Number(product.productDuration) > 1 ? 's' : ''
                                                }`}
                                            </td>
                                            <td className="govuk-table__cell">
                                                <FormElementWrapper
                                                    errors={errors}
                                                    errorId={`validity-option-${index}`}
                                                    errorClass="govuk-select--error"
                                                    hideText
                                                >
                                                    <select
                                                        className="govuk-select farestage-select"
                                                        id={`validity-option-${index}`}
                                                        name={`validity-option-${index}`}
                                                        aria-labelledby={`stop-name-header stop-${index} naptan-code-header naptan-${index}`}
                                                        onChange={handleSelection}
                                                        defaultValue={product.productValidity}
                                                    >
                                                        <option selected value="" disabled>
                                                            Select an expiry
                                                        </option>
                                                        <option value="24hr">24hr</option>
                                                        <option value="endOfCalendarDay">End of calendar day</option>
                                                        <option value="endOfServiceDay">End of service day</option>
                                                    </select>
                                                </FormElementWrapper>
                                            </td>
                                            <td className="govuk-table__cell">
                                                <FormElementWrapper
                                                    errors={errors}
                                                    errorId={`validity-end-time-${index}`}
                                                    errorClass="govuk-select--error"
                                                    hideText
                                                >
                                                    <input
                                                        id={`validity-end-time-${index}`}
                                                        className={`${
                                                            listOfEndTimes.includes(`validity-end-time-${index}`)
                                                                ? 'inputVisible'
                                                                : 'inputHidden'
                                                        } govuk-input govuk-input--width-4`}
                                                        name={`validity-end-time-${index}`}
                                                        defaultValue={product.productEndTime || ''}
                                                    />
                                                </FormElementWrapper>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </FullColumnLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: MultipleProductValidityProps } => {
    const csrfToken = getCsrfToken(ctx);
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];

    const multipleProductAttribute = getSessionAttribute(ctx.req, MULTIPLE_PRODUCT_ATTRIBUTE);
    const numberOfProductsAttribute = getSessionAttribute(ctx.req, NUMBER_OF_PRODUCTS_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);

    if (
        !operatorCookie ||
        !isNumberOfProductsAttribute(numberOfProductsAttribute) ||
        !multipleProductAttribute ||
        !isPassengerType(passengerTypeAttribute)
    ) {
        throw new Error('Necessary cookies/session not found to display the multiple product validity page');
    }
    const { name } = JSON.parse(operatorCookie);

    const multipleProducts: MultiProduct[] = multipleProductAttribute.products;
    const numberOfProducts = numberOfProductsAttribute.numberOfProductsInput;

    const endTimes: string[] = [];
    multipleProductAttribute.products.forEach(
        product => product.productEndTimeId && endTimes.push(product.productEndTimeId),
    );
    const errors: ErrorInfo[] = isWithErrors(multipleProductAttribute) ? multipleProductAttribute.errors : [];

    return {
        props: {
            operatorName: name,
            passengerType: passengerTypeAttribute.passengerType,
            numberOfProducts,
            multipleProducts,
            errors,
            csrfToken,
            endTimes,
        },
    };
};

export default MultipleProductValidity;
