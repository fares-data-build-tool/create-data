import React, { ReactElement } from 'react';
import { DistanceCap, ErrorInfo } from '../interfaces';
import FormElementWrapper, { FormGroupWrapper } from './FormElementWrapper';

interface DistanceRowProps {
    numberOfCapToDisplay: number;
    errors: ErrorInfo[];
    capPricingPerDistanceData: DistanceCap;
    setCapPricingPerDistanceData: React.Dispatch<React.SetStateAction<DistanceCap>>;
}

export const renderTable = (
    index: number,
    errors: ErrorInfo[],
    numberOfRows: number,
    capPricingPerDistanceData: DistanceCap,
    setCapPricingPerDistanceData: React.Dispatch<React.SetStateAction<DistanceCap>>,
): ReactElement => {
    return (
        <fieldset key={index} className="govuk-fieldset">
            <legend className="govuk-fieldset__legend govuk-visually-hidden">
                Enter details for cap distance banding ${index + 1}
            </legend>
            <div className="flex-container">
                <div className="govuk-!-margin-left-4 govuk-!-margin-right-2">
                    <FormGroupWrapper errors={errors} errorIds={[`distance-from-${index}`]} hideErrorBar>
                        <>
                            <label className="govuk-label" htmlFor={`distance-from-${index}`}>
                                Distance from
                            </label>
                            {index === 0 ? (
                                <span className="govuk-hint" id={`distance-from-hint-${index}`}>
                                    Unit start
                                </span>
                            ) : (
                                ''
                            )}

                            <div className="govuk-input__wrapper">
                                <FormElementWrapper
                                    errors={errors}
                                    errorId={`distance-from-${index}`}
                                    errorClass="govuk-input--error"
                                    hideText
                                    addFormGroupError={false}
                                >
                                    <input
                                        className="govuk-input govuk-input--width-5"
                                        id={`distance-from-${index}`}
                                        name={`distanceFrom${index}`}
                                        type="text"
                                        disabled={index === 0}
                                        onChange={(e) => {
                                            const items = [...capPricingPerDistanceData.capPricing];
                                            const item = { ...capPricingPerDistanceData.capPricing[index] };
                                            item.distanceFrom = e.target.value;
                                            items[index] = item;
                                            setCapPricingPerDistanceData({
                                                ...capPricingPerDistanceData,
                                                capPricing: items,
                                            });
                                        }}
                                        value={
                                            index === 0
                                                ? '0'
                                                : capPricingPerDistanceData?.capPricing[index]?.distanceFrom || ''
                                        }
                                    />
                                </FormElementWrapper>
                                <div className="govuk-input__suffix" aria-hidden="true">
                                    km
                                </div>
                            </div>
                        </>
                    </FormGroupWrapper>
                </div>
                <div className="govuk-!-margin-left-2 govuk-!-margin-right-2">
                    <FormGroupWrapper errors={errors} errorIds={[`distance-to-${index}`]} hideErrorBar>
                        <>
                            <label className="govuk-label" htmlFor={`distance-to-${index}`}>
                                Distance to
                            </label>
                            {index === 0 ? (
                                <span className="govuk-hint" id={`distance-to-hint-${index}`}>
                                    Unit limit
                                </span>
                            ) : (
                                ''
                            )}

                            <div className="govuk-input__wrapper">
                                <FormElementWrapper
                                    errors={errors}
                                    errorId={`distance-to-${index}`}
                                    errorClass="govuk-input--error"
                                    hideText
                                    addFormGroupError={false}
                                >
                                    <input
                                        className="govuk-input govuk-input--width-5"
                                        id={`distance-to-${index}`}
                                        name={`distanceTo${index}`}
                                        type="text"
                                        onChange={(e) => {
                                            const items = [...capPricingPerDistanceData.capPricing];
                                            const item = { ...capPricingPerDistanceData.capPricing[index] };
                                            item.distanceTo = e.target.value;
                                            items[index] = item;
                                            setCapPricingPerDistanceData({
                                                ...capPricingPerDistanceData,
                                                capPricing: items,
                                            });
                                        }}
                                        value={
                                            index + 1 === numberOfRows
                                                ? 'Max'
                                                : capPricingPerDistanceData?.capPricing[index]?.distanceTo || ''
                                        }
                                        disabled={index + 1 === numberOfRows}
                                    />
                                </FormElementWrapper>
                                <div className="govuk-input__suffix" aria-hidden="true">
                                    km
                                </div>
                            </div>
                        </>
                    </FormGroupWrapper>
                </div>
                <div className="govuk-!-margin-left-2 govuk-!-margin-right-2">
                    <FormGroupWrapper errors={errors} errorIds={[`price-per-km-${index}`]} hideErrorBar>
                        <>
                            <label className="govuk-label" htmlFor={`price-per-km-${index}`}>
                                Price per km
                            </label>
                            <div className="govuk-input__wrapper">
                                <div className="govuk-input__prefix" aria-hidden="true">
                                    £
                                </div>
                                <FormElementWrapper
                                    errors={errors}
                                    errorId={`price-per-km-${index}`}
                                    errorClass="govuk-input--error"
                                    hideText
                                    addFormGroupError={false}
                                >
                                    <input
                                        className="govuk-input govuk-input--width-5 govuk-currency-input__inner__input"
                                        id={`price-per-km-${index}`}
                                        name={`pricePerKm${index}`}
                                        type="text"
                                        onChange={(e) => {
                                            const items = [...capPricingPerDistanceData.capPricing];
                                            const item = { ...capPricingPerDistanceData.capPricing[index] };
                                            item.pricePerKm = e.target.value;
                                            items[index] = item;
                                            setCapPricingPerDistanceData({
                                                ...capPricingPerDistanceData,
                                                capPricing: items,
                                            });
                                        }}
                                        value={capPricingPerDistanceData?.capPricing[index]?.pricePerKm || ''}
                                    />
                                </FormElementWrapper>
                            </div>
                        </>
                    </FormGroupWrapper>
                </div>
            </div>
        </fieldset>
    );
};

export const renderRows = (
    numberOfRows: number,
    errors: ErrorInfo[],
    capPricingPerDistanceData: DistanceCap,
    setCapPricingPerDistanceData: React.Dispatch<React.SetStateAction<DistanceCap>>,
): ReactElement[] => {
    const elements: ReactElement[] = [];
    for (let i = 0; i < numberOfRows; i += 1) {
        elements.push(renderTable(i, errors, numberOfRows, capPricingPerDistanceData, setCapPricingPerDistanceData));
    }
    return elements;
};

const DistanceRow = ({
    numberOfCapToDisplay,
    errors,
    capPricingPerDistanceData,
    setCapPricingPerDistanceData,
}: DistanceRowProps): ReactElement => {
    return (
        <div>{renderRows(numberOfCapToDisplay, errors, capPricingPerDistanceData, setCapPricingPerDistanceData)}</div>
    );
};

export default DistanceRow;
