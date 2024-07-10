import React, { ReactElement } from 'react';
import Trap from './Trap';

interface GenerateSinglePopupPopUpProps {
    cancelActionHandler: React.MouseEventHandler<HTMLButtonElement>;
    isOpen: boolean;
}

const GenerateReturnPopup = ({ cancelActionHandler, isOpen }: GenerateSinglePopupPopUpProps): ReactElement => {
    return (
        <Trap active={isOpen}>
            <div className="popup">
                <div className="popup__content">
                    <h1 className="govuk-heading-m">A return cannot be auto-generated for this product.</h1>
                    <span className="govuk-hint" id="delete-hint">
                        Two singles must be created, one for inbound and one for outbound. They must have the same
                        passenger type and not be expired. Services with one direction (circular services for example)
                        cannot be used to generate returns.
                    </span>
                    <button className="govuk-button govuk-button--secondary" onClick={cancelActionHandler}>
                        Close
                    </button>
                </div>
            </div>
        </Trap>
    );
};

export default GenerateReturnPopup;
