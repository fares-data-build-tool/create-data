import React, { ReactElement, useState } from 'react';
import { FullColumnLayout } from '../layout/Layout';
import DistanceRow from '../components/DistanceRow';
import { DistancePricingData, ErrorInfo, NextPageContextWithSession, WithErrors } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import CsrfForm from '../components/CsrfForm';
import { getCsrfToken } from '../utils';
import { getSessionAttribute } from '../utils/sessions';
import { PRICING_PER_DISTANCE_ATTRIBUTE } from '../constants/attributes';
import FormElementWrapper, { FormGroupWrapper } from '../components/FormElementWrapper';
import { isWithErrors } from '../interfaces/typeGuards';

const title = 'Pricing Per Distance - Create Fares Data Service';
const description = 'Pricing Per Distance entry page of the Create Fares Data Service';

interface DefinePricingPerDistanceProps {
    errors: ErrorInfo[];
    csrfToken: string;
    pricingPerDistanceData: DistancePricingData;
    numberOfCapInitial: number;
}

const DefineCapPricingPerDistance = ({
    errors,
    csrfToken,
    pricingPerDistanceData,
    numberOfCapInitial,
}: DefinePricingPerDistanceProps): ReactElement => {
    const [numberOfCap, setNumberOfCaps] = useState(numberOfCapInitial);
    const [pricingPerDistance, setPricingPerDistance] = useState(pricingPerDistanceData);
    return (
        <FullColumnLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/pricingPerDistance" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <h1 className="govuk-heading-l" id="cap-capPricing-per-distance-heading">
                        Enter your distance details
                    </h1>

                    <div className="govuk-!-margin-bottom-3 govuk-!-margin-left-1">
                        <label className="govuk-label" htmlFor="capped-product-name">
                            Product name
                        </label>
                        <span className="govuk-hint">Enter the name of your product</span>
                        <div className="govuk-input__wrapper">
                            <FormElementWrapper
                                errors={errors}
                                errorId="capped-product-name"
                                errorClass="govuk-input--error"
                                hideText
                            >
                                <input
                                    className="govuk-input govuk-input--width-30"
                                    id="capped-product-name"
                                    name="productName"
                                    type="text"
                                    defaultValue={pricingPerDistance.productName || ''}
                                />
                            </FormElementWrapper>
                        </div>
                    </div>

                    <div className="flex-container">
                        <div className="govuk-!-margin-left-1 govuk-!-margin-right-2">
                            <FormGroupWrapper errors={errors} errorIds={['minimum-price']} hideErrorBar>
                                <>
                                    <label className="govuk-label" htmlFor="minimum-price">
                                        Minimum price (£)
                                    </label>
                                    <span className="govuk-hint" id="minimum-price-hint">
                                        e.g. £2.99
                                    </span>
                                    <div className="govuk-input__wrapper">
                                        <div className="govuk-input__prefix" aria-hidden="true">
                                            £
                                        </div>
                                        <FormElementWrapper
                                            errors={errors}
                                            errorId="minimum-price"
                                            errorClass="govuk-input--error"
                                            hideText
                                        >
                                            <input
                                                className="govuk-input govuk-input--width-3"
                                                id="minimum-price"
                                                name="minimumPrice"
                                                type="text"
                                                onChange={(e) => {
                                                    setPricingPerDistance({
                                                        ...pricingPerDistance,
                                                        minimumPrice: e.target.value,
                                                    });
                                                }}
                                                value={pricingPerDistance.minimumPrice || ''}
                                            />
                                        </FormElementWrapper>
                                    </div>
                                </>
                            </FormGroupWrapper>
                        </div>

                        <div className="govuk-!-margin-left-2 govuk-!-margin-right-2">
                            <FormGroupWrapper errors={errors} errorIds={['maximum-price']} hideErrorBar>
                                <>
                                    <label className="govuk-label" htmlFor="maximum-price">
                                        Maximum price (£)
                                    </label>

                                    <span className="govuk-hint" id="maximum-price-hint">
                                        e.g. £2.99
                                    </span>

                                    <div className="govuk-input__wrapper">
                                        <div className="govuk-input__prefix" aria-hidden="true">
                                            £
                                        </div>
                                        <FormElementWrapper
                                            errors={errors}
                                            errorId="maximum-price"
                                            errorClass="govuk-input--error"
                                            hideText
                                        >
                                            <input
                                                className="govuk-input govuk-input--width-3"
                                                id="maximum-price"
                                                name="maximumPrice"
                                                type="text"
                                                onChange={(e) => {
                                                    setPricingPerDistance({
                                                        ...pricingPerDistance,
                                                        maximumPrice: e.target.value,
                                                    });
                                                }}
                                                value={pricingPerDistance.maximumPrice || ''}
                                            />
                                        </FormElementWrapper>
                                    </div>
                                </>
                            </FormGroupWrapper>
                        </div>
                    </div>
                    <div className="govuk-grid-row">
                        <DistanceRow
                            numberOfCapToDisplay={numberOfCap}
                            errors={errors}
                            pricingPerDistance={pricingPerDistance}
                            setPricingPerDistance={setPricingPerDistance}
                        />
                        <div className="flex-container">
                            {numberOfCap < 10 ? (
                                <button
                                    id="add-another-button"
                                    type="button"
                                    className="govuk-button govuk-button--secondary govuk-!-margin-left-3 govuk-!-margin-bottom-3 time-restrictions-button-placement"
                                    onClick={(): void => {
                                        setNumberOfCaps(numberOfCap + 1);
                                        const items = [...pricingPerDistance.capPricing];
                                        let item = { ...pricingPerDistance.capPricing[numberOfCap - 1] };
                                        item.distanceTo = '';
                                        items[numberOfCap - 1] = item;
                                        setPricingPerDistance({
                                            ...pricingPerDistance,
                                            capPricing: items,
                                        });
                                        item = { ...pricingPerDistance.capPricing[numberOfCap] };
                                        item.distanceTo = 'Max';
                                        items[numberOfCap] = item;
                                        setPricingPerDistance({
                                            ...pricingPerDistance,
                                            capPricing: items,
                                        });
                                        for (let i = 0; i < numberOfCap; i += 1) {
                                            if (
                                                !pricingPerDistance?.capPricing[i]?.distanceFrom &&
                                                i !== 0 &&
                                                pricingPerDistance?.capPricing[i - 1]?.distanceTo
                                            ) {
                                                const items = [...pricingPerDistance.capPricing];
                                                item = { ...pricingPerDistance.capPricing[i] };
                                                item.distanceFrom = pricingPerDistance.capPricing[i - 1].distanceTo;
                                                item.distanceTo = '';
                                                items[i] = item;
                                                setPricingPerDistance({
                                                    ...pricingPerDistance,
                                                    capPricing: items,
                                                });
                                            }
                                        }
                                    }}
                                >
                                    Add another row
                                </button>
                            ) : (
                                ''
                            )}

                            {numberOfCap > 1 ? (
                                <button
                                    id="remove-button"
                                    type="button"
                                    className="govuk-button govuk-button--secondary govuk-!-margin-left-3 govuk-!-margin-bottom-3"
                                    onClick={(): void => {
                                        setPricingPerDistance((current) => {
                                            const copy = { ...current };
                                            if (numberOfCap !== 1) {
                                                if (copy?.capPricing[numberOfCap - 1]?.distanceFrom) {
                                                    copy.capPricing[numberOfCap - 1].distanceFrom = '';
                                                }
                                                if (copy?.capPricing[numberOfCap - 1]?.distanceTo) {
                                                    copy.capPricing[numberOfCap - 1].distanceTo = '';
                                                }
                                                if (copy?.capPricing[numberOfCap - 1]?.pricePerKm) {
                                                    copy.capPricing[numberOfCap - 1].pricePerKm = '';
                                                }
                                            }
                                            return { ...copy };
                                        });
                                        setNumberOfCaps(numberOfCap - 1);
                                    }}
                                >
                                    Remove last row
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

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: DefinePricingPerDistanceProps } => {
    const csrfToken = getCsrfToken(ctx);
    const pricingPerDistanceData: DistancePricingData | WithErrors<DistancePricingData> | undefined =
        getSessionAttribute(ctx.req, PRICING_PER_DISTANCE_ATTRIBUTE);
    let errors: ErrorInfo[] = [];
    if (pricingPerDistanceData && isWithErrors(pricingPerDistanceData)) {
        errors = pricingPerDistanceData.errors;
    }

    return {
        props: {
            errors,
            pricingPerDistanceData: pricingPerDistanceData || {
                capPricing: [{ distanceFrom: '0', distanceTo: 'Max', pricePerKm: '' }],
                minimumPrice: '',
                maximumPrice: '',
                productName: '',
            },
            csrfToken,
            numberOfCapInitial: pricingPerDistanceData?.capPricing?.length || 1,
        },
    };
};

export default DefineCapPricingPerDistance;
