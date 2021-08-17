import React, { ReactElement } from 'react';

interface PopUpProps {
    csrfToken: string;
    isGroup: boolean;
    passengerTypeName: string;
    passengerTypeId: number;
    cancelActionHandler: React.MouseEventHandler<HTMLButtonElement>;
}

const deleteUrl = (isGroup: boolean, idToDelete: number, csrfToken: string): string => {
    return `/api/deletePassenger?id=${idToDelete}&isGroup=${isGroup}&_csrf=${csrfToken}`;
};

const DeleteConfirmationPopup = ({
    csrfToken,
    isGroup,
    passengerTypeName,
    passengerTypeId,
    cancelActionHandler,
}: PopUpProps): ReactElement | null => (
    <div className="popup">
        <div className="popup__content">
            <form>
                <h1 className="govuk-heading-m">Are you sure you want to delete {passengerTypeName}?</h1>

                <span className="govuk-hint" id="delete-hint">
                    When you delete, you will no longer be able to create new fares for this passenger{' '}
                    {isGroup ? 'group ' : 'type'}
                </span>

                <button className="govuk-button govuk-button--secondary" onClick={cancelActionHandler}>
                    Cancel
                </button>

                <button
                    className="govuk-button govuk-button--warning"
                    formAction={deleteUrl(isGroup, passengerTypeId, csrfToken)}
                    formMethod="post"
                    type="submit"
                >
                    Delete
                </button>
            </form>
        </div>
    </div>
);

export default DeleteConfirmationPopup;
