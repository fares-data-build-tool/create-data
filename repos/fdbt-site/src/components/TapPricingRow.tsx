import React, { ReactElement } from 'react';
import { ErrorInfo, MultiTapPricing } from '../interfaces';
import FormElementWrapper, { FormGroupWrapper } from './FormElementWrapper';

interface TapPricingRowProps {
    numberOfTapsToDisplay: number;
    errors: ErrorInfo[];
    userInput: MultiTapPricing[];
}

export const renderTable = (index: number, errors: ErrorInfo[], userInput: MultiTapPricing[] = []): ReactElement => (
    <fieldset key={index} className="govuk-fieldset">
        <legend className="govuk-fieldset__legend govuk-visually-hidden">{`Enter details for tap ${index + 1}`}</legend>
        <div className="flex-container">
            <div className="govuk-!-margin-left-4 govuk-!-margin-right-2">
                <FormGroupWrapper errors={errors} errorIds={[`multi-tap-number-${index}`]} hideErrorBar>
                    <>
                        <label className="govuk-label" htmlFor={`multi-tap-number-${index}`}>
                            <span className="govuk-label" id={`multi-tap-number-hint-${index}`}>
                                Tap Number &nbsp;
                            </span>{' '}
                        </label>
                        <FormElementWrapper
                            errors={errors}
                            errorId={`multi-tap-number-${index}`}
                            errorClass="govuk-input--error"
                            hideText
                            addFormGroupError={false}
                        >
                            <label className="govuk-label" htmlFor={`multi-tap-number-${index}`}>
                                <span className="govuk-visually">{index + 1}</span>
                            </label>
                        </FormElementWrapper>
                    </>
                </FormGroupWrapper>
            </div>
            <div className="govuk-!-margin-left-2 govuk-!-margin-right-2">
                <FormGroupWrapper errors={errors} errorIds={[`multi-tap-price-${index}`]} hideErrorBar>
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
                                        defaultValue={userInput[index]?.tapPrice ?? ''}
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

export const renderRows = (
    numberOfRows: number,
    errors: ErrorInfo[],
    userInput: MultiTapPricing[] = [],
): ReactElement[] => {
    const elements: ReactElement[] = [];
    for (let i = 0; i < numberOfRows; i += 1) {
        elements.push(renderTable(i, errors, userInput));
    }
    return elements;
};

const TapPricingRow = ({ numberOfTapsToDisplay, errors, userInput = [] }: TapPricingRowProps): ReactElement => {
    return <div>{renderRows(numberOfTapsToDisplay, errors, userInput)}</div>;
};

export default TapPricingRow;
