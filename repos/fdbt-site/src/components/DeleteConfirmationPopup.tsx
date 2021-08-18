import React, { ReactElement } from 'react';

interface PopUpProps {
    entityType: string;
    entityName: string;
    deleteUrl: string;
    cancelActionHandler: React.MouseEventHandler<HTMLButtonElement>;
}

const DeleteConfirmationPopup = ({
    entityType,
    entityName,
    deleteUrl,
    cancelActionHandler,
}: PopUpProps): ReactElement | null => (
    <div className="popup">
        <div className="popup__content">
            <form>
                <h1 className="govuk-heading-m">Are you sure you want to delete {entityName}?</h1>

                <span className="govuk-hint" id="delete-hint">
                    When you delete, you will no longer be able to create new fares using this {entityType}.
                </span>

                <button className="govuk-button govuk-button--secondary" onClick={cancelActionHandler}>
                    Cancel
                </button>

                <button
                    className="govuk-button govuk-button--warning"
                    formAction={deleteUrl}
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
