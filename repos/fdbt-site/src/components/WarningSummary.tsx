import React, { ReactElement } from 'react';
import { ErrorInfo } from '../interfaces';

interface ErrorSummary {
    errors: ErrorInfo[];
}

const ErrorSummary = ({ errors }: ErrorSummary): null | ReactElement => {
    if (!errors || errors.length === 0) {
        return null;
    }

    return (
        <div
            className="govuk-error-summary"
            aria-labelledby="error-summary-title"
            role="alert"
            tabIndex={-1}
            data-module="govuk-error-summary"
        >
            <h2 className="govuk-error-summary__title" id="error-summary-title">
                You have not matched all fare stages to stops
            </h2>
            <div className="govuk-error-summary__body">
                <ul className="govuk-list govuk-error-summary__list">
                    {errors.map((error) => (
                        <li key={error.id}>
                            <a href={`#${error.id}`}>{error.errorMessage}</a>
                            <p />
                            <input type="checkbox" id="bypass" name="scales"></input>
                            <label htmlFor="override">
                                Check this box if you wish to proceed without assigning all fare stages, then click
                                Continue
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ErrorSummary;
