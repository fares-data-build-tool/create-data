import React, { ReactElement } from 'react';
import { JourneyPattern } from '../data/auroradb';

interface DirectionProps {
    journeyPatterns: JourneyPattern[];
    selectNameID: string;
    outboundJourney?: string;
    inboundJourney?: string;
}

const DirectionDropdown = ({
    journeyPatterns,
    selectNameID,
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
        <select className="govuk-select" id={selectNameID} name={selectNameID} defaultValue={selectedValue}>
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
    );
};

export default DirectionDropdown;
