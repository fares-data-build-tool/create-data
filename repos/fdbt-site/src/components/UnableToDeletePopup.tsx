import React, { ReactElement } from 'react';

interface PopUpProps {
    csrfToken: string;
    isGroup: boolean;
    passengerTypeName: string;
    cancelActionHandler: React.MouseEventHandler<HTMLButtonElement>;
    groupsInUse?: string[];
}

const UnableToDeletePopup = ({
    groupsInUse,
    passengerTypeName,
    cancelActionHandler,
}: PopUpProps): ReactElement | null => (
    <div className="popup">
        <div className="popup__content">
            <form>
                <h1 className="govuk-heading-m">There is a problem</h1>

                <span className="govuk-hint" id="delete-hint">
                    You cannot delete {passengerTypeName} because it is part of the following group(s):{' '}
                    {groupsInUse?.join(', ')}
                </span>

                <button className="govuk-button govuk-button--secondary" onClick={cancelActionHandler}>
                    Ok
                </button>
            </form>
        </div>
    </div>
);

export default UnableToDeletePopup;
