import React, { ReactElement } from 'react';
import { ErrorInfo } from '../types';

export type ErrorSummaryInfo = {
    errors: ErrorInfo[];
    errorHref?: string;
};

const ErrorSummary = ({ errors, errorHref }: ErrorSummaryInfo): null | ReactElement => {
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
                There is a problem
            </h2>
            <div className="govuk-error-summary__body">
                <ul className="govuk-list govuk-error-summary__list">
                    {errors.map(error => (
                        <li key={errorHref}>
                            <a href={errorHref}>{error.errorMessage}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ErrorSummary;
