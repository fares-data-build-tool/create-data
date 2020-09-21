import React, { ReactElement } from 'react';
import camelCase from 'lodash/camelCase';
import startCase from 'lodash/startCase';
import { ErrorInfo, BaseReactElement } from '../interfaces';
import FormElementWrapper from './FormElementWrapper';

export interface RadioWithoutConditionals extends BaseReactElement {
    value: string;
}

export interface RadioWithConditionalInputs extends RadioWithoutConditionals {
    dataAriaControls: string;
    hint: {
        id: string;
        content: string;
    };
    inputType: 'text' | 'checkbox' | 'textWithUnits';
    inputs: BaseReactElement[];
    inputErrors: ErrorInfo[];
}

export type RadioButton = RadioWithoutConditionals | RadioWithConditionalInputs;

export interface RadioConditionalInputFieldset {
    heading: {
        id: string;
        content: string;
        hidden?: boolean;
    };
    radios: RadioButton[];
    radioError: ErrorInfo[];
}

export interface RadioConditionalInputProps {
    fieldset: RadioConditionalInputFieldset;
}

export const createErrorId = (input: BaseReactElement, inputErrors: ErrorInfo[]): string => {
    const el = inputErrors.find(({ id }) => id === input.id);
    if (el) {
        return el.id;
    }
    return '';
};

export const renderConditionalTextInput = (radio: RadioWithConditionalInputs): ReactElement => {
    const error = radio.inputErrors.length > 0;

    return (
        <div
            className={`govuk-radios__conditional${error ? '' : ' govuk-radios__conditional--hidden'}`}
            id={radio.dataAriaControls}
        >
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--s" id={radio.hint.id}>
                {radio.hint.content}
            </legend>
            {radio.inputs.map(input => {
                const errorId = createErrorId(input, radio.inputErrors);
                return (
                    <div
                        key={input.id}
                        className={`govuk-form-group${errorId !== '' ? ' govuk-form-group--error' : ''}`}
                    >
                        <label className="govuk-label" htmlFor={input.id}>
                            {input.label}
                        </label>
                        <FormElementWrapper
                            errors={radio.inputErrors}
                            errorId={errorId}
                            errorClass="govuk-input--error"
                        >
                            <input
                                className="govuk-input govuk-!-width-one-third"
                                id={input.id}
                                name={input.name}
                                type="text"
                            />
                        </FormElementWrapper>
                    </div>
                );
            })}
        </div>
    );
};

