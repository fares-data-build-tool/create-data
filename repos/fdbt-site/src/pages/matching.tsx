import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import {
    getServiceByNocCodeAndLineName,
    batchGetStopsByAtcoCode,
    Stop,
    RawService,
    RawJourneyPattern,
} from '../data/auroradb';
import { BasicService, CustomAppProps } from '../interfaces/index';
import { OPERATOR_COOKIE, SERVICE_COOKIE, JOURNEY_COOKIE, MATCHING_COOKIE } from '../constants';
import { getUserFareStages, UserFareStages } from '../data/s3';
import MatchingBase from '../components/MatchingBase';
import { getNocFromIdToken } from '../utils';

const title = 'Matching - Fares Data Build Tool';
const description = 'Matching page of the Fares Data Build Tool';
const heading = 'Match stops to fares stages';
const hintText = 'Select a fare stage for each stop.';
const travelineHintText = 'This data has been taken from the Traveline National Dataset and NaPTAN database.';
const apiEndpoint = '/api/matching';

interface MatchingProps {
    userFareStages: UserFareStages;
    stops: Stop[];
    service: BasicService;
    error: boolean;
}

const Matching = ({
    userFareStages,
    stops,
    service,
    error,
    csrfToken,
}: MatchingProps & CustomAppProps): ReactElement => (
    <MatchingBase
        userFareStages={userFareStages}
        stops={stops}
        service={service}
        error={error}
        heading={heading}
        title={title}
        description={description}
        hintText={hintText}
        travelineHintText={travelineHintText}
        apiEndpoint={apiEndpoint}
        csrfToken={csrfToken}
    />
);

// Gets a list of journey pattern sections with a given start and end point
const getJourneysByStartAndEndPoint = (
    service: RawService,
    selectedStartPoint: string,
    selectedEndPoint: string,
): RawJourneyPattern[] =>
    service.journeyPatterns.filter(
        item =>
            item.orderedStopPoints[0].stopPointRef === selectedStartPoint &&
            item.orderedStopPoints.slice(-1)[0].stopPointRef === selectedEndPoint,
    );

// Gets a unique set of stop point refs from an array of journey pattern sections
const getMasterStopList = (journeys: RawJourneyPattern[]): string[] => [
    ...new Set(journeys.flatMap(journey => journey.orderedStopPoints.map(item => item.stopPointRef))),
];

export const getServerSideProps = async (ctx: NextPageContext): Promise<{ props: MatchingProps }> => {
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const serviceCookie = cookies[SERVICE_COOKIE];
    const journeyCookie = cookies[JOURNEY_COOKIE];
    const matchingCookie = cookies[MATCHING_COOKIE];
    const nocCode = getNocFromIdToken(ctx);

    if (!operatorCookie || !serviceCookie || !journeyCookie || !nocCode) {
        throw new Error('Necessary cookies not found to show matching page');
    }

    const operatorObject = JSON.parse(operatorCookie);
    const serviceObject = JSON.parse(serviceCookie);
    const journeyObject = JSON.parse(journeyCookie);
    const lineName = serviceObject.service.split('#')[0];
    const [selectedStartPoint, selectedEndPoint] = journeyObject.directionJourneyPattern.split('#');
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
            error: !matchingCookie ? false : JSON.parse(matchingCookie).error,
        },
    };
};

export default Matching;
