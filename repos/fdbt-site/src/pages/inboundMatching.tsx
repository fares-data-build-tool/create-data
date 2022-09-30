import React, { ReactElement } from 'react';
import { INBOUND_MATCHING_ATTRIBUTE } from '../constants/attributes';
import MatchingBase from '../components/MatchingBase';
import { BasicService, NextPageContextWithSession, Stop, UserFareStages } from '../interfaces';
import { getSessionAttribute } from '../utils/sessions';
import { getMatchingProps } from '../utils/apiUtils/matching';

const heading = 'Inbound - Match stops to fare stages';
const title = 'Inbound Matching - Create Fares Data Service';
const description = 'Inbound Matching page of the Create Fares Data Service';
const hintText = 'Select a fare stage for each stop on the inbound journey.';
const travelineHintText = 'This data has been taken from the Traveline National Dataset and NaPTAN database.';
const apiEndpoint = '/api/inboundMatching';

interface InboundMatchingProps {
    userFareStages: UserFareStages;
    stops: Stop[];
    service: BasicService;
    error: string;
    warning?: boolean;
    selectedFareStages: string[][];
    unusedStage: boolean;
    csrfToken: string;
}

const InboundMatching = ({
    userFareStages,
    stops,
    service,
    error,
    warning,
    csrfToken,
    selectedFareStages,
    unusedStage,
}: InboundMatchingProps): ReactElement => (
    <MatchingBase
        userFareStages={userFareStages}
        stops={stops}
        service={service}
        error={error}
        warning={warning}
        selectedFareStages={selectedFareStages}
        heading={heading}
        title={title}
        description={description}
        hintText={hintText}
        travelineHintText={travelineHintText}
        apiEndpoint={apiEndpoint}
        unusedStage={unusedStage}
        csrfToken={csrfToken}
    />
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: InboundMatchingProps }> => {
    const matchingAttribute = getSessionAttribute(ctx.req, INBOUND_MATCHING_ATTRIBUTE);
    const unusedStage = !!ctx.query.unusedStage;
    return { props: { ...(await getMatchingProps(ctx, matchingAttribute)).props, unusedStage } };
};

export default InboundMatching;
