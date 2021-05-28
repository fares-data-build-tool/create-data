import React, { ReactElement } from 'react';
import lowercase from 'lodash/lowerCase';
import TwoThirdsLayout from '../layout/Layout';
import {
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
} from '../constants/attributes';
import ErrorSummary from '../components/ErrorSummary';
import {
    ErrorInfo,
    NextPageContextWithSession,
    TicketRepresentationAttribute,
    FareType,
    NumberOfProductsAttributeWithErrors,
    NumberOfProductsAttribute,
} from '../interfaces';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { getCsrfToken } from '../utils';

const title = 'How Many Products - Create Fares Data Service';
const description = 'How Many Products entry page of the Create Fares Data Service';

interface HowManyProductsProps {
    errors: ErrorInfo[];
    fareType: string;
    pageHeading: string;
    csrfToken: string;
}

const HowManyProducts = ({ errors, fareType, pageHeading, csrfToken }: HowManyProductsProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/howManyProducts" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group${errors.length > 0 ? ' govuk-form-group--error' : ''}`}>
                    <label htmlFor="number-of-products">
                        <h1 className="govuk-heading-l" id="page-heading">
                            {pageHeading}
                        </h1>
                    </label>
                    <div className="govuk-hint" id="number-of-products-hint">
                        {`Enter the number of ${lowercase(fareType)} tickets below. Up to a maximum of 10 at once.`}
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

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: HowManyProductsProps } => {
    const csrfToken = getCsrfToken(ctx);
    const { fareType } = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE) as FareType;
    const numberOfProductsAttribute = getSessionAttribute(ctx.req, NUMBER_OF_PRODUCTS_ATTRIBUTE);
    const ticketType = getSessionAttribute(ctx.req, TICKET_REPRESENTATION_ATTRIBUTE) as TicketRepresentationAttribute;

    const pageHeading = `How many ${lowercase(fareType)} tickets do you have for ${
        ticketType && ticketType.name === 'geoZone' ? 'this geographic zone' : 'the selected services'
    }?`;
    const errors: ErrorInfo[] =
        numberOfProductsAttribute && isNumberOfProductsAttributeWithErrors(numberOfProductsAttribute)
            ? numberOfProductsAttribute.errors
            : [];

    return { props: { errors, fareType, pageHeading, csrfToken } };
};

export default HowManyProducts;
