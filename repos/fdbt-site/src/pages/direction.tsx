import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import flatMap from 'array.prototype.flatmap';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE, SERVICE_COOKIE, JOURNEY_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';
import {
    getServiceByNocCodeAndLineName,
    ServiceData,
    getNaptanInfoByAtcoCode,
    JourneyPattern,
    RawJourneyPattern,
    RawServiceData,
} from '../data/dynamodb';

const title = 'Select a Direction - Fares data build tool';
const description = 'Direction selection page of the Fares data build tool';

interface DirectionProps {
    Operator: string;
    lineName: string;
    serviceInfo: ServiceData;
}

const Direction = ({ Operator, lineName, serviceInfo }: DirectionProps): ReactElement => (
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
                            {Operator} - {lineName}
                        </span>
                        <span className="govuk-hint" id="direction-journey-description-hint">
                            {`Journey: ${serviceInfo.serviceDescription}`}
                        </span>
                        <select className="govuk-select" id="journeyPattern" name="journeyPattern" defaultValue="">
                            <option value="" disabled>
                                Select One
                            </option>
                            {serviceInfo.journeyPatterns.map((journeyPattern, i) => (
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
                    section.OrderedStopPoints.flatMap(stop => stop.StopPointRef),
                );
                const startPoint = item.JourneyPatternSections[0].OrderedStopPoints[0];
                const startPointNaptan = await getNaptanInfoByAtcoCode(startPoint.StopPointRef);

                const endPoint = [...item.JourneyPatternSections].splice(-1, 1)[0].OrderedStopPoints.splice(-1, 1)[0];
                const endPointNaptan = await getNaptanInfoByAtcoCode(endPoint.StopPointRef);

                return {
                    startPoint: {
                        Display: `${startPoint.CommonName}${
                            startPointNaptan?.localityName ? `, ${startPointNaptan.localityName}` : ''
                        }`,
                        Id: startPoint.StopPointRef,
                    },
                    endPoint: {
                        Display: `${endPoint.CommonName}${
                            endPointNaptan?.localityName ? `, ${endPointNaptan.localityName}` : ''
                        }`,
                        Id: endPoint.StopPointRef,
                    },
                    stopList,
                };
            },
        ),
    );

Direction.getInitialProps = async (ctx: NextPageContext): Promise<{}> => {
    deleteCookieOnServerSide(ctx, JOURNEY_COOKIE);
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const serviceCookie = cookies[SERVICE_COOKIE];

    if (operatorCookie && serviceCookie) {
        const operatorObject = JSON.parse(operatorCookie);
        const serviceObject = JSON.parse(serviceCookie);
        const lineName = serviceObject.service.split('#')[0];

        try {
            if (ctx.req) {
                const rawServiceData: RawServiceData = await getServiceByNocCodeAndLineName(
                    operatorObject.nocCode,
                    lineName,
                );
                const serviceData: ServiceData = {
                    ...rawServiceData,
                    journeyPatterns: await enrichJourneyPatternsWithNaptanInfo(rawServiceData.journeyPatterns),
                };

                if (!serviceData && ctx.res) {
                    throw new Error(
                        `No service info could be retrieved for nocCode: ${operatorObject.nocCode} and lineName: ${lineName}`,
                    );
                }

                // Remove journeys with duplicate start and end points for display purposes
                serviceData.journeyPatterns = serviceData.journeyPatterns.filter(
                    (pattern, index, self) =>
                        self.findIndex(
                            item =>
                                item.endPoint.Id === pattern.endPoint.Id &&
                                item.startPoint.Id === pattern.startPoint.Id,
                        ) === index,
                );

                return { Operator: operatorObject.operator, lineName, serviceInfo: serviceData };
            }
        } catch (error) {
            console.error(`Unable to get journey patterns for direction page: ${error.stack}`);
            throw new Error(error);
        }
    } else {
        console.error('Necessary cookies not found to show direction page');
        throw new Error('Necessary cookies not found to show direction page');
    }

    return {};
};

export default Direction;
