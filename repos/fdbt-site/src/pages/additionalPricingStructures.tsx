/* eslint-disable jsx-a11y/no-onchange */
import React, { ReactElement } from 'react';
import { FullColumnLayout } from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import { AdditionalPricing, ErrorInfo, NextPageContextWithSession, WithErrors } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import { getCsrfToken } from '../utils';
import { getSessionAttribute } from '../../src/utils/sessions';
import { ADDITIONAL_PRICING_ATTRIBUTE } from '../../src/constants/attributes';
import { isWithErrors } from '../../src/interfaces/typeGuards';

const title = 'Additional Pricing Structures - Create Fares Data Service';
const description = 'Define Additional Pricing Structures page of the Create Fares Data Service';

interface SelectTimeRestrictionsProps {
    csrfToken: string;
    errors: ErrorInfo[];
    additionalPricingStructures: AdditionalPricing | WithErrors<AdditionalPricing>;
}

const AdditionalPricingStructures = ({
    csrfToken,
    errors,
    additionalPricingStructures,
}: SelectTimeRestrictionsProps): ReactElement => {
    return (
        <FullColumnLayout title={title} description={description} errors={errors}>
            <ErrorSummary errors={errors} />
            <CsrfForm action="/api/additionalPricingStructures" method="post" csrfToken={csrfToken}>
                <>
                    <fieldset className="govuk-fieldset">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading">Are there additional pricing structures</h1>
                        </legend>
                        <label className="govuk-label" htmlFor="additional-discounts">
                            Do you have additional discounts related to this product
                        </label>
                        <div id="additional-discounts-hint" className="govuk-hint">
                            Different levels of discount
                        </div>
                        <div className="govuk-radios govuk-radios--conditional" data-module="govuk-radios">
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="additional-discounts"
                                    name="additionalDiscounts"
                                    type="radio"
                                    value="yes"
                                    data-aria-controls="conditional-additional-discounts"
                                    defaultChecked={
                                        errors.length > 0 && additionalPricingStructures.additionalDiscounts === 'yes'
                                    }
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="yes-choice">
                                    Yes
                                </label>
                            </div>

                            <div
                                className="govuk-radios__conditional govuk-radios__conditional--hidden"
                                id="conditional-additional-discounts"
                            >
                                <>
                                    <h1 className="govuk-heading-m" id="pricing-structure-start-heading">
                                        When does the next structure start
                                    </h1>
                                    <div className="govuk-form-group">
                                        <label className="govuk-label" htmlFor="pricing-structure-start">
                                            Pricing structure starts after
                                        </label>
                                        <div id="pricing-structure-start-hint" className="govuk-hint">
                                            Time allowance after first journey
                                        </div>
                                        <div className="govuk-input__wrapper">
                                            <input
                                                className="govuk-input govuk-input--width-3"
                                                id="pricing-structure-start"
                                                name="pricingStructureStart"
                                                type="text"
                                                defaultValue={additionalPricingStructures.pricingStructureStart}
                                            />
                                            <div className="govuk-input__suffix" aria-hidden="true">
                                                min
                                            </div>
                                        </div>
                                    </div>
                                    <div className="govuk-form-group">
                                        <label className="govuk-label" htmlFor="structure-discount">
                                            Structure discount
                                        </label>
                                        <div id="structure-discount-hint" className="govuk-hint">
                                            Percentage discount
                                        </div>
                                        <div className="govuk-input__wrapper">
                                            <input
                                                className="govuk-input govuk-input--width-3"
                                                id="structure-discount"
                                                name="structureDiscount"
                                                type="text"
                                                defaultValue={additionalPricingStructures.structureDiscount}
                                            />
                                            <div className="govuk-input__suffix" aria-hidden="true">
                                                %
                                            </div>
                                        </div>
                                    </div>
                                </>
                            </div>

                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="additional-discounts-2"
                                    name="additionalDiscounts"
                                    type="radio"
                                    value="no"
                                    data-aria-controls="conditional-additional-discounts-2"
                                    defaultChecked={
                                        errors.length > 0 && additionalPricingStructures.additionalDiscounts === 'no'
                                    }
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="no-choice">
                                    No
                                </label>
                            </div>
                        </div>
                        <br />
                        <input
                            type="submit"
                            value="Continue"
                            id="continue-button"
                            className="govuk-button govuk-!-margin-right-2"
                        />
                    </fieldset>
                </>
            </CsrfForm>
        </FullColumnLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: SelectTimeRestrictionsProps } => {
    const csrfToken = getCsrfToken(ctx);
    const additionalPricingStructures: AdditionalPricing | WithErrors<AdditionalPricing> | undefined =
        getSessionAttribute(ctx.req, ADDITIONAL_PRICING_ATTRIBUTE);

    let errors: ErrorInfo[] = [];

    if (additionalPricingStructures && isWithErrors(additionalPricingStructures)) {
        errors = additionalPricingStructures.errors;
    }

    return {
        props: {
            csrfToken,
            errors,
            additionalPricingStructures: additionalPricingStructures || {
                additionalDiscounts: '',
                pricingStructureStart: '',
                structureDiscount: '',
            },
        },
    };
};

export default AdditionalPricingStructures;
