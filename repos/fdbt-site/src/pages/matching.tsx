import React, { ReactElement } from 'react';
import { MATCHING_ATTRIBUTE } from '../constants/attributes';
import { BasicService, NextPageContextWithSession, Stop, UserFareStages } from '../interfaces';
import MatchingBase from '../components/MatchingBase';
import { getSessionAttribute } from '../utils/sessions';
import { getMatchingProps } from '../utils/apiUtils/matching';

const title = 'Matching - Create Fares Data Service';
const description = 'Matching page of the Create Fares Data Service';
const heading = 'Match stops to fares stages';
const hintText = 'Select a fare stage for each stop.';
const travelineHintText = 'This data has been taken from the Traveline National Dataset and NaPTAN database.';
const apiEndpoint = '/api/matching';

const Matching = ({
    userFareStages,
    stops,
    service,
    error,
    selectedFareStages,
    csrfToken,
}: MatchingProps): ReactElement => (
    <MatchingBase
        userFareStages={userFareStages}
        stops={stops}
        service={service}
        error={error}
        warning={false}
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

export interface MatchingProps {
    userFareStages: UserFareStages;
    stops: Stop[];
    service: BasicService;
    error: string;
    warning?: boolean;
    selectedFareStages: string[][];
    csrfToken: string;
}

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: MatchingProps }> => {
    const matchingAttribute = getSessionAttribute(ctx.req, MATCHING_ATTRIBUTE);

    return await getMatchingProps(ctx, matchingAttribute);
};

export default Matching;
