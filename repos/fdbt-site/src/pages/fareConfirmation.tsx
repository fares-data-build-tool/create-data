import React, { ReactElement } from 'react';
import upperFirst from 'lodash/upperFirst';
import { FARE_TYPE_ATTRIBUTE, PASSENGER_TYPE_ATTRIBUTE, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE } from '../constants';
import { CustomAppProps, NextPageContextWithSession, TimeRestriction } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import ConfirmationTable, { ConfirmationElement } from '../components/ConfirmationTable';
import { getSessionAttribute } from '../utils/sessions';
import { isPassengerTypeAttributeWithErrors, isFareTypeAttributeWithErrors } from '../interfaces/typeGuards';
import { PassengerType } from './api/passengerType';

const title = 'Fare Confirmation - Fares Data Build Tool';
const description = 'Fare Confirmation page of the Fares Data Build Tool';

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
            content: upperFirst(fareType),
            href: 'fareType',
        },
        {
            name: 'Passenger Type',
            content: upperFirst(passengerType.passengerType),
            href: 'passengerType',
        },
    ];
    if (passengerType.ageRange && (passengerType.ageRangeMin || passengerType.ageRangeMax)) {
        confirmationElements.push({
            name: 'Passenger Information - Age Range',
            content: `Minimum Age: ${passengerType.ageRangeMin ? passengerType.ageRangeMin : '-'} Maximum Age: ${
                passengerType.ageRangeMax ? passengerType.ageRangeMax : '-'
            }`,
            href: 'definePassengerType',
        });
    } else {
        confirmationElements.push({
            name: 'Passenger Information - Age Range',
            content: '-',
            href: 'definePassengerType',
        });
    }
    if (passengerType.proof && passengerType.proofDocuments) {
        confirmationElements.push({
            name: 'Passenger Information - Proof Documents',
            content: passengerType.proofDocuments.map(proofDoc => upperFirst(proofDoc)).join(', '),
            href: 'definePassengerType',
        });
    } else {
        confirmationElements.push({
            name: 'Passenger Information - Proof Documents',
            content: '-',
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
            content: '-',
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
            content: '-',
            href: 'defineTimeRestrictions',
        });
    }

    if (timeRestrictions.validDays) {
        confirmationElements.push({
            name: 'Time Restrictions - Valid Days',
            content: timeRestrictions.validDays.map(stop => upperFirst(stop)).join(', '),
            href: 'defineTimeRestrictions',
        });
    } else {
        confirmationElements.push({
            name: 'Time Restrictions - Valid Days',
            content: '-',
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
