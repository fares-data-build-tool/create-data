import React, { ReactElement } from 'react';
import startCase from 'lodash/startCase';
import { FARE_TYPE_ATTRIBUTE, PASSENGER_TYPE_ATTRIBUTE, FULL_TIME_RESTRICTIONS_ATTRIBUTE } from '../constants';
import { NextPageContextWithSession, FullTimeRestriction } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import ConfirmationTable, { ConfirmationElement } from '../components/ConfirmationTable';
import { getSessionAttribute } from '../utils/sessions';
import { isPassengerTypeAttributeWithErrors, isFareTypeAttributeWithErrors } from '../interfaces/typeGuards';
import { PassengerType } from './api/passengerType';
import { getCsrfToken } from '../utils';

const title = 'Fare Confirmation - Create Fares Data Service';
const description = 'Fare Confirmation page of the Create Fares Data Service';

type FareConfirmationProps = {
    fareType: string;
    passengerType: PassengerType;
    fullTimeRestrictions: FullTimeRestriction[];
    csrfToken: string;
};

export const buildFareConfirmationElements = (
    fareType: string,
    passengerType: PassengerType,
    fullTimeRestrictions: FullTimeRestriction[],
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

    if (fullTimeRestrictions.length > 0) {
        fullTimeRestrictions.forEach(fullTimeRestriction => {
            confirmationElements.push({
                name: `Time Restrictions - ${startCase(fullTimeRestriction.day)}`,
                content: `Start time: ${fullTimeRestriction.startTime ||
                    'N/A'} End time: ${fullTimeRestriction.endTime || 'N/A'}`,
                href: 'defineTimeRestrictions',
            });
        });
    }
    return confirmationElements;
};

const FareConfirmation = ({
    csrfToken,
    fareType,
    passengerType,
    fullTimeRestrictions,
}: FareConfirmationProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={[]}>
        <CsrfForm action="/api/fareConfirmation" method="post" csrfToken={csrfToken}>
            <>
                <h1 className="govuk-heading-l">Check your answers before sending your fares information</h1>
                <ConfirmationTable
                    header="Fare Information"
                    confirmationElements={buildFareConfirmationElements(fareType, passengerType, fullTimeRestrictions)}
                />
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: FareConfirmationProps } => {
    const csrfToken = getCsrfToken(ctx);
    const fareTypeInfo = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE);
    const passengerTypeInfo = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);
    const fullTimeRestrictionsAttribute = getSessionAttribute(ctx.req, FULL_TIME_RESTRICTIONS_ATTRIBUTE);

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
            fullTimeRestrictions: fullTimeRestrictionsAttribute?.fullTimeRestrictions || [],
            csrfToken,
        },
    };
};

export default FareConfirmation;
