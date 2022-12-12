import React, { ReactElement } from 'react';
import { ErrorInfo } from '../interfaces';
import FormElementWrapper, { FormGroupWrapper } from './FormElementWrapper';
import { CapPricingPerDistanceData } from '../interfaces';
interface DistanceRowProps {
    numberOfCapToDisplay: number;
    errors: ErrorInfo[];
    capPricingPerDistanceData: CapPricingPerDistanceData;
    setCapPricingPerDistanceData: React.Dispatch<React.SetStateAction<CapPricingPerDistanceData>>;
}

export const renderTable = (
    index: number,
    errors: ErrorInfo[],
    numberOfRows: number,
    capPricingPerDistanceData: CapPricingPerDistanceData,
    setCapPricingPerDistanceData: React.Dispatch<React.SetStateAction<CapPricingPerDistanceData>>,
): ReactElement => {
    return (
        <fieldset key={index} className="govuk-fieldset">
            <legend className="govuk-fieldset__legend govuk-visually-hidden">
                {`Enter details for product ${index + 1}`}
            </legend>
            <div className="flex-container">
                <div className="govuk-!-margin-left-4 govuk-!-margin-right-2">
                    <FormGroupWrapper errors={errors} errorIds={[`cap-pricing-per-distance${index}`]} hideErrorBar>
                        <>
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
                            </>
                            <FormElementWrapper
                                errors={errors}
                                errorId={`cap-pricing-per-distance-from-${index}`}
                                errorClass="govuk-input--error"
                                hideText
                                addFormGroupError={false}
                            >
                                <div className="govuk-input__wrapper">
                                    <input
                                        className="govuk-input govuk-input--width-5"
                                        id={`distance-from-${index}`}
                                        name={`distanceFrom${index}`}
                                        type="text"
                                        spellCheck="false"
                                        disabled={index === 0}
                                        onChange={(e) => {
                                            setCapPricingPerDistanceData({
                                                ...capPricingPerDistanceData,
                                                [`distanceFrom${index}`]: e.target.value,
                                            });
                                        }}
                                        value={
                                            index === 0 ? '0' : capPricingPerDistanceData[`distanceFrom${index}`] || ''
                                        }
                                    />
                                    <div className="govuk-input__suffix" aria-hidden="true">
                                        km
                                    </div>
                                </div>
                            </FormElementWrapper>
                        </>
                    </FormGroupWrapper>
                </div>
                <div className="govuk-!-margin-left-2 govuk-!-margin-right-2">
                    <FormGroupWrapper errors={errors} errorIds={[`cap-pricing-per-distance-to-${index}`]} hideErrorBar>
                        <>
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
                            </>
                            <div className="govuk-input__wrapper">
                                <input
                                    className="govuk-input govuk-input--width-5"
                                    id={`distance-to-${index}`}
                                    name={`distanceTo${index}`}
                                    type="text"
                                    spellCheck="false"
                                    onChange={(e) => {
                                        setCapPricingPerDistanceData({
                                            ...capPricingPerDistanceData,
                                            [`distanceTo${index}`]: e.target.value,
                                        });
                                    }}
                                    value={
                                        index + 1 === numberOfRows
                                            ? 'Max'
                                            : capPricingPerDistanceData[`distanceTo${index}`] || ''
                                    }
                                    disabled={index + 1 === numberOfRows}
                                />
                                <div className="govuk-input__suffix" aria-hidden="true">
                                    km
                                </div>
                            </div>
                        </>
                    </FormGroupWrapper>
                </div>
                <div className="govuk-!-margin-left-2 govuk-!-margin-right-2">
                    {index === 0 ? (
                        <FormGroupWrapper
                            errors={errors}
                            errorIds={[`cap-pricing-per-distance-minimum-price-${index}`]}
                            hideErrorBar
                        >
                            <>
                                <>
                                    <label className="govuk-label" htmlFor="minimum-price">
                                        Minimum price
                                    </label>

                                    <span className="govuk-hint" id={`minimum-price-hint-${index}`}>
                                        e.g. 2.99
                                    </span>
                                </>
                                <div className="govuk-input__wrapper">
                                    <div className="govuk-input__prefix" aria-hidden="true">
                                        £
                                    </div>
                                    <input
                                        className="govuk-input govuk-input--width-5"
                                        id={`minimum-price-${index}`}
                                        name={`minimumPrice${index}`}
                                        type="text"
                                        spellCheck="false"
                                        onChange={(e) => {
                                            setCapPricingPerDistanceData({
                                                ...capPricingPerDistanceData,
                                                [`minimumPrice${index}`]: e.target.value,
                                            });
                                        }}
                                        value={capPricingPerDistanceData[`minimumPrice${index}`] || ''}
                                    />
                                </div>
                            </>
                        </FormGroupWrapper>
                    ) : (
                        <div className="govuk-!-margin-right-2">
                            <FormGroupWrapper
                                errors={errors}
                                errorIds={[`cap-pricing-per-distance-price-${index}`]}
                                hideErrorBar
                            >
                                <>
                                    <label className="govuk-label" htmlFor={`price-per-km-${index}`}>
                                        {index === 1 ? 'Price per km' : 'Price'}
                                    </label>
                                    <div className="govuk-input__wrapper">
                                        <div className="govuk-input__prefix" aria-hidden="true">
                                            £
                                        </div>
                                        <input
                                            className="govuk-input govuk-input--width-5"
                                            id={`price-per-km-${index}`}
                                            name={`pricePerKm${index}`}
                                            type="text"
                                            spellCheck="false"
                                            onChange={(e) => {
                                                setCapPricingPerDistanceData({
                                                    ...capPricingPerDistanceData,
                                                    [`pricePerKm${index}`]: e.target.value,
                                                });
                                            }}
                                            value={capPricingPerDistanceData[`pricePerKm${index}`] || ''}
                                        />
                                    </div>
                                </>
                            </FormGroupWrapper>
                        </div>
                    )}
                </div>
                <div className="govuk-!-margin-left-2 govuk-!-margin-right-2">
                    {index === 0 ? (
                        <FormGroupWrapper
                            errors={errors}
                            errorIds={[`cap-pricing-per-distance-maximum-price-${index}`]}
                            hideErrorBar
                        >
                            <>
                                <>
                                    <label className="govuk-label" htmlFor={`maximum-price-${index}`}>
                                        Maximum price
                                    </label>

                                    <span className="govuk-hint" id={`maximum-price-hint-${index}`}>
                                        e.g. 2.99
                                    </span>
                                </>
                                <div className="govuk-input__wrapper">
                                    <div className="govuk-input__prefix" aria-hidden="true">
                                        £
                                    </div>
                                    <input
                                        className="govuk-input govuk-input--width-5"
                                        id={`maximum-price-${index}`}
                                        name={`maximumPrice${index}`}
                                        type="text"
                                        spellCheck="false"
                                        onChange={(e) => {
                                            setCapPricingPerDistanceData({
                                                ...capPricingPerDistanceData,
                                                [`maximumPrice${index}`]: e.target.value,
                                            });
                                        }}
                                        value={capPricingPerDistanceData[`maximumPrice${index}`] || ''}
                                    />
                                </div>
                            </>
                        </FormGroupWrapper>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </fieldset>
    );
};

export const renderRows = (
    numberOfRows: number,
    errors: ErrorInfo[],
    capPricingPerDistanceData: CapPricingPerDistanceData,
    setCapPricingPerDistanceData: React.Dispatch<React.SetStateAction<CapPricingPerDistanceData>>,
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
