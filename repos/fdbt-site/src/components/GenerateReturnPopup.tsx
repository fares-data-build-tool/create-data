import React, { ReactElement } from 'react';

interface GenerateSinglePopupPopUpProps {
    cancelActionHandler: React.MouseEventHandler<HTMLButtonElement>;
}

const GenerateReturnPopup = ({ cancelActionHandler }: GenerateSinglePopupPopUpProps): ReactElement => {
    return (
        <div className="popup">
            <div className="popup__content">
                <h1 className="govuk-heading-m">A return cannot be auto-generated for this product.</h1>
                <span className="govuk-hint" id="delete-hint">
                    Two singles must be created, one for inbound and one for outbound. They must have the same passenger
                    type and not be expired.
                </span>
                <button className="govuk-button govuk-button--secondary" onClick={cancelActionHandler}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default GenerateReturnPopup;
