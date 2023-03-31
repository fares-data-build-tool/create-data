import React, { ReactElement } from 'react';
import { MATCHING_ATTRIBUTE } from '../constants/attributes';
import { BasicService, NextPageContextWithSession, UserFareStages } from '../interfaces';
import MatchingBase from '../components/MatchingBase';
import { getSessionAttribute } from '../utils/sessions';
import { getMatchingProps } from '../utils/apiUtils/matching';
import { Stop } from '../interfaces/matchingJsonTypes';
import { redirectTo } from '../utils/apiUtils';

const title = 'Matching - Create Fares Data Service';
const description = 'Matching page of the Create Fares Data Service';
const heading = 'Match stops to fares stages';
const hintText = 'Select a fare stage for each stop.';
const apiEndpoint = '/api/matching';

const Matching = ({
    userFareStages,
    stops,
    service,
    error,
    selectedFareStages,
    csrfToken,
    dataSource,
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
        dataSource={dataSource}
        apiEndpoint={apiEndpoint}
        csrfToken={csrfToken}
        unusedStage={false}
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
    dataSource: string;
}

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: MatchingProps }> => {
    const matchingAttribute = getSessionAttribute(ctx.req, MATCHING_ATTRIBUTE);

    let props;

    try {
        props = (await getMatchingProps(ctx, matchingAttribute, true)).props;
    } catch (error) {
        if (ctx.res) {
            redirectTo(ctx.res, '/missingStops');
        }
        throw new Error('Could not redirect.');
    }

    return { props };
};

export default Matching;
