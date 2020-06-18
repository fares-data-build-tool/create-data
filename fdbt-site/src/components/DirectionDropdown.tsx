import React, { ReactElement } from 'react';
import { JourneyPattern } from '../data/auroradb';

interface DirectionProps {
    selectName: string;
    selectNameID: string;
    dropdownLabel?: string;
    journeyPatterns: JourneyPattern[];
    outboundJourney?: string;
    inboundJourney?: string;
}

const DirectionDropdown = ({
    selectName,
    selectNameID,
    dropdownLabel = '',
    journeyPatterns,
    outboundJourney,
    inboundJourney,
}: DirectionProps): ReactElement => {
    let selectedValue = '';

    if (outboundJourney) {
        selectedValue = outboundJourney;
    } else if (inboundJourney) {
        selectedValue = inboundJourney;
    }

    return (
        <>
            <label className="govuk-label" htmlFor={selectNameID}>
                {dropdownLabel}
            </label>
            <select className="govuk-select" id={selectNameID} name={selectName} defaultValue={selectedValue}>
                <option value="" disabled>
                    Select One
                </option>
                {journeyPatterns.map((journeyPattern, i) => {
                    return (
                        <option
                            key={`${journeyPattern.startPoint.Id}#${journeyPattern.endPoint.Id}#${+i}`}
                            value={`${journeyPattern.startPoint.Id}#${journeyPattern.endPoint.Id}`}
                            className="journey-option"
                        >
                            {journeyPattern.startPoint.Display} TO {journeyPattern.endPoint.Display}
                        </option>
                    );
                })}
            </select>
        </>
    );
};

export default DirectionDropdown;
