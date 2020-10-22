import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import { NUMBER_OF_PRODUCTS_ATTRIBUTE, FARE_TYPE_ATTRIBUTE } from '../constants';
import ErrorSummary from '../components/ErrorSummary';
import { ErrorInfo, CustomAppProps, NextPageContextWithSession } from '../interfaces';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import { NumberOfProductsAttributeWithErrors, NumberOfProductsAttribute } from './api/howManyProducts';
import { getSessionAttribute } from '../utils/sessions';
import { FareType } from './api/fareType';

const title = 'How Many Products - Create Fares Data Service';
const description = 'How Many Products entry page of the Create Fares Data Service';

interface HowManyProductProps {
    errors: ErrorInfo[];
    multiOperator: boolean;
}

const HowManyProducts = ({ errors, multiOperator, csrfToken }: HowManyProductProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/howManyProducts" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group${errors.length > 0 ? ' govuk-form-group--error' : ''}`}>
                    <label htmlFor="number-of-products">
                        <h1 className="govuk-heading-l" id="page-heading">
                            {multiOperator
                                ? `How many multi operator tickets do you have for the selected operator(s) and/or service(s)?`
                                : `How many period tickets do you have for the selected services?`}
                        </h1>
                    </label>
                    <div className="govuk-hint" id="number-of-products-hint">
                        {multiOperator
                            ? `Enter the number of multi operator tickets below. Up to a maximum of 5 at once.`
                            : `Enter the number of period tickets below. Up to a maximum of 5 at once.`}
                    </div>
                    <FormElementWrapper errors={errors} errorId="number-of-products" errorClass="govuk-input--error">
                        <input
                            className="govuk-input govuk-input--width-2"
                            id="number-of-products"
                            name="numberOfProductsInput"
                            aria-describedby="number-of-products-hint"
                            type="text"
                            defaultValue={errors.length > 0 ? errors[0].userInput : ''}
                        />
                    </FormElementWrapper>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

const isNumberOfProductsAttributeWithErrors = (
    numberOfProductsAttribute: NumberOfProductsAttribute | NumberOfProductsAttributeWithErrors,
): numberOfProductsAttribute is NumberOfProductsAttributeWithErrors =>
    (numberOfProductsAttribute as NumberOfProductsAttributeWithErrors).errors !== undefined;

export const isNumberOfProductsAttribute = (
    numberOfProductsAttribute: undefined | NumberOfProductsAttribute | NumberOfProductsAttributeWithErrors,
): numberOfProductsAttribute is NumberOfProductsAttribute =>
    !!numberOfProductsAttribute &&
    (numberOfProductsAttribute as NumberOfProductsAttribute).numberOfProductsInput !== undefined;

export const getServerSideProps = (ctx: NextPageContextWithSession): {} => {
    const { fareType } = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE) as FareType;
    const numberOfProductsAttribute = getSessionAttribute(ctx.req, NUMBER_OF_PRODUCTS_ATTRIBUTE);
    const errors: ErrorInfo[] =
        numberOfProductsAttribute && isNumberOfProductsAttributeWithErrors(numberOfProductsAttribute)
            ? numberOfProductsAttribute.errors
            : [];
    return { props: { errors, multiOperator: fareType === 'multiOperator' } };
};

export default HowManyProducts;
