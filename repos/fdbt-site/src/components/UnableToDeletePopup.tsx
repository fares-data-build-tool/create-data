import React, { ReactElement } from 'react';

interface PopUpProps {
    csrfToken: string;
    isVisible: boolean;
    isGroup: boolean;
    passengerTypeName: string;
    cancelActionHandler: React.MouseEventHandler<HTMLButtonElement>;
    groupsInUse?: string[];
}

const UnableToDeletePopup = ({
    isVisible,
    groupsInUse,
    passengerTypeName,
    cancelActionHandler,
}: PopUpProps): ReactElement | null => {
    return isVisible ? (
        <div className="popup">
            <div className="popup__content">
                <form>
                    <h1 className="govuk-heading-m">There is a problem</h1>

                    <span className="govuk-hint" id="delete-hint">
                        You cannot delete {passengerTypeName} because it is part of the following group(s):{' '}
                        {groupsInUse?.join(', ')}
                    </span>

                    <button className="govuk-button govuk-button--secondary" onClick={cancelActionHandler}>
                        I Understand
                    </button>
                </form>
            </div>
        </div>
    ) : null;
};

export default UnableToDeletePopup;
