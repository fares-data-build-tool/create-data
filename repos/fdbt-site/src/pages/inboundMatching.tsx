import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import { getServiceByNocCodeAndLineName, batchGetStopsByAtcoCode, Stop } from '../data/auroradb';
import { OPERATOR_COOKIE, SERVICE_COOKIE, JOURNEY_COOKIE, MATCHING_COOKIE } from '../constants';
import { getUserFareStages, UserFareStages } from '../data/s3';
import { getJourneysByStartAndEndPoint, getMasterStopList } from '../utils/dataTransform';
import MatchingBase from '../components/MatchingBase';
import { BasicService } from '../interfaces/index';

const heading = 'Inbound - Match stops to fare stages';
const title = 'Inbound Matching - Fares data build tool';
const description = 'Inbound Matching page of the fares data build tool';
const hintText = 'Select a fare stage for each stop on the inbound journey.';
const travelineHintText = 'This data has been taken from the Traveline National Dataset and NaPTAN database.';
const apiEndpoint = '/api/inboundMatching';

interface MatchingProps {
    userFareStages: UserFareStages;
    stops: Stop[];
    service: BasicService;
    error: boolean;
}

const InboundMatching = ({ userFareStages, stops, service, error }: MatchingProps): ReactElement => (
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
    />
);

export const getServerSideProps = async (ctx: NextPageContext): Promise<{ props: MatchingProps }> => {
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const serviceCookie = cookies[SERVICE_COOKIE];
    const journeyCookie = cookies[JOURNEY_COOKIE];
    const matchingCookie = cookies[MATCHING_COOKIE];

    if (!operatorCookie || !serviceCookie || !journeyCookie) {
        throw new Error('Necessary cookies not found to show matching page');
    }

    const operatorObject = JSON.parse(operatorCookie);
    const serviceObject = JSON.parse(serviceCookie);
    const journeyObject = JSON.parse(journeyCookie);
    const lineName = serviceObject.service.split('#')[0];
    const { nocCode } = operatorObject;
    const [selectedStartPoint, selectedEndPoint] = journeyObject.outboundJourney.split('#');
    const service = await getServiceByNocCodeAndLineName(operatorObject.nocCode, lineName);
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

    const parsedMatchingCookie = !matchingCookie ? false : JSON.parse(matchingCookie);

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
            error: !parsedMatchingCookie.inbound ? false : JSON.parse(matchingCookie).inbound.error,
        },
    };
};

export default InboundMatching;
