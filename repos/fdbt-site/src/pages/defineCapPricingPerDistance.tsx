import React, { ReactElement, useState } from 'react';
import { FullColumnLayout } from '../layout/Layout';
import DistanceRow from '../components/DistanceRow';
import { CapPricingPerDistanceData, DistanceCap, ErrorInfo, NextPageContextWithSession } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import CsrfForm from '../components/CsrfForm';
import { getCsrfToken } from '../utils';
import { getSessionAttribute } from '../../src/utils/sessions';
import { CAP_PRICING_PER_DISTANCE_ATTRIBUTE } from '../../src/constants/attributes';
import { FormGroupWrapper } from '../../src/components/FormElementWrapper';

const title = 'Cap Pricing Per Distance - Create Fares Data Service';
const description = 'Cap Pricing Per Distance entry page of the Create Fares Data Service';

interface DefineCapPricingPerDistanceProps {
    errors?: ErrorInfo[];
    csrfToken: string;
    capPricePerDistances: CapPricingPerDistanceData;
    numberOfCapInitial: number;
}

const DefineCapPricingPerDistance = ({
    errors = [],
    csrfToken,
    capPricePerDistances,
    numberOfCapInitial,
}: DefineCapPricingPerDistanceProps): ReactElement => {
    const [numberOfCap, setNumberOfCaps] = useState(numberOfCapInitial);
    const [capPricingPerDistanceData, setCapPricingPerDistanceData] = useState({
        [`distanceTo${numberOfCap - 1}`]: 'Max',
        ...capPricePerDistances,
    });

    return (
        <FullColumnLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/capPricingPerDistance" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <h1 className="govuk-heading-l" id="cap-pricing-per-distance-heading">
                        Enter your distance cap details
                    </h1>
                    <div className="flex-container">
                        <div className="govuk-!-margin-left-1 govuk-!-margin-right-2">
                            <FormGroupWrapper
                                errors={errors}
                                errorIds={[`cap-pricing-per-distance-minimum-price`]}
                                hideErrorBar
                            >
                                <>
                                    <>
                                        <label className="govuk-label" htmlFor="minimum-price">
                                            Minimum price(£)
                                        </label>

                                        <span className="govuk-hint" id={`minimum-price-hint`}>
                                            e.g. £2.99
                                        </span>
                                    </>
                                    <div className="govuk-input__wrapper">
                                        <div className="govuk-input__prefix" aria-hidden="true">
                                            £
                                        </div>
                                        <input
                                            className="govuk-input govuk-input--width-5"
                                            id={`minimum-price`}
                                            name={`minimumPrice`}
                                            type="text"
                                            onChange={(e) => {
                                                setCapPricingPerDistanceData({
                                                    ...capPricingPerDistanceData,
                                                    [`minimumPrice`]: e.target.value,
                                                });
                                            }}
                                            value={capPricingPerDistanceData[`minimumPrice`] || ''}
                                        />
                                    </div>
                                </>
                            </FormGroupWrapper>
                        </div>

                        <div className="govuk-!-margin-left-2 govuk-!-margin-right-2">
                            <FormGroupWrapper
                                errors={errors}
                                errorIds={[`cap-pricing-per-distance-maximum-price`]}
                                hideErrorBar
                            >
                                <>
                                    <>
                                        <label className="govuk-label" htmlFor={`maximum-price`}>
                                            Maximum price(£)
                                        </label>

                                        <span className="govuk-hint" id={`maximum-price-hint`}>
                                            e.g. £2.99
                                        </span>
                                    </>
                                    <div className="govuk-input__wrapper">
                                        <div className="govuk-input__prefix" aria-hidden="true">
                                            £
                                        </div>
                                        <input
                                            className="govuk-input govuk-input--width-5"
                                            id={`maximum-price`}
                                            name={`maximumPrice`}
                                            type="text"
                                            onChange={(e) => {
                                                setCapPricingPerDistanceData({
                                                    ...capPricingPerDistanceData,
                                                    [`maximumPrice`]: e.target.value,
                                                });
                                            }}
                                            value={capPricingPerDistanceData[`maximumPrice`] || ''}
                                        />
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
                                        setCapPricingPerDistanceData({
                                            ...capPricingPerDistanceData,
                                            [`distanceTo${numberOfCap - 1}`]: '',
                                            [`distanceTo${numberOfCap}`]: 'Max',
                                        });
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
                                            delete copy[`distanceTo${numberOfCap - 1}`];
                                            delete copy[`distanceFrom${numberOfCap - 1}`];
                                            delete copy[`pricePerKm${numberOfCap - 1}`];
                                            return { ...copy, [`distanceTo${numberOfCap - 2}`]: 'Max' };
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
    const capPricePerDistances: DistanceCap = getSessionAttribute(ctx.req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE)
        ?.capPricePerDistances as DistanceCap;

    const finalCapPricePerDistances: CapPricingPerDistanceData = { distanceFrom0: '0' };
    let numberOfCap = 0;

    if (capPricePerDistances && capPricePerDistances.capPricing) {
        for (let i = 0; i < capPricePerDistances.capPricing.length; i++) {
            let capDetails = {};
            capDetails = {
                [`distanceFrom${i}`]: capPricePerDistances.capPricing[i].distanceFrom,
                [`distanceTo${i}`]: capPricePerDistances.capPricing[i].distanceTo,
                [`pricePerKm${i}`]: capPricePerDistances.capPricing[i].pricePerKm,
            };
            Object.assign(finalCapPricePerDistances, capDetails);
            numberOfCap += 1;
        }
        Object.assign(finalCapPricePerDistances, {
            minimumPrice: capPricePerDistances.minimumPrice,
            maximumPrice: capPricePerDistances.maximumPrice,
        });
    }
    return {
        props: {
            errors: getSessionAttribute(ctx.req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE)?.errors || [],
            capPricePerDistances: finalCapPricePerDistances,
            csrfToken,
            numberOfCapInitial: numberOfCap === 0 ? 1 : numberOfCap,
        },
    };
};

export default DefineCapPricingPerDistance;
