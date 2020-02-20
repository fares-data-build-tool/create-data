import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import util from 'util';
import flatMap from 'array.prototype.flatmap';
import Layout from '../layout/Layout';
import {
    getServiceByNocCodeAndLineName,
    batchGetNaptanInfoByAtcoCode,
    NaptanInfo,
    formatStopName,
} from '../data/dynamodb';
import { OPERATOR_COOKIE, SERVICE_COOKIE, JOURNEY_COOKIE } from '../constants';
import { getUserData, UserFareStages, FareStage } from '../data/s3';

const title = 'Matching - Fares data build tool';
const description = 'Matching page of the Fares data build tool';

export interface ServiceInfo {
    lineName: string;
    nocCode: string;
    operatorShortName: string;
}

interface MatchingProps {
    userData: UserFareStages;
    stops: NaptanInfo[];
    serviceInfo: ServiceInfo;
}

const Matching = ({ userData, stops, serviceInfo }: MatchingProps): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class matching-page" id="main-content" role="main">
            <form action="/api/matching" method="post">
                <div className="govuk-form-group">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                        <h1 className="govuk-fieldset__heading">Matching Bus Stops to Fares Stage</h1>
                    </legend>
                    <div>
                        <div className="matching-wrapper">
                            <div className="govuk-heading-s matching-stop-header">Stop</div>
                            <div className="govuk-heading-s naptan-code-header">Naptan</div>
                            <div className="govuk-heading-s fare-stage-header">Fare Stage</div>
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
                                        <select className="govuk-select" id={`option${index}`} name={`option${index}`}>
                                            <option value="">Not Applicable</option>

                                            {userData.fareStages.map((stage: FareStage) => (
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

                <input type="hidden" name="serviceinfo" value={JSON.stringify(serviceInfo)} />
                <input type="hidden" name="userdata" value={JSON.stringify(userData)} />
                <input type="submit" value="Submit" id="submit-button" className="govuk-button govuk-button--start" />
            </form>
        </main>
    </Layout>
);

Matching.getInitialProps = async (ctx: NextPageContext): Promise<{}> => {
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const serviceCookie = cookies[SERVICE_COOKIE];
    const journeyCookie = cookies[JOURNEY_COOKIE];

    if (operatorCookie && serviceCookie && journeyCookie) {
        const operatorObject = JSON.parse(operatorCookie);
        const serviceObject = JSON.parse(serviceCookie);
        const journeyObject = JSON.parse(journeyCookie);

        const lineName = serviceObject.service.split('#')[0];
        const { nocCode } = operatorObject;
        const [selectedStartPoint, selectedEndPoint] = journeyObject.journeyPattern.split('#');

        try {
            if (ctx.req) {
                const service = await getServiceByNocCodeAndLineName(operatorObject.nocCode, lineName);
                const userData = await getUserData(operatorObject.uuid);

                const relevantJourneys = flatMap(
                    service.journeyPatterns,
                    journey => journey.JourneyPatternSections,
                ).filter(
                    item =>
                        item.OrderedStopPoints[0].StopPointRef === selectedStartPoint &&
                        item.OrderedStopPoints.splice(-1, 1)[0].StopPointRef === selectedEndPoint,
                );

                const masterStopList = [
                    ...new Set(
                        flatMap(relevantJourneys, journey =>
                            journey.OrderedStopPoints.flatMap(item => item.StopPointRef),
                        ),
                    ),
                ];

                const naptanInfo = await batchGetNaptanInfoByAtcoCode(masterStopList);

                console.log(util.inspect(naptanInfo, false, null, true));
                console.log(
                    util.inspect(
                        {
                            lineName,
                            nocCode,
                            operatorShortName: service.operatorShortName,
                        },
                        false,
                        null,
                        true,
                    ),
                );

                return {
                    stops: naptanInfo,
                    userData,
                    serviceInfo: {
                        lineName,
                        nocCode,
                        operatorShortName: service.operatorShortName,
                    },
                };
            }
        } catch (error) {
            console.error(`There was an error displaying the matching page: ${error}`);
            throw new Error(error);
        }
    } else {
        console.error('Necessary cookies not found to show matching page');
        throw new Error('Necessary cookies not found to show matching page');
    }

    return {};
};

export default Matching;
