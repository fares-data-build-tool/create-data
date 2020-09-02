import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import TwoThirdsLayout from '../layout/Layout';
import { SERVICE_COOKIE, JOURNEY_COOKIE, FARE_TYPE_COOKIE } from '../constants';
import { getServiceByNocCodeAndLineName, Service, RawService } from '../data/auroradb';
import DirectionDropdown from '../components/DirectionDropdown';
import FormElementWrapper from '../components/FormElementWrapper';
import ErrorSummary from '../components/ErrorSummary';
import { ErrorInfo, CustomAppProps } from '../interfaces';
import { enrichJourneyPatternsWithNaptanInfo } from '../utils/dataTransform';
import { getUuidFromCookies, setCookieOnServerSide, getAndValidateNoc } from '../utils';
import { redirectTo } from './api/apiUtils';
import CsrfForm from '../components/CsrfForm';

const title = 'Return Direction - Fares Data Build Tool';
const description = 'Return Direction selection page of the Fares Data Build Tool';

export const inboundErrorId = 'inbound-error';
export const outboundErrorId = 'outbound-error';

interface DirectionProps {
    service: Service;
    errors: ErrorInfo[];
    outboundJourney: string;
    inboundJourney: string;
}

const ReturnDirection = ({
    service,
    errors,
    outboundJourney,
    inboundJourney,
    csrfToken,
}: DirectionProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/returnDirection" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <fieldset className="govuk-fieldset" aria-describedby="return-direction-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="return-direction-page-heading">
                                Select the inbound and outbound journeys for your service
                            </h1>
                        </legend>
                        <div className="govuk-!-margin-top-5">
                            <FormElementWrapper
                                errors={errors}
                                errorId={outboundErrorId}
                                errorClass="govuk-select--error"
                            >
                                <DirectionDropdown
                                    selectName="outboundJourney"
                                    selectNameID="outbound-journey"
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
                                errorClass="govuk-select--error"
                            >
                                <DirectionDropdown
                                    selectName="inboundJourney"
                                    selectNameID="inbound-journey"
                                    dropdownLabel="Inbound Journey"
                                    journeyPatterns={service.journeyPatterns}
                                    inboundJourney={inboundJourney}
                                />
                            </FormElementWrapper>
                        </div>
                        <span className="govuk-hint hint-text" id="traveline-hint">
                            This data is taken from the Traveline National Dataset
                        </span>
                    </fieldset>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = async (ctx: NextPageContext): Promise<{}> => {
    const cookies = parseCookies(ctx);
    const serviceCookie = cookies[SERVICE_COOKIE];
    const journeyCookie = cookies[JOURNEY_COOKIE];
    const fareTypeCookie = cookies[FARE_TYPE_COOKIE];
    const nocCode = getAndValidateNoc(ctx);

    if (!serviceCookie || !fareTypeCookie || !nocCode) {
        throw new Error('Necessary cookies not found to show direction page');
    }

    const serviceInfo = JSON.parse(serviceCookie);
    const fareTypeInfo = JSON.parse(fareTypeCookie);

    const lineName = serviceInfo.service.split('#')[0];

    const rawService: RawService = await getServiceByNocCodeAndLineName(nocCode, lineName);
    const service: Service = {
        ...rawService,
        journeyPatterns: await enrichJourneyPatternsWithNaptanInfo(rawService.journeyPatterns),
    };

    if (!service) {
        throw new Error(`No service info could be retrieved for nocCode: ${nocCode} and lineName: ${lineName}`);
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
