import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import { FARE_TYPE_ATTRIBUTE, JOURNEY_ATTRIBUTE, SERVICE_ATTRIBUTE } from '../constants/attributes';
import { getServiceByNocCodeAndLineName } from '../data/auroradb';
import DirectionDropdown from '../components/DirectionDropdown';
import ErrorSummary from '../components/ErrorSummary';
import { ErrorInfo, NextPageContextWithSession, ServiceDB, RawService } from '../interfaces';
import { enrichJourneyPatternsWithNaptanInfo } from '../utils/dataTransform';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { redirectTo } from './api/apiUtils';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import { isFareType, isJourney, isService } from '../interfaces/typeGuards';

const title = 'Return Direction - Create Fares Data Service';
const description = 'Return Direction selection page of the Create Fares Data Service';

export const inboundErrorId = 'inbound-journey';
export const outboundErrorId = 'outbound-journey';

interface ReturnDirectionProps {
    service: ServiceDB;
    errors: ErrorInfo[];
    outboundJourney?: string;
    inboundJourney?: string;
    csrfToken: string;
}

const ReturnDirection = ({
    service,
    errors,
    outboundJourney,
    inboundJourney,
    csrfToken,
}: ReturnDirectionProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/returnDirection" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <fieldset className="govuk-fieldset" aria-describedby="return-direction-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="return-direction-page-heading">
                                Select the outbound and inbound journeys for your service
                            </h1>
                        </legend>
                        <div className="govuk-!-margin-top-5">
                            <DirectionDropdown
                                selectName="outboundJourney"
                                selectNameID="outbound-journey"
                                dropdownLabel="Outbound Journey"
                                journeyPatterns={service.journeyPatterns}
                                outboundJourney={outboundJourney}
                                errors={errors}
                            />
                        </div>
                        <div className="govuk-!-margin-top-6">
                            <DirectionDropdown
                                selectName="inboundJourney"
                                selectNameID="inbound-journey"
                                dropdownLabel="Inbound Journey"
                                journeyPatterns={service.journeyPatterns}
                                inboundJourney={inboundJourney}
                                errors={errors}
                            />
                        </div>
                        <span className="govuk-hint hint-text" id="traveline-main-hint">
                            This data is taken from the Traveline National Dataset (TNDS) and should include all of your
                            registered routes for this service
                        </span>
                        <span className="govuk-hint hint-text" id="traveline-sub-hint">
                            If you have route variations within your fares triangle, you are only required to upload one
                            complete triangle that includes all of the potential stops
                        </span>
                    </fieldset>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: ReturnDirectionProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const serviceAttribute = getSessionAttribute(ctx.req, SERVICE_ATTRIBUTE);
    const fareTypeAttribute = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE);
    const journeyAttribute = getSessionAttribute(ctx.req, JOURNEY_ATTRIBUTE);

    const nocCode = getAndValidateNoc(ctx);

    if (!isService(serviceAttribute) || !fareTypeAttribute || !nocCode) {
        throw new Error('Necessary attributes not found to show direction page');
    }

    const lineName = serviceAttribute.service.split('#')[0];

    const rawService: RawService = await getServiceByNocCodeAndLineName(nocCode, lineName);
    const service: ServiceDB = {
        ...rawService,
        journeyPatterns: await enrichJourneyPatternsWithNaptanInfo(rawService.journeyPatterns),
    };

    if (!service) {
        throw new Error(`No service info could be retrieved for nocCode: ${nocCode} and lineName: ${lineName}`);
    }

    // Remove journeys with duplicate start and end points for display purposes
    service.journeyPatterns = service.journeyPatterns.filter(
        (pattern, index, self) =>
            self.findIndex(
                item => item.endPoint.Id === pattern.endPoint.Id && item.startPoint.Id === pattern.startPoint.Id,
            ) === index,
    );

    // Redirect to inputMethod page if there is only one journeyPattern (i.e. circular journey)
    if (
        service.journeyPatterns.length === 1 &&
        isFareType(fareTypeAttribute) &&
        fareTypeAttribute.fareType === 'return'
    ) {
        if (ctx.res) {
            const directionJourneyPattern = `${service.journeyPatterns[0].startPoint.Id}#${service.journeyPatterns[0].endPoint.Id}`;
            updateSessionAttribute(ctx.req, JOURNEY_ATTRIBUTE, {
                directionJourneyPattern,
            });
            redirectTo(ctx.res, '/inputMethod');
        }
    }

    if (journeyAttribute && isJourney(journeyAttribute)) {
        const { outboundJourney = '', inboundJourney = '', errors = [] } = journeyAttribute;

        return {
            props: {
                service,
                errors,
                outboundJourney,
                inboundJourney,
                csrfToken,
            },
        };
    }

    return {
        props: {
            service,
            errors: [],
            csrfToken,
        },
    };
};

export default ReturnDirection;
