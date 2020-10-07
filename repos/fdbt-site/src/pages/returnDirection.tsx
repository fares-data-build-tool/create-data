import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import { FARE_TYPE_ATTRIBUTE, JOURNEY_ATTRIBUTE, SERVICE_ATTRIBUTE } from '../constants';
import { getServiceByNocCodeAndLineName, RawService, Service } from '../data/auroradb';
import DirectionDropdown from '../components/DirectionDropdown';
import ErrorSummary from '../components/ErrorSummary';
import { CustomAppProps, ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { enrichJourneyPatternsWithNaptanInfo } from '../utils/dataTransform';
import { getAndValidateNoc } from '../utils';
import { redirectTo } from './api/apiUtils';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import { isFareType, isJourney, isService } from '../interfaces/typeGuards';

const title = 'Return Direction - Fares Data Build Tool';
const description = 'Return Direction selection page of the Fares Data Build Tool';

export const inboundErrorId = 'inbound-journey';
export const outboundErrorId = 'outbound-journey';

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

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{}> => {
    const serviceAttribute = getSessionAttribute(ctx.req, SERVICE_ATTRIBUTE);
    const fareTypeAttribute = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE);
    const journeyAttribute = getSessionAttribute(ctx.req, JOURNEY_ATTRIBUTE);

    const nocCode = getAndValidateNoc(ctx);

    if (!isService(serviceAttribute) || !fareTypeAttribute || !nocCode) {
        throw new Error('Necessary cookies not found to show direction page');
    }

    const lineName = serviceAttribute.service.split('#')[0];

    const rawService: RawService = await getServiceByNocCodeAndLineName(nocCode, lineName);
    const service: Service = {
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
            const journeyPatternCookie = `${service.journeyPatterns[0].startPoint.Id}#${service.journeyPatterns[0].endPoint.Id}`;
            updateSessionAttribute(ctx.req, JOURNEY_ATTRIBUTE, {
                directionJourneyPattern: journeyPatternCookie,
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
            },
        };
    }

    return {
        props: {
            service,
            errors: [],
        },
    };
};

export default ReturnDirection;
