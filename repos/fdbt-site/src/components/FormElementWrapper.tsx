import React, { ReactElement } from 'react';
import { ErrorInfo } from '../interfaces';

interface FormElementWrapperProps {
    errors: ErrorInfo[];
    errorId: string;
    errorClass: string;
    children: ReactElement;
    addFormGroupError?: boolean;
}

const addErrorClasses = (child: ReactElement, errorClass: string, errorId: string): ReactElement =>
    React.cloneElement(child, {
        className: child.props.className ? `${child.props.className} ${errorClass}` : errorClass,
        'aria-describedby': errorId,
    });

const FormElementWrapper = ({
    errors,
    errorId,
    errorClass,
    children,
    addFormGroupError,
}: FormElementWrapperProps): ReactElement => {
    const errorForElement = errors.find(err => err.id === errorId);

    return (
        <div className={addFormGroupError && errorForElement ? 'govuk-form-group--error' : ''}>
            {errorForElement && (
                <span id={errorId} className="govuk-error-message">
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
