import React, { ReactElement } from 'react';

interface DeleteSOPButtonProps {
    sopId: string;
    csrfToken: string;
}

const DeleteSOPButton = ({ sopId, csrfToken }: DeleteSOPButtonProps): ReactElement => {
    return (
        <button
            type="submit"
            className="govuk-button govuk-button--secondary govuk-!-margin-left-3"
            formAction={`/api/deleteSop?sopId=${sopId}&_csrf=${csrfToken}`}
            formMethod="post"
        >
            Delete sales offer package
        </button>
    );
};

export default DeleteSOPButton;
