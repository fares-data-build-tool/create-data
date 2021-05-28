import React, { ReactElement } from 'react';
import { ErrorInfo } from '../interfaces';

interface FormElementWrapperProps {
    errors: ErrorInfo[];
    errorId: string;
    errorClass: string;
    children: ReactElement;
    addFormGroupError?: boolean;
    hideText?: boolean;
}

interface FormGroupWrapperProps {
    errors: ErrorInfo[];
    errorId: string;
    children: ReactElement;
}

const addErrorClasses = (child: ReactElement, errorClass: string, errorId: string): ReactElement =>
    React.cloneElement(child, {
        className: child.props.className ? `${child.props.className} ${errorClass}` : errorClass,
        'aria-describedby': `${errorId}-error`,
    });

export const FormGroupWrapper = ({ errors, errorId, children }: FormGroupWrapperProps): ReactElement => {
    const errorForElement = errors.find(err => err.id === errorId);

    return <div className={`govuk-form-group ${errorForElement ? 'govuk-form-group--error' : ''}`}>{children}</div>;
};

const FormElementWrapper = ({
    errors,
    errorId,
    errorClass,
    children,
    addFormGroupError,
    hideText,
}: FormElementWrapperProps): ReactElement => {
    const errorForElement = errors.find(err => err.id === errorId);

    return (
        <div className={addFormGroupError && errorForElement ? 'govuk-form-group--error' : ''}>
            {errorForElement && !hideText && (
                <span id={`${errorId}-error`} className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error: </span>
                    {errorForElement.errorMessage}
                </span>
            )}

            {errorForElement
                ? React.Children.map(children, (child: ReactElement) => addErrorClasses(child, errorClass, errorId))
                : children}
        </div>
    );
};

export default FormElementWrapper;
