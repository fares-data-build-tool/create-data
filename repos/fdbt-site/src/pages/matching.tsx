import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import flatMap from 'array.prototype.flatmap';
import Layout from '../layout/Layout';
import {
    getServiceByNocCodeAndLineName,
    batchGetStopsByAtcoCode,
    Stop,
    RawService,
    RawJourneyPatternSection,
} from '../data/dynamodb';
import { OPERATOR_COOKIE, SERVICE_COOKIE, JOURNEY_COOKIE } from '../constants';
import { getUserFareStages, UserFareStages, FareStage } from '../data/s3';
import { formatStopName } from '../utils';

const title = 'Matching - Fares data build tool';
const description = 'Matching page of the fares data build tool';

export interface BasicService {
    lineName: string;
    nocCode: string;
    operatorShortName: string;
}

interface MatchingProps {
    userFareStages: UserFareStages;
    stops: Stop[];
    service: BasicService;
}

const Matching = ({ userFareStages, stops, service }: MatchingProps): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class matching-page" id="main-content" role="main">
            <form action="/api/matching" method="post">
                <div className="govuk-form-group">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                        <h1 className="govuk-fieldset__heading">Match stops to fares stages</h1>
                    </legend>
                    <span className="govuk-hint" id="match-fares-hint">
                        Please select the correct fare stages for each stop.
                    </span>
                    <div>
                        <div className="matching-wrapper">
                            <div className="govuk-heading-s matching-stop-header">Stop name</div>
                            <div className="govuk-heading-s naptan-code-header">Naptan code</div>
                            <div className="govuk-heading-s fare-stage-header">Fare stage</div>
                        </div>
                        {stops.map((stop, index) => (
                            <fieldset key={stop.atcoCode} className="govuk-fieldset">
                                <div className="matching-wrapper">
                                    <label className="govuk-label matching-stop-name" htmlFor={`option${index}`}>
                                        {formatStopName(stop)}
                                    </label>
                                    <label className="govuk-label naptan-code" htmlFor={`option${index}`}>
                                        {stop.naptanCode}
                                    </label>
                                    <div className="farestage-select-wrapper">
                                        <select
                                            className="govuk-select farestage-select"
                                            id={`option${index}`}
                                            name={`option${index}`}
                                        >
                                            <option value="">Not Applicable</option>

                                            {userFareStages.fareStages.map((stage: FareStage) => (
                                                <option
                                                    key={stage.stageName}
                                                    value={JSON.stringify({ stop, stage: stage.stageName })}
                                                >
                                                    {stage.stageName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </fieldset>
                        ))}
                    </div>
                </div>

                <input type="hidden" name="service" value={JSON.stringify(service)} />
                <input type="hidden" name="userfarestages" value={JSON.stringify(userFareStages)} />
                <input type="submit" value="Submit" id="submit-button" className="govuk-button govuk-button--start" />
            </form>
        </main>
    </Layout>
);

// Gets a list of journey pattern sections with a given start and end point
const getJourneysByStartAndEndPoint = (
    service: RawService,
    selectedStartPoint: string,
    selectedEndPoint: string,
): RawJourneyPatternSection[] =>
    flatMap(service.journeyPatterns, journey => journey.JourneyPatternSections).filter(
        item =>
            item.OrderedStopPoints[0].StopPointRef === selectedStartPoint &&
            item.OrderedStopPoints.slice(-1)[0].StopPointRef === selectedEndPoint,
    );

// Gets a unique set of stop point refs from an array of journey pattern sections
const getMasterStopList = (journeys: RawJourneyPatternSection[]): string[] => [
    ...new Set(flatMap(journeys, journey => journey.OrderedStopPoints.map(item => item.StopPointRef))),
];

Matching.getInitialProps = async (ctx: NextPageContext): Promise<MatchingProps> => {
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const serviceCookie = cookies[SERVICE_COOKIE];
    const journeyCookie = cookies[JOURNEY_COOKIE];

    if (!operatorCookie || !serviceCookie || !journeyCookie) {
        throw new Error('Necessary cookies not found to show matching page');
    }

    const operatorObject = JSON.parse(operatorCookie);
    const serviceObject = JSON.parse(serviceCookie);
    const journeyObject = JSON.parse(journeyCookie);

    const lineName = serviceObject.service.split('#')[0];
    const { nocCode } = operatorObject;
    const [selectedStartPoint, selectedEndPoint] = journeyObject.journeyPattern.split('#');

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

    return {
        stops: orderedStops,
        userFareStages,
        service: {
            lineName,
            nocCode,
            operatorShortName: service.operatorShortName,
        },
    };
};

export default Matching;
