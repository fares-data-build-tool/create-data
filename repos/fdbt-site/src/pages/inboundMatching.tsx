import React, { ReactElement } from 'react';
import { INBOUND_MATCHING_ATTRIBUTE } from '../constants/attributes';
import MatchingBase from '../components/MatchingBase';
import { NextPageContextWithSession } from '../interfaces';
import { getSessionAttribute } from '../utils/sessions';
import { MatchingProps } from './matching';
import { getMatchingProps } from '../utils/apiUtils/matching';

const heading = 'Inbound - Match stops to fare stages';
const title = 'Inbound Matching - Create Fares Data Service';
const description = 'Inbound Matching page of the Create Fares Data Service';
const hintText = 'Select a fare stage for each stop on the inbound journey.';
const travelineHintText = 'This data has been taken from the Traveline National Dataset and NaPTAN database.';
const apiEndpoint = '/api/inboundMatching';

const InboundMatching = ({
    userFareStages,
    stops,
    service,
    error,
    warning,
    csrfToken,
    selectedFareStages,
}: MatchingProps): ReactElement => (
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
        csrfToken={csrfToken}
    />
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: MatchingProps }> => {
    const matchingAttribute = getSessionAttribute(ctx.req, INBOUND_MATCHING_ATTRIBUTE);

    return await getMatchingProps(ctx, matchingAttribute);
};

export default InboundMatching;
