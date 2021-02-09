import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import { getServiceByNocCodeAndLineName, batchGetStopsByAtcoCode } from '../data/auroradb';
import { BasicService, NextPageContextWithSession, Stop, UserFareStages } from '../interfaces';
import { OPERATOR_COOKIE, SERVICE_ATTRIBUTE, JOURNEY_ATTRIBUTE, MATCHING_ATTRIBUTE } from '../constants';
import { getUserFareStages } from '../data/s3';
import MatchingBase from '../components/MatchingBase';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { getJourneysByStartAndEndPoint, getMasterStopList } from '../utils/dataTransform';
import { getSessionAttribute } from '../utils/sessions';
import { MatchingWithErrors, MatchingInfo } from '../interfaces/matchingInterface';
import { isService, isJourney } from '../interfaces/typeGuards';

const title = 'Matching - Create Fares Data Service';
const description = 'Matching page of the Create Fares Data Service';
const heading = 'Match stops to fares stages';
const hintText = 'Select a fare stage for each stop.';
const travelineHintText = 'This data has been taken from the Traveline National Dataset and NaPTAN database.';
const apiEndpoint = '/api/matching';

interface MatchingProps {
    userFareStages: UserFareStages;
    stops: Stop[];
    service: BasicService;
    error: boolean;
    selectedFareStages: string[][];
    csrfToken: string;
}

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

export const isMatchingWithErrors = (
    matchingAttribute: MatchingInfo | MatchingWithErrors,
): matchingAttribute is MatchingWithErrors => (matchingAttribute as MatchingWithErrors)?.error;

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: MatchingProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const nocCode = getAndValidateNoc(ctx);

    const serviceAttribute = getSessionAttribute(ctx.req, SERVICE_ATTRIBUTE);
    const journeyAttribute = getSessionAttribute(ctx.req, JOURNEY_ATTRIBUTE);

    if (!operatorCookie || !isService(serviceAttribute) || !isJourney(journeyAttribute) || !nocCode) {
        throw new Error('Necessary cookies not found to show matching page');
    }

    const operatorObject = JSON.parse(operatorCookie);
    const lineName = serviceAttribute.service.split('#')[0];
    const [selectedStartPoint, selectedEndPoint] =
        (journeyAttribute &&
            journeyAttribute.directionJourneyPattern &&
            journeyAttribute.directionJourneyPattern.split('#')) ||
        [];

    const service = await getServiceByNocCodeAndLineName(nocCode, lineName);
    const userFareStages = await getUserFareStages(operatorObject.uuid);
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

    const matchingAttribute = getSessionAttribute(ctx.req, MATCHING_ATTRIBUTE);

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

export default Matching;
