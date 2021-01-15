import React, { ReactElement } from 'react';
import { ErrorInfo } from '../interfaces';
import FormElementWrapper, { FormGroupWrapper } from './FormElementWrapper';
import { MultiProduct } from '../pages/api/multipleProducts';

export interface ProductRowProps {
    numberOfProductsToDisplay: string;
    errors: ErrorInfo[];
    userInput: MultiProduct[];
}

export const continueButton = (): ReactElement => {
    return <input type="submit" value="Continue" id="continue-button" className="govuk-button govuk-!-margin-left-3" />;
};

export const renderTable = (index: number, errors: ErrorInfo[], userInput: MultiProduct[] = []): ReactElement => (
    <fieldset key={index} className="govuk-fieldset">
        <legend className="govuk-fieldset__legend govuk-visually-hidden">
            {`Enter details for product ${index + 1}`}
        </legend>
        <div className="flex-container">
            <div className="govuk-grid-column-one-half">
                <FormGroupWrapper errors={errors} errorId={`multiple-product-name-${index}`}>
                    <>
                        <label className="govuk-label" htmlFor={`multiple-product-name-${index}`}>
                            <span className="govuk-visually-hidden">{`Product Name - Product ${index + 1}`}</span>
                            <span aria-hidden>Product Name</span>
                        </label>
                        <span className="govuk-hint" id={`product-name-hint-${index}`}>
                            50 characters maximum
                        </span>

                        <FormElementWrapper
                            errors={errors}
                            errorId={`multiple-product-name-${index}`}
                            errorClass="govuk-input--error"
                        >
                            <input
                                className="govuk-input govuk-input--width-30 govuk-product-name-input__inner__input"
                                id={`multiple-product-name-${index}`}
                                name={`multipleProductNameInput${index}`}
                                type="text"
                                aria-describedby={`product-name-hint-${index}`}
                                maxLength={50}
                                defaultValue={userInput[index]?.productName ?? ''}
                            />
                        </FormElementWrapper>
                    </>
                </FormGroupWrapper>
            </div>
            <div className="govuk-grid-column-one-quarter">
                <FormGroupWrapper errors={errors} errorId={`multiple-product-price-${index}`}>
                    <>
                        <label className="govuk-label" htmlFor={`multiple-product-price-${index}`}>
                            <span className="govuk-visually-hidden">{`Product Price, in pounds - Product ${index +
                                1}`}</span>
                            <span aria-hidden>Price, in pounds</span>
                        </label>
                        <span className="govuk-hint" id={`product-price-hint-${index}`}>
                            For example, 2.99
                        </span>

                        <div className="govuk-currency-input">
                            <div className="govuk-currency-input__inner">
                                <span className="govuk-currency-input__inner__unit">£</span>
                                <FormElementWrapper
                                    errors={errors}
                                    errorId={`multiple-product-price-${index}`}
                                    errorClass="govuk-input--error"
                                >
                                    <input
                                        className="govuk-input govuk-input--width-10 govuk-currency-input__inner__input"
                                        name={`multipleProductPriceInput${index}`}
                                        data-non-numeric
                                        type="text"
                                        aria-describedby={`product-price-hint-${index}`}
                                        id={`multiple-product-price-${index}`}
                                        defaultValue={userInput[index]?.productPrice ?? ''}
                                    />
                                </FormElementWrapper>
                            </div>
                        </div>
                    </>
                </FormGroupWrapper>
            </div>
            <div className="govuk-grid-column-one-quarter">
                <FormGroupWrapper errors={errors} errorId={`multiple-product-duration-${index}`}>
                    <>
                        <label className="govuk-label" htmlFor={`multiple-product-duration-${index}`}>
                            <span className="govuk-visually-hidden">{`Product Duration amount - Product ${index +
                                1}`}</span>
                            <span aria-hidden>Duration</span>
                        </label>
                        <span className="govuk-hint" id={`product-duration-hint-${index}`}>
                            Enter a number
                        </span>

                        <FormElementWrapper
                            errors={errors}
                            errorId={`multiple-product-duration-${index}`}
                            errorClass="govuk-input--error"
                        >
                            <input
                                className="govuk-input govuk-input--width-20 govuk-product-name-input__inner__input"
                                id={`multiple-product-duration-${index}`}
                                name={`multipleProductDurationInput${index}`}
                                type="text"
                                aria-describedby={`product-duration-hint-${index}`}
                                maxLength={366}
                                defaultValue={userInput[index]?.productDuration ?? ''}
                            />
                        </FormElementWrapper>
                    </>
                </FormGroupWrapper>
            </div>
            <div className="govuk-grid-column-one-quarter">
                <FormGroupWrapper errorId={`multiple-product-duration-units-${index}`} errors={errors}>
                    <>
                        <label className="govuk-label" htmlFor={`multiple-product-duration-units-${index}`}>
                            <span className="govuk-visually-hidden">{`Product Duration units - Product ${index +
                                1}`}</span>
                            <span aria-hidden>Duration Type</span>
                        </label>
                        <span className="govuk-hint" id={`product-duration-units-hint-${index}`}>
                            For example, days
                        </span>
                        <FormElementWrapper
                            errors={errors}
                            errorId={`multiple-product-duration-units-${index}`}
                            errorClass="govuk-select--error"
                        >
                            <select
                                className="govuk-select"
                                id={`multiple-product-duration-units-${index}`}
                                name={`multipleProductDurationUnitsInput${index}`}
                                defaultValue={userInput[index]?.productDurationUnits ?? ''}
                            >
                                <option selected value="" disabled>
                                    Select a duration
                                </option>
                                <option value="hour">Hours</option>
                                <option value="day">Days</option>
                                <option value="week">Weeks</option>
                                <option value="month">Months</option>
                                <option value="year">Years</option>
                            </select>
                        </FormElementWrapper>
                    </>
                </FormGroupWrapper>
            </div>
        </div>
    </fieldset>
);

export const renderRows = (
    numberOfRows: string,
    errors: ErrorInfo[],
    userInput: MultiProduct[] = [],
): ReactElement[] => {
    const elements: ReactElement[] = [];
    for (let i = 0; i < Number(numberOfRows); i += 1) {
        elements.push(renderTable(i, errors, userInput));
    }
    return elements;
};

const ProductRow = ({ numberOfProductsToDisplay, errors, userInput = [] }: ProductRowProps): ReactElement => {
    return (
        <div>
            {renderRows(numberOfProductsToDisplay, errors, userInput)}
            {continueButton()}
        </div>
    );
};

export default ProductRow;
