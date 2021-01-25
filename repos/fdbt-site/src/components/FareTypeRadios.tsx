import React, { ReactElement } from 'react';

interface FareTypeRadio {
    fareType: string;
    label: string;
}

export interface FareTypeRadioProps {
    standardFares: FareTypeRadio[];
    otherFares?: FareTypeRadio[];
}

const FareTypeRadios = ({ standardFares, otherFares = [] }: FareTypeRadioProps): ReactElement => {
    const showHeadings = standardFares.length > 0 && otherFares.length > 0;
    return (
        <>
            {showHeadings ? (
                <h2 className="govuk-heading-m govuk-!-margin-top-5" id="standard-fares-heading">
                    Standard Fares
                </h2>
            ) : null}
            <div className="govuk-radios">
                {standardFares.map(standardFare => (
                    <div className="govuk-radios__item" key={standardFare.fareType}>
                        <input
                            className="govuk-radios__input"
                            id={`fare-type-${standardFare.fareType}`}
                            name="fareType"
                            type="radio"
                            value={standardFare.fareType}
                        />
                        <label
                            className="govuk-label govuk-radios__label"
                            htmlFor={`fare-type-${standardFare.fareType}`}
                        >
                            {standardFare.label}
                        </label>
                    </div>
                ))}
                {showHeadings ? (
                    <>
                        <h2 className="govuk-heading-m govuk-!-margin-top-5" id="other-fares-heading">
                            Other Fares
                        </h2>
                        {otherFares.map(otherFare => (
                            <div className="govuk-radios__item" key={otherFare.fareType}>
                                <input
                                    className="govuk-radios__input"
                                    id={`fare-type-${otherFare.fareType}`}
                                    name="fareType"
                                    type="radio"
                                    value={otherFare.fareType}
                                />
                                <label
                                    className="govuk-label govuk-radios__label"
                                    htmlFor={`fare-type-${otherFare.fareType}`}
                                >
                                    {otherFare.label}
                                </label>
                            </div>
                        ))}
                    </>
                ) : null}
            </div>
        </>
    );
};

export default FareTypeRadios;
