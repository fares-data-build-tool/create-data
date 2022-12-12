import React, { ReactElement, useState } from 'react';
import { FullColumnLayout } from '../layout/Layout';
import DistanceRow from '../components/DistanceRow';
import { CapPricePerDistances, CapPricingPerDistanceData, ErrorInfo, NextPageContextWithSession } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import CsrfForm from '../components/CsrfForm';
import { getCsrfToken } from '../utils';
import { getSessionAttribute } from '../../src/utils/sessions';
import { CAP_PRICING_PER_DISTANCE_ATTRIBUTE } from '../../src/constants/attributes';

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
    const [numberOfCap, setNumberOfProducts] = useState(numberOfCapInitial);
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
                                        setNumberOfProducts(numberOfCap + 1);
                                        setCapPricingPerDistanceData({
                                            ...capPricingPerDistanceData,
                                            [`distanceTo${numberOfCap - 1}`]: '',
                                            [`distanceTo${numberOfCap}`]: 'Max',
                                        });
                                    }}
                                >
                                    Add another product
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
                                        setNumberOfProducts(numberOfCap - 1);
                                    }}
                                >
                                    Remove last product
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
    const capPricePerDistances: CapPricePerDistances[] = getSessionAttribute(
        ctx.req,
        CAP_PRICING_PER_DISTANCE_ATTRIBUTE,
    )?.capPricePerDistances as CapPricePerDistances[];
    const finalCapPricePerDistances: CapPricingPerDistanceData = { distanceFrom0: '0' };
    let numberOfCap = 0;

    if (capPricePerDistances) {
        for (let i = 0; i < capPricePerDistances.length; i++) {
            let capDetails = {};
            if (i === 0) {
                capDetails = {
                    [`distanceFrom0`]: capPricePerDistances[i].distanceFrom,
                    [`distanceTo0`]: capPricePerDistances[i].distanceTo,
                    [`minimumPrice0`]: capPricePerDistances[i].minimumPrice,
                    [`maximumPrice0`]: capPricePerDistances[i].maximumPrice,
                };
            } else {
                capDetails = {
                    [`distanceFrom${i}`]: capPricePerDistances[i].distanceFrom,
                    [`distanceTo${i}`]: capPricePerDistances[i].distanceTo,
                    [`pricePerKm${i}`]: capPricePerDistances[i].pricePerKm,
                };
            }
            Object.assign(finalCapPricePerDistances, capDetails);
            numberOfCap += 1;
        }
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
