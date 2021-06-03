import React, { ReactElement } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TwoThirdsLayout from '../layout/Layout';
import { NextPageContextWithSession, RadioOption } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import { getCsrfToken } from '../utils/index';
import RadioButtons from '../components/RadioButtons';

const title = 'test title ';
const description = 'test desc';

// const errorId = 'fare-type-single';

interface ProductExpiryProps {
    csrfToken: string;
}

export const buildUuid = (noc: string): string => {
    const uuid = uuidv4();

    return noc + uuid.substring(0, 8);
};

const buildRadioProps = (): RadioOption[] => {
    const radios = [
        {
            value: '24hrs',
            label: 'After 24 hrs after purchase',
            hint: 'For Example, a ticket purchased at 3pm will be valid until 3pm the next day',
        },
        {
            value: 'endOfCalDay',
            label: 'End of calendar day',
            hint: 'For Example, a ticket purchased at 3pm will be valid untill midnight',
        },
        {
            value: 'endOfServDay',
            label: 'End of service day',
            hint:
                'For Example, a ticket purchased at 3pm will be valid through midnight and inline with the end of your service day',
        },
    ];

    return radios;
};

const ProductExpiry = ({ csrfToken }: ProductExpiryProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={[]}>
            <CsrfForm action="/api/NEWAPI" method="post" csrfToken={csrfToken}>
                {/* TODO ^^ LATER */}
                <>
                    <ErrorSummary errors={[]} />
                    <div className={`govuk-form-group ${[].length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="product-expiry-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="product-expiry-page-heading">
                                    When does the ticket day end?
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="product-expiry-operator-hint">
                                Carnet Period
                            </span>
                            <RadioButtons options={buildRadioProps()} inputName="productExpiry" />
                        </fieldset>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: ProductExpiryProps } => {
    const csrfToken = getCsrfToken(ctx);
    console.log('hello');
    return { props: { csrfToken } };
};

export default ProductExpiry;
