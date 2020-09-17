import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import upperFirst from 'lodash/upperFirst';
import TwoThirdsLayout from '../layout/Layout';
import { OPERATOR_COOKIE, SERVICE_ATTRIBUTE, JOURNEY_ATTRIBUTE, PASSENGER_TYPE_ATTRIBUTE } from '../constants';
import { getServiceByNocCodeAndLineName, Service, RawService } from '../data/auroradb';
import DirectionDropdown from '../components/DirectionDropdown';
import { enrichJourneyPatternsWithNaptanInfo } from '../utils/dataTransform';
import { ErrorInfo, CustomAppProps, NextPageContextWithSession } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import { getAndValidateNoc } from '../utils';
import CsrfForm from '../components/CsrfForm';
import { isJourney, isPassengerType, isService } from '../interfaces/typeGuards';
import { getSessionAttribute } from '../utils/sessions';

const title = 'Single Direction - Fares Data Build Tool';
const description = 'Single Direction selection page of the Fares Data Build Tool';

interface DirectionProps {
    operator: string;
    passengerType: string;
    lineName: string;
    service: Service;
    error: ErrorInfo[];
}

const SingleDirection = ({
    operator,
    passengerType,
    lineName,
    service,
    error,
    csrfToken,
}: DirectionProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={error}>
        <CsrfForm action="/api/singleDirection" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={error} />
                <div className={`govuk-form-group ${error.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <h1 className="govuk-heading-l" id="single-direction-page-heading">
                        Select a journey direction
                    </h1>

                    <span className="govuk-hint" id="direction-operator-linename-passenger-type-hint">
                        {operator} - {lineName} - {upperFirst(passengerType)}
                    </span>
                    <span className="govuk-hint" id="direction-journey-description-hint">
                        {`Journey: ${service.serviceDescription}`}
                    </span>
                    <DirectionDropdown
                        selectName="directionJourneyPattern"
                        selectNameID="direction-journey-pattern"
                        journeyPatterns={service.journeyPatterns}
                        dropdownLabel="Journey direction"
                        hideLabel
                        errors={error}
                    />
                    <span className="govuk-hint hint-text" id="traveline-hint">
                        This data is taken from the Traveline National Dataset
                    </span>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: DirectionProps }> => {
    const cookies = parseCookies(ctx);

    const journeyAttribute = getSessionAttribute(ctx.req, JOURNEY_ATTRIBUTE);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const nocCode = getAndValidateNoc(ctx);

    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);
    const serviceAttribute = getSessionAttribute(ctx.req, SERVICE_ATTRIBUTE);

    if (!operatorCookie || !isService(serviceAttribute) || !isPassengerType(passengerTypeAttribute) || !nocCode) {
        throw new Error('Necessary cookies not found to show direction page');
    }

    const { operator } = JSON.parse(operatorCookie);

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

    return {
        props: {
            operator: operator.operatorPublicName,
            passengerType: passengerTypeAttribute.passengerType,
            lineName,
            service,
            error: (isJourney(journeyAttribute) && journeyAttribute.errors) || [],
        },
    };
};

export default SingleDirection;
