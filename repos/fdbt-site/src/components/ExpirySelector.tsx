import upperFirst from 'lodash/upperFirst';
import React, { ReactElement } from 'react';
import { ErrorInfo, ExpiryUnit } from '../interfaces';
import FormElementWrapper from './FormElementWrapper';

interface DurationSelectorProps {
    defaultDuration?: string;
    quantityId: string;
    hintId?: string;
    quantityName: string;
    defaultUnit?: ExpiryUnit;
    unitName: string;
    unitId: string;
    errors?: ErrorInfo[];
}

const ExpirySelector = ({
    defaultDuration,
    quantityId,
    hintId,
    quantityName,
    defaultUnit,
    unitName,
    unitId,
    errors,
}: DurationSelectorProps): ReactElement => (
    <div className="govuk-input__wrapper expiry-selector-wrapper">
        <>
            <FormElementWrapper errors={errors || []} errorId={quantityId} errorClass="govuk-input--error" hideText>
                <input
                    className="govuk-input govuk-input--width-3"
                    name={quantityName}
                    data-non-numeric
                    type="text"
                    id={quantityId}
                    aria-describedby={hintId || ''}
                    defaultValue={defaultDuration || ''}
                />
            </FormElementWrapper>
            <FormElementWrapper errors={errors || []} errorId={unitId} errorClass="govuk-select--error" hideText>
                <select
                    className="govuk-select govuk-select--width-3 expiry-selector-units"
                    name={unitName}
                    id={unitId}
                    defaultValue={defaultUnit || ''}
                >
                    <option value="" disabled>
                        Select One
                    </option>
                    {Object.values(ExpiryUnit).map(unit => (
                        <option value={unit}>{`${upperFirst(unit)}${unit !== ExpiryUnit.NO_EXPIRY ? 's' : ''}`}</option>
                    ))}
                </select>
            </FormElementWrapper>
        </>
    </div>
);

export default ExpirySelector;
