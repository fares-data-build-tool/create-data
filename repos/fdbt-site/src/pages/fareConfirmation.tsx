import React, { ReactElement } from 'react';
import startCase from 'lodash/startCase';
import { FARE_TYPE_ATTRIBUTE, PASSENGER_TYPE_ATTRIBUTE, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE } from '../constants';
import { CustomAppProps, NextPageContextWithSession, TimeRestriction } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import ConfirmationTable, { ConfirmationElement } from '../components/ConfirmationTable';
import { getSessionAttribute } from '../utils/sessions';
import { isPassengerTypeAttributeWithErrors, isFareTypeAttributeWithErrors } from '../interfaces/typeGuards';
import { PassengerType } from './api/passengerType';

const title = 'Fare Confirmation - Create Fares Data Service';
const description = 'Fare Confirmation page of the Create Fares Data Service';

type FareConfirmationProps = {
    fareType: string;
    passengerType: PassengerType;
    timeRestrictions: TimeRestriction;
};

export const buildFareConfirmationElements = (
    fareType: string,
    passengerType: PassengerType,
    timeRestrictions: TimeRestriction,
): ConfirmationElement[] => {
    const confirmationElements: ConfirmationElement[] = [
        {
            name: 'Fare Type',
            content: startCase(fareType),
            href: 'fareType',
        },
        {
            name: 'Passenger Type',
            content: startCase(passengerType.passengerType),
            href: 'passengerType',
        },
    ];
    if (passengerType.ageRange && (passengerType.ageRangeMin || passengerType.ageRangeMax)) {
        confirmationElements.push({
            name: 'Passenger Information - Age Range',
            content: `Minimum Age: ${
                passengerType.ageRangeMin ? passengerType.ageRangeMin : 'No details entered'
            } Maximum Age: ${passengerType.ageRangeMax ? passengerType.ageRangeMax : 'No details entered'}`,
            href: 'definePassengerType',
        });
    } else {
        confirmationElements.push({
            name: 'Passenger Information - Age Range',
            content: 'No details entered',
            href: 'definePassengerType',
        });
    }
    if (passengerType.proof && passengerType.proofDocuments) {
        confirmationElements.push({
            name: 'Passenger Information - Proof Documents',
            content: passengerType.proofDocuments.map(proofDoc => startCase(proofDoc)).join(', '),
            href: 'definePassengerType',
        });
    } else {
        confirmationElements.push({
            name: 'Passenger Information - Proof Documents',
            content: 'No details entered',
            href: 'definePassengerType',
        });
    }

    if (timeRestrictions.startTime) {
        confirmationElements.push({
            name: 'Time Restrictions - Start Time',
            content: timeRestrictions.startTime,
            href: 'defineTimeRestrictions',
        });
    } else {
        confirmationElements.push({
            name: 'Time Restrictions - Start Time',
            content: 'No details entered',
            href: 'defineTimeRestrictions',
        });
    }

    if (timeRestrictions.endTime) {
        confirmationElements.push({
            name: 'Time Restrictions - End Time',
            content: timeRestrictions.endTime,
            href: 'defineTimeRestrictions',
        });
    } else {
        confirmationElements.push({
            name: 'Time Restrictions - End Time',
            content: 'No details entered',
            href: 'defineTimeRestrictions',
        });
    }

    if (timeRestrictions.validDays) {
        confirmationElements.push({
            name: 'Time Restrictions - Valid Days',
            content: timeRestrictions.validDays.map(stop => startCase(stop)).join(', '),
            href: 'defineTimeRestrictions',
        });
    } else {
        confirmationElements.push({
            name: 'Time Restrictions - Valid Days',
            content: 'No details entered',
            href: 'defineTimeRestrictions',
        });
    }

    return confirmationElements;
};

const FareConfirmation = ({
    csrfToken,
    fareType,
    passengerType,
    timeRestrictions,
}: FareConfirmationProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={[]}>
        <CsrfForm action="/api/fareConfirmation" method="post" csrfToken={csrfToken}>
            <>
                <h1 className="govuk-heading-l">Check your answers before sending your fares information</h1>
                <ConfirmationTable
                    header="Fare Information"
                    confirmationElements={buildFareConfirmationElements(fareType, passengerType, timeRestrictions)}
                />
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: FareConfirmationProps } => {
    const fareTypeInfo = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE);
    const passengerTypeInfo = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);
    const timeRestrictionsInfo = getSessionAttribute(ctx.req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE);

    if (
        !passengerTypeInfo ||
        isPassengerTypeAttributeWithErrors(passengerTypeInfo) ||
        !fareTypeInfo ||
        isFareTypeAttributeWithErrors(fareTypeInfo)
    ) {
        throw new Error('User has reached fare confirmation page with incorrect passenger type info.');
    }

    return {
        props: {
            fareType: fareTypeInfo.fareType,
            passengerType: passengerTypeInfo,
            timeRestrictions: timeRestrictionsInfo || {},
        },
    };
};

export default FareConfirmation;
