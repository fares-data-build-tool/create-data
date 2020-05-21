import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE, SERVICE_COOKIE, JOURNEY_COOKIE, FARETYPE_COOKIE, PASSENGER_TYPE_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';
import { getServiceByNocCodeAndLineName, Service, RawService } from '../data/auroradb';
import DirectionDropdown from '../components/DirectionDropdown';
import { enrichJourneyPatternsWithNaptanInfo } from '../utils/dataTransform';

const title = 'Single Direction - Fares Data Build Tool';
const description = 'Single Direction selection page of the Fares Data Build Tool';

interface DirectionProps {
    operator: string;
    passengerType: string;
    lineName: string;
    service: Service;
}

const SingleDirection = ({ operator, passengerType, lineName, service }: DirectionProps): ReactElement => {
    return (
        <Layout title={title} description={description}>
            <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
                <form action="/api/singleDirection" method="post">
                    <div className="govuk-form-group">
                        <fieldset className="govuk-fieldset" aria-describedby="single-direction-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                                <h1 className="govuk-fieldset__heading" id="single-direction-page-heading">
                                    Select a journey direction
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="direction-operator-linename-passengertype-hint">
                                {operator} - {lineName} - {passengerType}
                            </span>
                            <span className="govuk-hint" id="direction-journey-description-hint">
                                {`Journey: ${service.serviceDescription}`}
                            </span>
                            <DirectionDropdown
                                selectNameID="directionJourneyPattern"
                                journeyPatterns={service.journeyPatterns}
                            />
                            <span className="govuk-hint hint-text" id="traveline-hint">
                                This data is taken from the Traveline National Dataset
                            </span>
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
};

export const getServerSideProps = async (ctx: NextPageContext): Promise<{}> => {
    deleteCookieOnServerSide(ctx, JOURNEY_COOKIE);
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const serviceCookie = cookies[SERVICE_COOKIE];
    const fareTypeCookie = cookies[FARETYPE_COOKIE];
    const passengerTypeCookie = cookies[PASSENGER_TYPE_COOKIE];

    if (!operatorCookie || !serviceCookie || !fareTypeCookie || !passengerTypeCookie) {
        throw new Error('Necessary cookies not found to show direction page');
    }

    const operatorInfo = JSON.parse(operatorCookie);
    const serviceInfo = JSON.parse(serviceCookie);
    const passengerTypeInfo = JSON.parse(passengerTypeCookie);
    const { passengerType } = passengerTypeInfo;

    const lineName = serviceInfo.service.split('#')[0];

    const rawService: RawService = await getServiceByNocCodeAndLineName(operatorInfo.nocCode, lineName);
    const service: Service = {
        ...rawService,
        journeyPatterns: await enrichJourneyPatternsWithNaptanInfo(rawService.journeyPatterns),
    };

    if (!service) {
        throw new Error(
            `No service info could be retrieved for nocCode: ${operatorInfo.nocCode} and lineName: ${lineName}`,
        );
    }

    // Remove journeys with duplicate start and end points for display purposes
    service.journeyPatterns = service.journeyPatterns.filter(
        (pattern, index, self) =>
            self.findIndex(
                item => item.endPoint.Id === pattern.endPoint.Id && item.startPoint.Id === pattern.startPoint.Id,
            ) === index,
    );

    return {
        props: { operator: operatorInfo.operator, passengerType, lineName, service },
    };
};

export default SingleDirection;
