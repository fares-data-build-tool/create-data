import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE, SERVICE_COOKIE, JOURNEY_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';
import { getJourneyPatternsAndLocalityByNocCodeAndLineName, ServiceInformation } from '../data/dynamodb';

const title = 'Select a Direction';
const description = 'Please select the route direction for your service';

type DirectionProps = {
    Operator: string;
    lineName: string;
    serviceInfo: ServiceInformation;
};

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
                            {serviceInfo.journeyPatterns.map(journeyPattern => (
                                <option
                                    key={`${journeyPattern.startPoint}`}
                                    value={(journeyPattern.startPoint, journeyPattern.endPoint)}
                                    className="journey-option"
                                >
                                    {journeyPattern.startPoint} TO {journeyPattern.endPoint}
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

Direction.getInitialProps = async (ctx: NextPageContext): Promise<{}> => {
    const redirectOnError = (): void => {
        if (ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/error',
            });
            ctx.res.end();
        }
    };

    deleteCookieOnServerSide(ctx, JOURNEY_COOKIE);

    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const serviceCookie = cookies[SERVICE_COOKIE];

    if (operatorCookie && serviceCookie) {
        const operatorObject = JSON.parse(operatorCookie);
        const serviceObject = JSON.parse(serviceCookie);
        const lineName = serviceObject.service.split('#')[0];
        let serviceInfo: ServiceInformation;

        try {
            if (ctx.req) {
                serviceInfo = await getJourneyPatternsAndLocalityByNocCodeAndLineName(operatorObject.nocCode, lineName);

                if (!serviceInfo) {
                    redirectOnError();
                    return {};
                }
                return { Operator: operatorObject.operator, lineName, serviceInfo };
            }
        } catch (err) {
            throw new Error(err.message);
        }
    }

    redirectOnError();

    return {};
};

export default Direction;
