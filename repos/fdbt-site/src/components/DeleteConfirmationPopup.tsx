import React, { ReactElement } from 'react';
import Trap from './Trap';

interface PopUpProps {
    entityName: string;
    deleteUrl: string;
    cancelActionHandler: React.MouseEventHandler<HTMLButtonElement>;
    hintText?: string;
    isOpen: boolean;
}

const DeleteConfirmationPopup = ({
    entityName,
    deleteUrl,
    cancelActionHandler,
    hintText,
    isOpen,
}: PopUpProps): ReactElement | null => (
    <Trap active={isOpen}>
        <div className="popup">
            <div className="popup__content">
                <form>
                    <h1 className="govuk-heading-m">Are you sure you want to delete {entityName.trim()}?</h1>

                    <span className="govuk-hint" id="delete-hint">
                        {hintText && (
                            <span className="govuk-hint" id="delete-hint">
                                {hintText}
                            </span>
                        )}
                    </span>

                    <button className="govuk-button govuk-button--secondary" onClick={cancelActionHandler}>
                        Cancel
                    </button>

                    <button
                        className="govuk-button govuk-button--warning"
                        formAction={deleteUrl}
                        formMethod="post"
                        type="submit"
                        id="popup-delete-button"
                    >
                        Delete
                    </button>
                </form>
            </div>
        </div>
    </Trap>
);

export default DeleteConfirmationPopup;
