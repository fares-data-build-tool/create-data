import React, { ReactElement } from 'react';
import {
    SERVICE_ATTRIBUTE,
    JOURNEY_ATTRIBUTE,
    INBOUND_MATCHING_ATTRIBUTE,
    OPERATOR_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
} from '../constants/attributes';
import { getServiceByNocCodeLineNameAndDataSource, batchGetStopsByAtcoCode } from '../data/auroradb';
import { getUserFareStages } from '../data/s3';
import { getJourneysByStartAndEndPoint, getMasterStopList } from '../utils/dataTransform';
import MatchingBase from '../components/MatchingBase';
import { BasicService, NextPageContextWithSession, Stop, UserFareStages, TxcSourceAttribute } from '../interfaces';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { getSessionAttribute } from '../utils/sessions';
import { InboundMatchingInfo, MatchingWithErrors } from '../interfaces/matchingInterface';
import { isService, isJourney } from '../interfaces/typeGuards';

const heading = 'Inbound - Match stops to fare stages';
const title = 'Inbound Matching - Create Fares Data Service';
const description = 'Inbound Matching page of the Create Fares Data Service';
const hintText = 'Select a fare stage for each stop on the inbound journey.';
const travelineHintText = 'This data has been taken from the Traveline National Dataset and NaPTAN database.';
const apiEndpoint = '/api/inboundMatching';

interface MatchingProps {
    userFareStages: UserFareStages;
    stops: Stop[];
    service: BasicService;
    error: boolean;
    selectedFareStages: string[][];
    csrfToken: string;
}

const InboundMatching = ({
    userFareStages,
    stops,
    service,
    error,
    csrfToken,
    selectedFareStages,
}: MatchingProps): ReactElement => (
    <MatchingBase
        userFareStages={userFareStages}
        stops={stops}
        service={service}
        error={error}
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
const isMatchingWithErrors = (
    matchingAttribute: InboundMatchingInfo | MatchingWithErrors,
): matchingAttribute is MatchingWithErrors => (matchingAttribute as MatchingWithErrors)?.error;

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: MatchingProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const operatorAttribute = getSessionAttribute(ctx.req, OPERATOR_ATTRIBUTE);
    const nocCode = getAndValidateNoc(ctx);

    const serviceAttribute = getSessionAttribute(ctx.req, SERVICE_ATTRIBUTE);
    const journeyAttribute = getSessionAttribute(ctx.req, JOURNEY_ATTRIBUTE);

    if (!operatorAttribute?.uuid || !isService(serviceAttribute) || !isJourney(journeyAttribute) || !nocCode) {
        throw new Error('Necessary attributes not found to show matching page');
    }

    const lineName = serviceAttribute.service.split('#')[0];
    const [selectedStartPoint, selectedEndPoint] =
        (journeyAttribute && journeyAttribute.inboundJourney && journeyAttribute.inboundJourney.split('#')) || [];
    const dataSource = (getSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE) as TxcSourceAttribute).source;
    const service = await getServiceByNocCodeLineNameAndDataSource(nocCode, lineName, dataSource);
    const userFareStages = await getUserFareStages(operatorAttribute.uuid);
    const relevantJourneys = getJourneysByStartAndEndPoint(service, selectedStartPoint, selectedEndPoint);
    const masterStopList = getMasterStopList(relevantJourneys);

    if (masterStopList.length === 0) {
        throw new Error(
            `No stops found for journey: nocCode ${nocCode}, lineName: ${lineName}, startPoint: ${selectedStartPoint}, endPoint: ${selectedEndPoint}`,
        );
    }

    const naptanInfo = await batchGetStopsByAtcoCode(masterStopList);
    const orderedStops = masterStopList
        .map(atco => naptanInfo.find(s => s.atcoCode === atco))
        .filter((stop: Stop | undefined): stop is Stop => stop !== undefined);

    const matchingAttribute = getSessionAttribute(ctx.req, INBOUND_MATCHING_ATTRIBUTE);

    return {
        props: {
            stops: orderedStops,
            userFareStages,
            service: {
                lineName,
                nocCode,
                operatorShortName: service.operatorShortName,
                serviceDescription: service.serviceDescription,
            },
            error: matchingAttribute && isMatchingWithErrors(matchingAttribute) ? matchingAttribute.error : false,
            selectedFareStages:
                matchingAttribute && isMatchingWithErrors(matchingAttribute)
                    ? matchingAttribute.selectedFareStages
                    : [],
            csrfToken,
        },
    };
};

export default InboundMatching;
