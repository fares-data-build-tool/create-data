import upperFirst from 'lodash/upperFirst';
import React, { ReactElement } from 'react';
import { ErrorInfo } from '../interfaces';
import { ExpiryUnit, CarnetExpiryUnit } from '../interfaces/matchingJsonTypes';
import FormElementWrapper from './FormElementWrapper';

interface DurationSelectorProps {
    defaultDuration?: string;
    quantityId: string;
    hintId?: string;
    quantityName: string;
    defaultUnit?: ExpiryUnit | CarnetExpiryUnit;
    unitName: string;
    unitId: string;
    carnet?: boolean;
    school?: boolean;
    errors?: ErrorInfo[];
    hideFormGroupError?: boolean;
    onChangeEvent?: React.MouseEvent<HTMLButtonElement, MouseEvent>;
}

const ExpirySelector = ({
    defaultDuration,
    quantityId,
    hintId,
    quantityName,
    defaultUnit,
    unitName,
    unitId,
    carnet = false,
    errors,
    school = false,
    hideFormGroupError = false,
}: DurationSelectorProps): ReactElement => {
    let optionList: string[] = [];
    Object.values(carnet ? CarnetExpiryUnit : ExpiryUnit).map((unit) => {
        optionList.push(unit);
    });
    if (!school) {
        optionList = optionList.filter((option) => option !== 'term');
    }

    return (
        <div className="govuk-input__wrapper expiry-selector-wrapper">
            <>
                <FormElementWrapper
                    errors={errors || []}
                    errorId={quantityId}
                    errorClass="govuk-input--error"
                    hideText
                    addFormGroupError={!hideFormGroupError}
                >
                    <input
                        className="govuk-input govuk-input--width-3"
                        name={quantityName}
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
                        <option value="" disabled key="select-one">
                            Select One
                        </option>
                        {optionList.map((unit) => (
                            <option value={unit} key={unit}>{`${upperFirst(unit)}${
                                unit !== 'no expiry' ? 's' : ''
                            }`}</option>
                        ))}
                    </select>
                </FormElementWrapper>
            </>
        </div>
    );
};

export default ExpirySelector;