const renderConditionalCheckbox = (radio: RadioWithConditionalInputs): ReactElement => {
    const error = radio.inputErrors.length > 0;

    return (
        <div
            className={`govuk-radios__conditional ${error ? '' : 'govuk-radios__conditional--hidden'}`}
            id={radio.dataAriaControls}
        >
            <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''}`}>
                <fieldset className="govuk-fieldset" aria-describedby={radio.hint.id}>
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s" id={radio.hint.id}>
                        {radio.hint.content}
                    </legend>
                    <FormElementWrapper
                        errors={radio.inputErrors}
                        errorId={error ? radio.inputErrors[0].id : ''}
                        errorClass=""
                    >
                        <div className="govuk-checkboxes">
                            {radio.inputs.map(input => {
                                return (
                                    <div key={input.id} className="govuk-checkboxes__item">
                                        <input
                                            className="govuk-checkboxes__input"
                                            id={input.id}
                                            name={input.name}
                                            value={camelCase(input.id)}
                                            type="checkbox"
                                        />
                                        <label className="govuk-label govuk-checkboxes__label" htmlFor={input.id}>
                                            {input.label}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </FormElementWrapper>
                </fieldset>
            </div>
        </div>
    );
};

export const renderConditionalTextWithUnitsInput = (radio: RadioWithConditionalInputs): ReactElement => {
    const error = radio.inputErrors.length > 0;

    return (
        <div
            className={`govuk-radios__conditional${error ? '' : ' govuk-radios__conditional--hidden'}`}
            id={radio.dataAriaControls}
        >
            <span className="govuk-hint" id={radio.hint.id}>
                {radio.hint.content}
            </span>
            {radio.inputs.map(input => {
                const errorId = createErrorId(input, radio.inputErrors);
                return (
                    <div
                        key={input.id}
                        className={`govuk-form-group${errorId !== '' ? ' govuk-form-group--error' : ''}`}
                    >
                        <label className="govuk-label" htmlFor={input.id}>
                            {input.label}
                        </label>
                        <FormElementWrapper
                            errors={radio.inputErrors}
                            errorId={errorId}
                            errorClass={`${input.id.includes('units') ? 'govuk-select--error' : 'govuk-input--error'}`}
                        >
                            {input.id.includes('units') ? (
                                <select
                                    className="govuk-select"
                                    id={input.id}
                                    name={input.name}
                                    defaultValue={input.defaultValue || ''}
                                >
                                    <option value="" disabled>
                                        Select a {input.name}
                                    </option>
                                    {input.options?.map(unit => (
                                        <option key={`${unit}-option`} value={unit}>
                                            {startCase(`${unit}s`)}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    className="govuk-input govuk-!-width-one-third"
                                    id={input.id}
                                    name={input.name}
                                    type="text"
                                    defaultValue={input.defaultValue || ''}
                                />
                            )}
                        </FormElementWrapper>
                    </div>
                );
            })}
        </div>
    );
};

const renderConditionalRadioButton = (radio: RadioWithConditionalInputs, radioLabel: ReactElement): ReactElement => {
    const baseRadioInput = (
        <input
            className="govuk-radios__input"
            id={radio.id}
            name={radio.name}
            type="radio"
            value={radio.value}
            data-aria-controls={radio.dataAriaControls}
        />
    );
    const radioInputWithError = (
        <input
            className="govuk-radios__input"
            id={radio.id}
            name={radio.name}
            type="radio"
            value={radio.value}
            data-aria-controls={radio.dataAriaControls}
            checked
        />
    );

    const inputTypeMap = {
        checkbox: renderConditionalCheckbox,
        text: renderConditionalTextInput,
        textWithUnits: renderConditionalTextWithUnitsInput,
    };

    return (
        <div key={radio.id}>
            <div className="govuk-radios__item">
                {radio.inputErrors.length > 0 ? radioInputWithError : baseRadioInput}
                {radioLabel}
            </div>
            {inputTypeMap[radio.inputType](radio)}
        </div>
    );
};

const isRadioWithConditionalInputs = (
    radioButton: RadioWithConditionalInputs | RadioWithoutConditionals,
): radioButton is RadioWithConditionalInputs => {
    return (radioButton as RadioWithConditionalInputs).hint !== undefined;
};

const renderRadioButtonSet = (radio: RadioButton): ReactElement => {
    const radioButtonLabel: ReactElement = (
        <label className="govuk-label govuk-radios__label" htmlFor={radio.id}>
            {radio.label}
        </label>
    );

    if (isRadioWithConditionalInputs(radio)) {
        return renderConditionalRadioButton(radio, radioButtonLabel);
    }

    return (
        <div key={radio.id} className="govuk-radios__item">
            <input className="govuk-radios__input" id={radio.id} name={radio.name} type="radio" value={radio.value} />
            {radioButtonLabel}
        </div>
    );
};

const RadioConditionalInput = ({ fieldset }: RadioConditionalInputProps): ReactElement => {
    const radioError = fieldset.radioError.length > 0;

    return (
        <div className={`govuk-form-group ${radioError ? 'govuk-form-group--error' : ''}`}>
            <fieldset className="govuk-fieldset" aria-describedby={fieldset.heading.id}>
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                    <h2
                        className={`govuk-fieldset__heading${fieldset.heading.hidden ? ' govuk-visually-hidden' : ''}`}
                        id={fieldset.heading.id}
                    >
                        {fieldset.heading.content}
                    </h2>
                </legend>
                <FormElementWrapper
                    errors={fieldset.radioError}
                    errorId={radioError ? fieldset.radioError[0].id : ''}
                    errorClass="govuk-radios--error"
                >
                    <div className="govuk-radios govuk-radios--conditional" data-module="govuk-radios">
                        {fieldset.radios.map(radio => renderRadioButtonSet(radio))}
                    </div>
                </FormElementWrapper>
            </fieldset>
            <br />
            <br />
        </div>
    );
};

export default RadioConditionalInput;
