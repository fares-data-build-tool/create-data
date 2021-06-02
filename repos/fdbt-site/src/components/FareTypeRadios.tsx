import React, { ReactElement } from 'react';
import { FareTypeRadioProps } from '../interfaces';

const FareTypeRadios = ({ fares = [] }: FareTypeRadioProps): ReactElement => {
    return (
        <>
            <div className="govuk-radios">
                {fares.map(fare => (
                    <div className="govuk-radios__item" key={fare.fareType}>
                        <input
                            className="govuk-radios__input"
                            id={`fare-type-${fare.fareType}`}
                            name="fareType"
                            type="radio"
                            value={fare.fareType}
                        />
                        <label className="govuk-label govuk-radios__label" htmlFor={`fare-type-${fare.fareType}`}>
                            <b>{fare.label}</b>
                        </label>
                        <div id={`${fare.fareType}-hint`} className="govuk-hint govuk-radios__hint">
                            {fare.hint}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default FareTypeRadios;
