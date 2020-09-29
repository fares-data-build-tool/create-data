import React, { ReactElement } from 'react';
import ConfirmationTable, { ConfirmationElement } from '../components/ConfirmationTable';
import { STAGE_NAMES_ATTRIBUTE } from '../constants';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import { CustomAppProps, NextPageContextWithSession } from '../interfaces';
import { isInputCheck } from '../interfaces/typeGuards';
import { getSessionAttribute } from '../utils/sessions';

const title = 'Stage Names Confirmation - Fares Data Build Tool';
const description = 'Stage Names Confirmation page of the Fares Data Build Tool';

interface StageNamesConfirmationProps {
    fareStageNames: string[];
}

export const buildFareStageNamesConfirmationElements = (fareStages: string[]): ConfirmationElement[] => {
    const confirmationElements: ConfirmationElement[] = [];
    fareStages.forEach((fareStage, index) => {
        confirmationElements.push({
            name: `Fare Stage ${index + 1}`,
            content: fareStage,
            href: 'stageNames',
        });
    });
    return confirmationElements;
};

const StageNamesConfirmation = ({
    fareStageNames,
    csrfToken,
}: StageNamesConfirmationProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={[]}>
        <CsrfForm action="/api/stageNamesConfirmation" method="post" csrfToken={csrfToken}>
            <>
                <h1 className="govuk-heading-l">Check your Fare Stage Names before moving on</h1>
                <ConfirmationTable
                    header="Fare Stage Names"
                    confirmationElements={buildFareStageNamesConfirmationElements(fareStageNames)}
                />
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: StageNamesConfirmationProps } => {
    const fareStagesAttribute = getSessionAttribute(ctx.req, STAGE_NAMES_ATTRIBUTE);

    if (!fareStagesAttribute || isInputCheck(fareStagesAttribute)) {
        throw new Error('User has reached confirmation page with incorrect fare stages info.');
    }

    return { props: { fareStageNames: fareStagesAttribute } };
};

export default StageNamesConfirmation;
