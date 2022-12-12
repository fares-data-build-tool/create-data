import React, { ReactElement } from 'react';
import { ErrorInfo, MultiTap } from '../interfaces';
import FormElementWrapper, { FormGroupWrapper } from './FormElementWrapper';

interface TapPricingRowProps {
    numberOfTapsToDisplay: number;
    errors: ErrorInfo[];
    userInput: MultiTap;
}

export const renderTable = (index: number, errors: ErrorInfo[], userInput: MultiTap = {}): ReactElement => (
    <fieldset key={index} className="govuk-fieldset">
        <legend className="govuk-fieldset__legend govuk-visually-hidden">{`Enter details for tap ${index + 1}`}</legend>
        <div className="flex-container">
            <div className="govuk-!-margin-left-4 govuk-!-margin-right-2">
                <div className="govuk-form-group ">
                    <label className="govuk-label" htmlFor={`multi-tap-number-${index}`}>
                        <span className="govuk-label" id={`multi-tap-number-hint-${index}`}>
                            Tap number {index + 1}
                        </span>{' '}
                    </label>
                </div>
            </div>
            <div className="govuk-!-margin-left-2 govuk-!-margin-right-2">
                <FormGroupWrapper errors={errors} errorIds={[`multi-tap-price-${index}`]}>
                    <>
                        <label className="govuk-label" htmlFor={`multi-tap-price-${index}`}>
                            <span className="govuk-visually-hidden">{`Tap Price - Price ${index + 1}`}</span>
                            <span aria-hidden>Price</span>
                        </label>
                        <span className="govuk-hint" id={`tap-price-hint-${index}`}>
                            {index === 0 ? 'e.g. 2.99' : ''}
                        </span>

                        <div className="govuk-currency-input">
                            <div className="govuk-currency-input__inner">
                                <span className="govuk-currency-input__inner__unit">£</span>
                                <FormElementWrapper
                                    errors={errors}
                                    errorId={`multi-tap-price-${index}`}
                                    errorClass="govuk-input--error"
                                    hideText
                                    addFormGroupError={false}
                                >
                                    <input
                                        className="govuk-input govuk-input--width-4 govuk-currency-input__inner__input"
                                        name={`multiTapPriceInput${index}`}
                                        data-non-numeric
                                        type="text"
                                        aria-describedby={`tap-price-hint-${index}`}
                                        id={`multi-tap-price-${index}`}
                                        defaultValue={userInput[index] ?? ''}
                                    />
                                </FormElementWrapper>
                            </div>
                        </div>
                    </>
                </FormGroupWrapper>
            </div>
        </div>
    </fieldset>
);

export const renderRows = (numberOfRows: number, errors: ErrorInfo[], userInput: MultiTap = {}): ReactElement[] => {
    const elements: ReactElement[] = [];
    for (let i = 0; i < numberOfRows; i += 1) {
        elements.push(renderTable(i, errors, userInput));
    }
    return elements;
};

const TapPricingRow = ({ numberOfTapsToDisplay, errors, userInput = {} }: TapPricingRowProps): ReactElement => {
    return <>{renderRows(numberOfTapsToDisplay, errors, userInput)}</>;
};

export default TapPricingRow;
