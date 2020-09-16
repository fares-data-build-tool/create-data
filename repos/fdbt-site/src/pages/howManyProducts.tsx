import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import { NUMBER_OF_PRODUCTS_ATTRIBUTE } from '../constants';
import ErrorSummary from '../components/ErrorSummary';
import { ErrorInfo, CustomAppProps, NextPageContextWithSession } from '../interfaces';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import { NumberOfProductsAttributeWithErrors, NumberOfProductsAttribute } from './api/howManyProducts';
import { getSessionAttribute } from '../utils/sessions';

const title = 'How Many Products - Fares Data Build Tool';
const description = 'How Many Products entry page of the Fares Data Build Tool';

interface HowManyProductProps {
    errors: ErrorInfo[];
}

const HowManyProducts = ({ errors, csrfToken }: HowManyProductProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/howManyProducts" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group${errors.length > 0 ? ' govuk-form-group--error' : ''}`}>
                    <label htmlFor="number-of-products">
                        <h1 className="govuk-heading-l" id="page-heading">
                            How many period tickets do you have for the selected services?
                        </h1>
                    </label>
                    <div className="govuk-hint" id="number-of-products-hint">
                        Enter the number of period tickets below. Up to a maximum of 10 at once.
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
    const numberOfProductsAttribute = getSessionAttribute(ctx.req, NUMBER_OF_PRODUCTS_ATTRIBUTE);
    const errors: ErrorInfo[] =
        numberOfProductsAttribute && isNumberOfProductsAttributeWithErrors(numberOfProductsAttribute)
            ? numberOfProductsAttribute.errors
            : [];
    return { props: { errors } };
};

export default HowManyProducts;
