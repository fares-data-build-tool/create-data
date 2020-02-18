import '../design/Pages.scss';
import React from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { getUserData } from '../data/s3';
import { getUuidFromCookies } from '../utils';
import {
    // getBusStopNamesAndNaptanCodes,
    // BusStopType,
    // DirectionObject,
    getJourneysByNocCodeAndLineName,
    Service,
} from '../data/dynamodb';
import { OPERATOR_COOKIE, SERVICE_COOKIE } from '../constants';
import { redirectToError } from './api/apiUtils';

const title = 'Matching - Fares data build tool';
const description = 'Matching page of the Fares data build tool';

interface MatchingProps {
    fareStages: string[];
    stopPointRefs: string[];
    stops: any[];
}

const Matching = ({ fareStages, stops }: MatchingProps) => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/matching" method="post" encType="multipart/form-data">
                <div className="govuk-form-group">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                        <h1 className="govuk-fieldset__heading">Matching Bus Stops to Fares Stage</h1>
                    </legend>
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds-from-desktop">
                            {stops.map(item => {
                                return (
                                    <fieldset className="govuk-fieldset" aria-describedby="changed-name-hint">
                                        <div className="inline-select">
                                            <label className="govuk-label" htmlFor="sort">
                                                {item.CommonName}
                                            </label>
                                            <select className="govuk-select" id="sort" name="sort">
                                                {fareStages.map((stage: string) => (
                                                    <option value={stage}>{stage}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </fieldset>
                                );
                            })}
                            <fieldset className="govuk-fieldset" aria-describedby="changed-name-hint">
                                <div className="inline-select">
                                    <label className="govuk-label" htmlFor="sort">
                                        Stop name - Naptan Code
                                    </label>
                                    <select className="govuk-select" id="sort" name="sort">
                                        {fareStages.map((item: string) => (
                                            <option value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                            </fieldset>
                            <fieldset className="govuk-fieldset" aria-describedby="changed-name-hint">
                                <div className="inline-select">
                                    <label className="govuk-label" htmlFor="sort">
                                        Stop name - Naptan Code
                                    </label>
                                    <select className="govuk-select" id="sort" name="sort">
                                        {fareStages.map((item: string) => (
                                            <option value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                            </fieldset>
                            <fieldset className="govuk-fieldset" aria-describedby="changed-name-hint">
                                <div className="inline-select">
                                    <label className="govuk-label" htmlFor="sort">
                                        Stop name - Naptan Code
                                    </label>
                                    <select className="govuk-select" id="sort" name="sort">
                                        {fareStages.map((item: string) => (
                                            <option value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                            </fieldset>
                            <fieldset className="govuk-fieldset" aria-describedby="changed-name-hint">
                                <div className="inline-select">
                                    <label className="govuk-label" htmlFor="sort">
                                        Stop name - Naptan Code
                                    </label>
                                    <select className="govuk-select" id="sort" name="sort">
                                        {fareStages.map((item: string) => (
                                            <option value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                            </fieldset>
                            <fieldset className="govuk-fieldset" aria-describedby="changed-name-hint">
                                <div className="inline-select">
                                    <label className="govuk-label" htmlFor="sort">
                                        Stop name - Naptan Code
                                    </label>
                                    <select className="govuk-select" id="sort" name="sort">
                                        {fareStages.map((item: string) => (
                                            <option value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
                <input type="submit" value="Continue" id="submit-button" className="govuk-button govuk-button--start" />
            </form>
        </main>
    </Layout>
);

Matching.getInitialProps = async (ctx: NextPageContext): Promise<{}> => {
    const uuid: string = getUuidFromCookies(ctx);
    const userData = await getUserData(uuid);

    const fareStages = userData.fareStages.map(item => item.stageName);

    const journeyPattenRef = '';

    // getJourneyPatternFromCookies(ctx);

    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const serviceCookie = cookies[SERVICE_COOKIE];

    let service: Service[] = [];
    let userJourney;
    let stopPointRefs: string[];

    if (operatorCookie && serviceCookie) {
        const operatorObject = JSON.parse(operatorCookie);
        const serviceObject = JSON.parse(serviceCookie);
        const lineName = serviceObject.service.split('#')[0];

        try {
            if (ctx.req) {
                service = await getJourneysByNocCodeAndLineName(operatorObject.nocCode, lineName);
                userJourney = service[0].journeyPatterns.find(
                    journey => journey.JourneyPatternRef === journeyPattenRef,
                );

                stopPointRefs = userJourney?.OrderedStopPoints.map(item => item.StopPointRef) ?? [];

                return {
                    fareStages,
                    stopPointRefs,
                    stops: userJourney?.OrderedStopPoints,
                };

                // const busStopsAndNaptanCodes: BusStopType[] = await getBusStopNamesAndNaptanCodes(stopPointRefs);
            }
            if (service.length === 0) {
                redirectToError(ctx.res!);
                return {};
            }
        } catch (err) {
            throw new Error(err.message);
        }
    }

    return {};
};

export default Matching;
