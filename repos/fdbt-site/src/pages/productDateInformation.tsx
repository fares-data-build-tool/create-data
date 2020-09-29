import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import { CustomAppProps, ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { getSessionAttribute } from '../utils/sessions';
import { PRODUCT_DATE_ATTRIBUTE } from '../constants';
import { isProductDateAttributeWithErrors } from '../interfaces/typeGuards';
import ErrorSummary from '../components/ErrorSummary';
import RadioConditionalInput, { RadioConditionalInputFieldset } from '../components/RadioConditionalInput';
import { getErrorsByIds } from '../utils';
import { ProductDateInformation } from './api/productDateInformation';

const title = 'Product Date Information - Fares Data Build Tool';
const description = 'Product Date Information page of the Fares Data Build Tool';
const productDatingHintText =
    'If not supplied, your start date will default to today and your end date will default to 100 years from today';

export interface ProductDateInformationProps {
    errors: ErrorInfo[];
    fieldsets: RadioConditionalInputFieldset;
    dates?: ProductDateInformation;
}

export const getFieldsets = (errors: ErrorInfo[]): RadioConditionalInputFieldset => {
    return {
        heading: {
            id: 'product-dates-information',
            content: 'Is there a start or end date for your product?',
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
                    id: 'product-dates-required-restriction-hint',
                    content: 'Enter a start and/or end date',
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

const ProductDateInfo = ({
    csrfToken,
    errors = [],
    fieldsets,
    dates,
}: ProductDateInformationProps & CustomAppProps): ReactElement => {
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
                        <h1 className="govuk-heading-l" id="product-date-information-heading">
                            {fieldsets.heading.content}
                        </h1>
                        <span className="govuk-hint" id="product-dating-hint">
                            {productDatingHintText}
                        </span>
                        <RadioConditionalInput key={fieldsets.heading.id} fieldset={fieldsets} dates={dates} />
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: ProductDateInformationProps } => {
    const productDateAttribute = getSessionAttribute(ctx.req, PRODUCT_DATE_ATTRIBUTE);

    const errors: ErrorInfo[] =
        productDateAttribute && isProductDateAttributeWithErrors(productDateAttribute)
            ? productDateAttribute.errors
            : [];

    const fieldsets: RadioConditionalInputFieldset = getFieldsets(errors);

    return {
        props: {
            errors,
            fieldsets,
            dates:
                productDateAttribute && isProductDateAttributeWithErrors(productDateAttribute)
                    ? productDateAttribute.dates
                    : {
                          startDateDay: '',
                          startDateMonth: '',
                          startDateYear: '',
                          endDateDay: '',
                          endDateMonth: '',
                          endDateYear: '',
                      },
        },
    };
};

export default ProductDateInfo;
