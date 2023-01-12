import React, { ReactElement, useState } from 'react';
import { FullColumnLayout } from '../layout/Layout';
import DistanceRow from '../components/DistanceRow';
import { DistanceCap, ErrorInfo, NextPageContextWithSession, WithErrors } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import CsrfForm from '../components/CsrfForm';
import { getCsrfToken } from '../utils';
import { getSessionAttribute } from '../../src/utils/sessions';
import { CAP_PRICING_PER_DISTANCE_ATTRIBUTE } from '../../src/constants/attributes';
import FormElementWrapper, { FormGroupWrapper } from '../../src/components/FormElementWrapper';
import { isWithErrors } from '../../src/interfaces/typeGuards';

const title = 'Cap Pricing Per Distance - Create Fares Data Service';
const description = 'Cap Pricing Per Distance entry page of the Create Fares Data Service';

interface DefineCapPricingPerDistanceProps {
    errors: ErrorInfo[];
    csrfToken: string;
    capPricePerDistances: DistanceCap;
    numberOfCapInitial: number;
}

const DefineCapPricingPerDistance = ({
    errors,
    csrfToken,
    capPricePerDistances,
    numberOfCapInitial,
}: DefineCapPricingPerDistanceProps): ReactElement => {
    const [numberOfCap, setNumberOfCaps] = useState(numberOfCapInitial);
    const [capPricingPerDistanceData, setCapPricingPerDistanceData] = useState(capPricePerDistances);
    return (
        <FullColumnLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/capPricingPerDistance" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <h1 className="govuk-heading-l" id="cap-pricing-per-distance-heading">
                        Enter your distance cap details
                    </h1>

                    <div className="govuk-!-margin-bottom-3 govuk-!-margin-left-1">
                        <label className="govuk-label" htmlFor="capped-product-name">
                            Capped product name
                        </label>
                        <span className="govuk-hint">Enter the name of your capped product</span>
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
                                    name="cappedProductName"
                                    type="text"
                                    defaultValue={capPricingPerDistanceData.productName || ''}
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
                                                    setCapPricingPerDistanceData({
                                                        ...capPricingPerDistanceData,
                                                        minimumPrice: e.target.value,
                                                    });
                                                }}
                                                value={capPricingPerDistanceData.minimumPrice || ''}
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
                                                    setCapPricingPerDistanceData({
                                                        ...capPricingPerDistanceData,
                                                        maximumPrice: e.target.value,
                                                    });
                                                }}
                                                value={capPricingPerDistanceData.maximumPrice || ''}
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
                            capPricingPerDistanceData={capPricingPerDistanceData}
                            setCapPricingPerDistanceData={setCapPricingPerDistanceData}
                        />
                        <div className="flex-container">
                            {numberOfCap < 10 ? (
                                <button
                                    id="add-another-button"
                                    type="button"
                                    className="govuk-button govuk-button--secondary govuk-!-margin-left-3 govuk-!-margin-bottom-3 time-restrictions-button-placement"
                                    onClick={(): void => {
                                        setNumberOfCaps(numberOfCap + 1);
                                        const items = [...capPricingPerDistanceData.capPricing];
                                        let item = { ...capPricingPerDistanceData.capPricing[numberOfCap - 1] };
                                        item.distanceTo = '';
                                        items[numberOfCap - 1] = item;
                                        setCapPricingPerDistanceData({
                                            ...capPricingPerDistanceData,
                                            capPricing: items,
                                        });
                                        item = { ...capPricingPerDistanceData.capPricing[numberOfCap] };
                                        item.distanceTo = 'Max';
                                        items[numberOfCap] = item;
                                        setCapPricingPerDistanceData({
                                            ...capPricingPerDistanceData,
                                            capPricing: items,
                                        });
                                        for (let i = 0; i < numberOfCap; i += 1) {
                                            if (
                                                !capPricingPerDistanceData?.capPricing[i]?.distanceFrom &&
                                                i !== 0 &&
                                                capPricingPerDistanceData?.capPricing[i - 1]?.distanceTo
                                            ) {
                                                const items = [...capPricingPerDistanceData.capPricing];
                                                item = { ...capPricingPerDistanceData.capPricing[i] };
                                                item.distanceFrom =
                                                    capPricingPerDistanceData.capPricing[i - 1].distanceTo;
                                                item.distanceTo = '';
                                                items[i] = item;
                                                setCapPricingPerDistanceData({
                                                    ...capPricingPerDistanceData,
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
                                        setCapPricingPerDistanceData((current) => {
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

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: DefineCapPricingPerDistanceProps } => {
    const csrfToken = getCsrfToken(ctx);
    const capPricePerDistances: DistanceCap | WithErrors<DistanceCap> | undefined = getSessionAttribute(
        ctx.req,
        CAP_PRICING_PER_DISTANCE_ATTRIBUTE,
    );
    let errors: ErrorInfo[] = [];
    if (capPricePerDistances && isWithErrors(capPricePerDistances)) {
        errors = capPricePerDistances.errors;
    }

    return {
        props: {
            errors,
            capPricePerDistances: capPricePerDistances || {
                capPricing: [{ distanceFrom: '0', distanceTo: 'Max', pricePerKm: '' }],
                minimumPrice: '',
                maximumPrice: '',
                productName: '',
            },
            csrfToken,
            numberOfCapInitial: capPricePerDistances?.capPricing?.length || 1,
        },
    };
};

export default DefineCapPricingPerDistance;
