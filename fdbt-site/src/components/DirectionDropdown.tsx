import React, { ReactElement } from 'react';
import { JourneyPattern } from '../data/auroradb';
import { ErrorInfo } from '../interfaces';
import FormElementWrapper from './FormElementWrapper';

interface DirectionProps {
    selectName: string;
    selectNameID: string;
    dropdownLabel: string;
    journeyPatterns: JourneyPattern[];
    errors: ErrorInfo[];
    outboundJourney?: string;
    inboundJourney?: string;
    className?: string;
    hideLabel?: boolean;
}

const DirectionDropdown = ({
    selectName,
    selectNameID,
    dropdownLabel = '',
    journeyPatterns,
    outboundJourney,
    inboundJourney,
    className,
    errors,
    hideLabel = false,
}: DirectionProps): ReactElement => {
    let selectedValue = '';

    if (outboundJourney) {
        selectedValue = outboundJourney;
    } else if (inboundJourney) {
        selectedValue = inboundJourney;
    }

    return (
        <>
            <label className={`govuk-label ${hideLabel ? 'govuk-visually-hidden' : ''}`} htmlFor={selectNameID}>
                {dropdownLabel}
            </label>
            <FormElementWrapper errors={errors} errorId={selectNameID} errorClass="govuk-select--error">
                <select
                    className={`govuk-select ${className || ''}`}
                    id={selectNameID}
                    name={selectName}
                    defaultValue={selectedValue}
                >
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
                                {journeyPattern.startPoint.Display} - {journeyPattern.endPoint.Display}
                            </option>
                        );
                    })}
                </select>
            </FormElementWrapper>
        </>
    );
};

export default DirectionDropdown;
