import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE, SERVICE_COOKIE, JOURNEY_COOKIE, FARETYPE_COOKIE } from '../constants';
import { getServiceByNocCodeAndLineName, Service, RawService } from '../data/auroradb';
import DirectionDropdown from '../components/DirectionDropdown';
import FormElementWrapper from '../components/FormElementWrapper';
import ErrorSummary from '../components/ErrorSummary';
import { ErrorInfo } from '../types';
import { enrichJourneyPatternsWithNaptanInfo } from '../utils/dataTransform';
import { getUuidFromCookies, setCookieOnServerSide } from '../utils';
import { redirectTo } from './api/apiUtils';

const title = 'Journey Selection - Fares data build tool';
const description = 'Inbound and Outbound journey selection page of the Fares data build tool';

export const inboundErrorId = 'inbound-error';
export const outboundErrorId = 'outbound-error';

interface DirectionProps {
    service: Service;
    errors: ErrorInfo[];
    outboundJourney: string;
    inboundJourney: string;
}

const ReturnDirection = ({ service, errors, outboundJourney, inboundJourney }: DirectionProps): ReactElement => {
    return (
        <Layout title={title} description={description}>
            <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
                <form action="/api/returnDirection" method="post">
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                                <h1 className="govuk-fieldset__heading" id="page-heading">
                                    Select the inbound and outbound journeys for your service
                                </h1>
                            </legend>
                            <div className="govuk-!-margin-top-5">
                                <FormElementWrapper
                                    errors={errors}
                                    errorId={outboundErrorId}
                                    errorClass="govuk-radios--error"
                                >
                                    <DirectionDropdown
                                        selectNameID="outboundJourney"
                                        dropdownLabel="Outbound Journey"
                                        journeyPatterns={service.journeyPatterns}
                                        outboundJourney={outboundJourney}
                                    />
                                </FormElementWrapper>
                            </div>
                            <div className="govuk-!-margin-top-6">
                                <FormElementWrapper
                                    errors={errors}
                                    errorId={inboundErrorId}
                                    errorClass="govuk-radios--error"
                                >
                                    <DirectionDropdown
                                        selectNameID="inboundJourney"
                                        dropdownLabel="Inbound Journey"
                                        journeyPatterns={service.journeyPatterns}
                                        inboundJourney={inboundJourney}
                                    />
                                </FormElementWrapper>
                            </div>
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
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const serviceCookie = cookies[SERVICE_COOKIE];
    const journeyCookie = cookies[JOURNEY_COOKIE];
    const fareTypeCookie = cookies[FARETYPE_COOKIE];

    if (!operatorCookie || !serviceCookie || !fareTypeCookie) {
        throw new Error('Necessary cookies not found to show direction page');
    }

    const operatorInfo = JSON.parse(operatorCookie);
    const serviceInfo = JSON.parse(serviceCookie);
    const fareTypeInfo = JSON.parse(fareTypeCookie);

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

    // Redirect to inputMethod page if there is only one journeyPattern (i.e. circular journey)
    if (service.journeyPatterns.length === 1 && fareTypeInfo.fareType === 'return') {
        if (ctx.res) {
            const uuid = getUuidFromCookies(ctx);
            const journeyPatternCookie = `${service.journeyPatterns[0].startPoint.Id}#${service.journeyPatterns[0].endPoint.Id}`;
            const cookieValue = JSON.stringify({ directionJourneyPattern: journeyPatternCookie, uuid });
            setCookieOnServerSide(ctx, JOURNEY_COOKIE, cookieValue);
            redirectTo(ctx.res, '/inputMethod');
        }
    }

    // Remove journeys with duplicate start and end points for display purposes
    service.journeyPatterns = service.journeyPatterns.filter(
        (pattern, index, self) =>
            self.findIndex(
                item => item.endPoint.Id === pattern.endPoint.Id && item.startPoint.Id === pattern.startPoint.Id,
            ) === index,
    );

    if (journeyCookie) {
        const journeyCookieInfo = JSON.parse(journeyCookie);

        if (journeyCookieInfo?.errorMessages?.length > 0) {
            const { outboundJourney = '', inboundJourney = '' } = journeyCookieInfo;
            return {
                props: {
                    service,
                    errors: journeyCookieInfo.errorMessages,
                    outboundJourney,
                    inboundJourney,
                },
            };
        }
    }

    return { props: { service, errors: [] } };
};

export default ReturnDirection;
