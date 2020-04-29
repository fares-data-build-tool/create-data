import React, { ReactElement } from 'react';
import { ErrorInfo } from '../types';
import FormElementWrapper from './FormElementWrapper';
import { MultiProduct } from '../pages/api/multipleProducts';

export interface ProductRowProps {
    numberOfProductsToDisplay: string;
    errors: ErrorInfo[];
    userInput: MultiProduct[];
}

export const continueButton = (): ReactElement => {
    return <input type="submit" value="Continue" id="continue-button" className="govuk-button govuk-button--start" />;
};

export const renderTable = (index: number, errors: ErrorInfo[], userInput: MultiProduct[] = []): ReactElement => (
    <div className="flex-container">
        <div className="govuk-grid-column-one-half">
            <FormElementWrapper
                errors={errors}
                errorId={`multipleProductNameInput${index}`}
                errorClass="govuk-form-group--error"
                addFormGroupError
            >
                <div className="govuk-form-group">
                    <label className="govuk-label" htmlFor={`multipleProductName${index}`}>
                        Product Name
                    </label>
                    {index === 0 ? (
                        <span className="govuk-hint" id={`product-name-hint${index}`}>
                            Enter the name of your product
                        </span>
                    ) : (
                        ''
                    )}
                    <input
                        className="govuk-input govuk-input--width-30 govuk-product-name-input__inner__input"
                        id={`multipleProductName${index}`}
                        name={`multipleProductNameInput${index}`}
                        type="text"
                        maxLength={50}
                        defaultValue={userInput.length > 0 ? userInput[index].productName : ''}
                    />
                </div>
            </FormElementWrapper>
        </div>
        <div className="govuk-grid-column-one-quarter">
            <FormElementWrapper
                errors={errors}
                errorId={`multipleProductPriceInput${index}`}
                errorClass="govuk-form-group--error"
                addFormGroupError
            >
                <div className="govuk-form-group">
                    <label className="govuk-label" htmlFor={`multipleProductPrice${index}`}>
                        Product Price
                    </label>
                    {index === 0 ? (
                        <span className="govuk-hint" id={`product-price-hint${index}`}>
                            For example, £2.99
                        </span>
                    ) : (
                        ''
                    )}
                    <div className="govuk-currency-input">
                        <div className="govuk-currency-input__inner">
                            <span className="govuk-currency-input__inner__unit">£</span>
                            <input
                                className="govuk-input govuk-input--width-10 govuk-currency-input__inner__input"
                                aria-label="Enter amount in pounds"
                                name={`multipleProductPriceInput${index}`}
                                data-non-numeric
                                type="text"
                                id={`multipleProductPrice${index}`}
                                defaultValue={userInput.length > 0 ? userInput[index].productPrice : ''}
                            />
                        </div>
                    </div>
                </div>
            </FormElementWrapper>
        </div>
        <div className="govuk-grid-column-one-quarter">
            <FormElementWrapper
                errors={errors}
                errorId={`multipleProductDurationInput${index}`}
                errorClass="govuk-form-group--error"
                addFormGroupError
            >
                <div className="govuk-form-group">
                    <label className="govuk-label" htmlFor={`multipleProductDuration${index}`}>
                        Product Duration
                    </label>
                    {index === 0 ? (
                        <span className="govuk-hint" id={`product-duration-hint${index}`}>
                            Enter a number of days
                        </span>
                    ) : (
                        ''
                    )}
                    <input
                        className="govuk-input govuk-input--width-20 govuk-product-name-input__inner__input"
                        id={`multipleProductDuration${index}`}
                        name={`multipleProductDurationInput${index}`}
                        type="text"
                        maxLength={366}
                        defaultValue={userInput.length > 0 ? userInput[index].productDuration : ''}
                    />
                </div>
            </FormElementWrapper>
        </div>
    </div>
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
