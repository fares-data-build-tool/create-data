import React, { ReactElement } from 'react';

interface PopUpProps {
    title: string;
    text: string;
    okActionHandler: React.MouseEventHandler<HTMLButtonElement>;
}

const InfoPopup = ({ title, text, okActionHandler }: PopUpProps): ReactElement | null => (
    <div className="popup">
        <div className="popup__content">
            <h1 className="govuk-heading-m">{title}</h1>

            <span className="govuk-hint" id="info-hint">
                {text}
            </span>

            <button className="govuk-button" onClick={okActionHandler}>
                Ok
            </button>
        </div>
    </div>
);

export default InfoPopup;
