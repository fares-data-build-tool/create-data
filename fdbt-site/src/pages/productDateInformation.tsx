import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { getSessionAttribute } from '../utils/sessions';
import { PRODUCT_DATE_ATTRIBUTE } from '../constants';
import { isTicketPeriodAttributeWithErrors } from '../interfaces/typeGuards';
import ErrorSummary from '../components/ErrorSummary';
import RadioConditionalInput, { RadioConditionalInputFieldset } from '../components/RadioConditionalInput';
import { getCsrfToken, getErrorsByIds } from '../utils';
import { ProductDateInformation } from './api/productDateInformation';

const title = 'Product Date Information - Create Fares Data Service';
const description = 'Product Date Information page of the Create Fares Data Service';
const productDatingHintText =
    'If not supplied, your start date will default to today and your end date will default to 100 years from today';

export interface ProductDateInformationProps {
    errors: ErrorInfo[];
    fieldsets: RadioConditionalInputFieldset;
    dates?: ProductDateInformation;
    csrfToken: string;
}

export const getFieldsets = (errors: ErrorInfo[]): RadioConditionalInputFieldset => {
    return {
        heading: {
            id: 'product-dates-information',
            content: 'Is there a start or end date for your product(s)?',
            hidden: true,
        },
        radios: [
            {
                id: 'product-dates-required',
                name: 'productDates',
                value: 'Yes',
                dataAriaControls: 'product-dates-required-conditional',
                label: 'Yes',
                hint: {
                    id: '',
                    content: '',
                },
                inputType: 'date',
                inputs: [
                    {
                        id: 'start-date',
                        name: 'startDate',
                        label: 'Start Date',
                    },
                    {
                        id: 'end-date',
                        name: 'endDate',
                        label: 'End Date',
                    },
                ],
                inputErrors: getErrorsByIds(['start-date-day', 'end-date-day'], errors),
            },
            {
                id: 'product-dates-information-not-required',
                name: 'productDates',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: getErrorsByIds(['product-dates-required'], errors),
    };
};

const ProductDateInfo = ({ csrfToken, errors = [], fieldsets, dates }: ProductDateInformationProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description}>
            <CsrfForm action="/api/productDateInformation" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <div
                        className={`govuk-form-group ${
                            fieldsets.radioError.length > 0 ? 'govuk-form-group--error' : ''
                        }`}
                    >
                        <fieldset className="govuk-fieldset" aria-describedby="product-date-information-heading">
                            <legend className="govuk-heading-l" id="product-date-information-heading">
                                {fieldsets.heading.content}
                            </legend>
                            <span className="govuk-hint" id="product-dating-hint">
                                {productDatingHintText}
                            </span>
                            <RadioConditionalInput key={fieldsets.heading.id} fieldset={fieldsets} dates={dates} />
                        </fieldset>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: ProductDateInformationProps } => {
    const csrfToken = getCsrfToken(ctx);
    const productDateAttribute = getSessionAttribute(ctx.req, PRODUCT_DATE_ATTRIBUTE);

    const errors: ErrorInfo[] =
        productDateAttribute && isTicketPeriodAttributeWithErrors(productDateAttribute)
            ? productDateAttribute.errors
            : [];

    const fieldsets: RadioConditionalInputFieldset = getFieldsets(errors);

    return {
        props: {
            errors,
            fieldsets,
            dates:
                productDateAttribute && isTicketPeriodAttributeWithErrors(productDateAttribute)
                    ? productDateAttribute.dates
                    : {
                          startDateDay: '',
                          startDateMonth: '',
                          startDateYear: '',
                          endDateDay: '',
                          endDateMonth: '',
                          endDateYear: '',
                      },
            csrfToken,
        },
    };
};

export default ProductDateInfo;
