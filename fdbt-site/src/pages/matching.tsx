import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import { getServiceByNocCodeAndLineName, batchGetStopsByAtcoCode, Stop } from '../data/auroradb';
import { BasicService, CustomAppProps, NextPageContextWithSession } from '../interfaces/index';
import { OPERATOR_COOKIE, SERVICE_COOKIE, JOURNEY_COOKIE, MATCHING_ATTRIBUTE } from '../constants';
import { getUserFareStages, UserFareStages } from '../data/s3';
import MatchingBase from '../components/MatchingBase';
import { getAndValidateNoc } from '../utils';
import { getJourneysByStartAndEndPoint, getMasterStopList } from '../utils/dataTransform';
import { getSessionAttribute } from '../utils/sessions';
import { MatchingWithErrors, MatchingInfo } from '../interfaces/matchingInterface';

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
    selectedFareStages: string[];
}

const Matching = ({
    userFareStages,
    stops,
    service,
    error,
    selectedFareStages,
    csrfToken,
}: MatchingProps & CustomAppProps): ReactElement => (
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
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const serviceCookie = cookies[SERVICE_COOKIE];
    const journeyCookie = cookies[JOURNEY_COOKIE];
    const nocCode = getAndValidateNoc(ctx);

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
        },
    };
};

export default Matching;
