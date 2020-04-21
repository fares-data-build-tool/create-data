import React, { ReactElement } from 'react';
import { ErrorInfo } from '../types';

interface FormElementWrapperProps {
    errors: ErrorInfo[];
    errorId: string;
    errorClass: string;
    children: ReactElement;
}

const addErrorClasses = (child: ReactElement, errorClass: string, errorId: string): ReactElement =>
    React.cloneElement(child, {
        className: child.props.className ? `${child.props.className} ${errorClass}` : errorClass,
        'aria-describedby': errorId,
    });

const FormElementWrapper = ({ errors, errorId, errorClass, children }: FormElementWrapperProps): ReactElement => {
    const errorForElement = errors.find(err => err.id === errorId);

    return (
        <div>
            {errorForElement && (
                <span id={errorId} className="govuk-error-message">
                    {errorForElement.errorMessage}
                </span>
            )}

            {errors.length
                ? React.Children.map(children, (child: ReactElement) => addErrorClasses(child, errorClass, errorId))
                : children}
        </div>
    );
};

export default FormElementWrapper;
