import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import flatMap from 'array.prototype.flatmap';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE, SERVICE_COOKIE, JOURNEY_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';
import {
    getServiceByNocCodeAndLineName,
    Service,
    batchGetStopsByAtcoCode,
    JourneyPattern,
    RawJourneyPattern,
    RawService,
} from '../data/dynamodb';

const title = 'Select a Direction - Fares data build tool';
const description = 'Direction selection page of the Fares data build tool';

interface DirectionProps {
    operator: string;
    lineName: string;
    service: Service;
}

const Direction = ({ operator, lineName, service }: DirectionProps): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/direction" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading" id="page-heading">
                                Please select your journey direction
                            </h1>
                        </legend>
                        <span className="govuk-hint" id="direction-operator-linename-hint">
                            {operator} - {lineName}
                        </span>
                        <span className="govuk-hint" id="direction-journey-description-hint">
                            {`Journey: ${service.serviceDescription}`}
                        </span>
                        <select className="govuk-select" id="journeyPattern" name="journeyPattern" defaultValue="">
                            <option value="" disabled>
                                Select One
                            </option>
                            {service.journeyPatterns.map((journeyPattern, i) => (
                                <option
                                    key={`${journeyPattern.startPoint.Id}#${journeyPattern.endPoint.Id}#${+i}`}
                                    value={`${journeyPattern.startPoint.Id}#${journeyPattern.endPoint.Id}`}
                                    className="journey-option"
                                >
                                    {journeyPattern.startPoint.Display} TO {journeyPattern.endPoint.Display}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                </div>
                <input
                    type="submit"
                    value="Continue"
                    id="continue-button"
                    className="govuk-button govuk-button--start"
                />
            </form>
        </main>
    </Layout>
);

const enrichJourneyPatternsWithNaptanInfo = async (journeyPatterns: RawJourneyPattern[]): Promise<JourneyPattern[]> =>
    Promise.all(
        journeyPatterns.map(
            async (item: RawJourneyPattern): Promise<JourneyPattern> => {
                const stopList = flatMap(item.JourneyPatternSections, section =>
                    section.OrderedStopPoints.map(stop => stop.StopPointRef),
                );
                const startPoint = item.JourneyPatternSections[0].OrderedStopPoints[0];
                const [startPointStopLocality] = await batchGetStopsByAtcoCode([startPoint.StopPointRef]);

                const endPoint = item.JourneyPatternSections.slice(-1)[0].OrderedStopPoints.slice(-1)[0];
                const [endPointStopLocality] = await batchGetStopsByAtcoCode([endPoint.StopPointRef]);

                return {
                    startPoint: {
                        Display: `${startPoint.CommonName}${
                            startPointStopLocality?.localityName ? `, ${startPointStopLocality.localityName}` : ''
                        }`,
                        Id: startPoint.StopPointRef,
                    },
                    endPoint: {
                        Display: `${endPoint.CommonName}${
                            endPointStopLocality?.localityName ? `, ${endPointStopLocality.localityName}` : ''
                        }`,
                        Id: endPoint.StopPointRef,
                    },
                    stopList,
                };
            },
        ),
    );

export const getServerSideProps = async (ctx: NextPageContext): Promise<{}> => {
    deleteCookieOnServerSide(ctx, JOURNEY_COOKIE);
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const serviceCookie = cookies[SERVICE_COOKIE];

    if (!operatorCookie || !serviceCookie) {
        throw new Error('Necessary cookies not found to show direction page');
    }

    const operatorObject = JSON.parse(operatorCookie);
    const serviceObject = JSON.parse(serviceCookie);
    const lineName = serviceObject.service.split('#')[0];

    const rawService: RawService = await getServiceByNocCodeAndLineName(operatorObject.nocCode, lineName);
    const service: Service = {
        ...rawService,
        journeyPatterns: await enrichJourneyPatternsWithNaptanInfo(rawService.journeyPatterns),
    };

    if (!service) {
        throw new Error(
            `No service info could be retrieved for nocCode: ${operatorObject.nocCode} and lineName: ${lineName}`,
        );
    }

    // Remove journeys with duplicate start and end points for display purposes
    service.journeyPatterns = service.journeyPatterns.filter(
        (pattern, index, self) =>
            self.findIndex(
                item => item.endPoint.Id === pattern.endPoint.Id && item.startPoint.Id === pattern.startPoint.Id,
            ) === index,
    );

    return { props: { operator: operatorObject.operator, lineName, service } };
};

export default Direction;
