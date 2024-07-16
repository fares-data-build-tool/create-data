import React, { ReactElement } from 'react';
import Trap from './Trap';

interface PopUpProps {
    csrfToken: string;
    isGroup: boolean;
    passengerTypeName: string;
    cancelActionHandler: React.MouseEventHandler<HTMLButtonElement>;
    groupsInUse?: string[];
    isOpen: boolean;
}

const UnableToDeletePopup = ({
    groupsInUse,
    passengerTypeName,
    cancelActionHandler,
    isOpen,
}: PopUpProps): ReactElement | null => (
    <Trap active={isOpen}>
        <div className="popup">
            <div className="popup__content">
                <form>
                    <h1 className="govuk-heading-m">There is a problem</h1>

                    <span className="govuk-hint" id="delete-hint">
                        You cannot delete {passengerTypeName} because it is part of the following group(s):{' '}
                        {groupsInUse?.join(', ')}
                    </span>

                    <button className="govuk-button govuk-button" onClick={cancelActionHandler}>
                        Ok
                    </button>
                </form>
            </div>
        </div>
    </Trap>
);

export default UnableToDeletePopup;
