import React, { ReactElement, useState } from 'react';
import { FullColumnLayout } from '../layout/Layout';
import { MULTI_TAPS_PRICING_ATTRIBUTE, NUMBER_OF_TAPS_ATTRIBUTE } from '../constants/attributes';
import TapPricingRow from '../components/TapPricingRow';
import { ErrorInfo, NextPageContextWithSession, MultiTapPricing } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import CsrfForm from '../components/CsrfForm';
import { isMultiTapsPricingAttribute, isMultiTapsPricingAttributeWithErrors } from '../interfaces/typeGuards';
import { getSessionAttribute } from '../utils/sessions';
import { getCsrfToken } from '../utils';

const title = 'Taps Pricing - Create Fares Data Service';
const description = 'Pricing by multiple taps for capped product of the Create Fares Data Service';

interface MultiTapsPricingProps {
    errors?: ErrorInfo[];
    userInput: MultiTapPricing[];
    csrfToken: string;
    numberOfTapsToRender: number;
}

const MultiTapsPricings = ({
    errors = [],
    userInput = [],
    csrfToken,
    numberOfTapsToRender,
}: MultiTapsPricingProps): ReactElement => {
    const [numberOfTaps, setNumberOfTaps] = useState(numberOfTapsToRender);

    return (
        <FullColumnLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/multiTapsPricing" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <h1 className="govuk-heading-l" id="multiple-product-page-heading">
                        Enter your tap pricing
                    </h1>
                    <span className="govuk-hint govuk-!-margin-bottom-7" id="csv-upload-hint">
                        For example, if a passenger travels three times in the same day and the first journey is £3, the
                        second journey is £2 and the third journey is £0.50, you would create 3 taps below and enter the
                        prices accordingly.
                    </span>

                    <div className="govuk-grid-row">
                        <TapPricingRow numberOfTapsToDisplay={numberOfTaps} errors={errors} userInput={userInput} />
                        <div className="flex-container">
                            {numberOfTaps < 10 ? (
                                <button
                                    id="add-another-button"
                                    type="button"
                                    className="govuk-button govuk-button--secondary govuk-!-margin-left-3 govuk-!-margin-bottom-3 time-restrictions-button-placement"
                                    onClick={(): void => setNumberOfTaps(numberOfTaps + 1)}
                                >
                                    Add additional tap
                                </button>
                            ) : (
                                ''
                            )}

                            {numberOfTaps > 1 ? (
                                <button
                                    id="remove-button"
                                    type="button"
                                    className="govuk-button govuk-button--secondary govuk-!-margin-left-3 govuk-!-margin-bottom-3"
                                    onClick={(): void => setNumberOfTaps(numberOfTaps - 1)}
                                >
                                    Remove last tap
                                </button>
                            ) : (
                                ''
                            )}
                        </div>

                        <input
                            type="submit"
                            value="Continue"
                            id="continue-button"
                            className="govuk-button govuk-!-margin-left-3"
                        />
                    </div>
                </>
            </CsrfForm>
        </FullColumnLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: MultiTapsPricingProps } => {
    const csrfToken = getCsrfToken(ctx);
    const multiTapsPricingAttribute = getSessionAttribute(ctx.req, MULTI_TAPS_PRICING_ATTRIBUTE);
    const numberOfTapsToRender = getSessionAttribute(ctx.req, NUMBER_OF_TAPS_ATTRIBUTE) || 1;

    return {
        props: {
            errors: isMultiTapsPricingAttributeWithErrors(multiTapsPricingAttribute) ? multiTapsPricingAttribute : [],
            userInput: isMultiTapsPricingAttribute(multiTapsPricingAttribute) ? multiTapsPricingAttribute : [],
            csrfToken,
            numberOfTapsToRender: numberOfTapsToRender,
        },
    };
};

export default MultiTapsPricings;
