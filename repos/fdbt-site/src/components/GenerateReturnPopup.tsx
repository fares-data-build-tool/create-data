import React, { ReactElement } from 'react';
import { getPointToPointProductsByLineId } from '../data/auroradb';

interface GenerateSinglePopupPopUpProps {
    apiUrl: string;
    lineId: string;
    nocCode: string;
    cancelActionHandler: React.MouseEventHandler<HTMLButtonElement>;
}

const canGenerateAReturn = async (noc: string, lineId: string): Promise<boolean> => {
    const products = await getPointToPointProductsByLineId(noc, lineId);
    return true;
};

const GenerateSinglePopup = async ({ apiUrl, cancelActionHandler, lineId, nocCode }: GenerateSinglePopupPopUpProps): Promise<ReactElement | null> => (
    <div className="popup">
        <div className="popup__content">
            <form>
                <h1 className="govuk-heading-m"></h1>

                <span className="govuk-hint" id="delete-hint"></span>

                <button className="govuk-button govuk-button--secondary" onClick={cancelActionHandler}>
                    Cancel
                </button>

                {await canGenerateAReturn(nocCode, lineId) && (
                    <button
                        className="govuk-link govuk-body button-link govuk-!-margin-bottom-0"
                        formAction={apiUrl}
                        formMethod="post"
                        type="submit"
                        id="generate-return-button"
                    >
                        Generate return from singles
                    </button>
                )}
            </form>
        </div>
    </div>
);

export default GenerateSinglePopup;
