import React, { ReactElement } from 'react';
import startCase from 'lodash/startCase';
import {
    FARE_TYPE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    FULL_TIME_RESTRICTIONS_ATTRIBUTE,
    SCHOOL_FARE_TYPE_ATTRIBUTE,
    TERM_TIME_ATTRIBUTE,
} from '../constants';
import {
    NextPageContextWithSession,
    FullTimeRestriction,
    TermTimeAttribute,
    FullTimeRestrictionAttribute,
} from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import ConfirmationTable, { ConfirmationElement } from '../components/ConfirmationTable';
import { getSessionAttribute } from '../utils/sessions';
import { isPassengerTypeAttributeWithErrors, isFareType } from '../interfaces/typeGuards';
import { PassengerType } from './api/passengerType';
import { getCsrfToken } from '../utils';
import { SchoolFareTypeAttribute } from './api/schoolFareType';

const title = 'Fare Confirmation - Create Fares Data Service';
const description = 'Fare Confirmation page of the Create Fares Data Service';

type FareConfirmationProps = {
    fareType: string;
    passengerType: PassengerType;
    schoolFareType: string;
    termTime: string;
    fullTimeRestrictions: FullTimeRestriction[];
    csrfToken: string;
};

export const buildFareConfirmationElements = (
    fareType: string,
    passengerType: PassengerType,
    schoolFareType: string,
    termTime: string,
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
            href: fareType === 'schoolService' ? '' : 'passengerType',
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

    if (fareType === 'schoolService') {
        if (termTime !== '') {
            confirmationElements.push({
                name: 'Only Valid During Term Times',
                content: termTime === 'true' ? 'Yes' : 'No',
                href: 'termTime',
            });
        }

        if (schoolFareType !== '') {
            confirmationElements.push({
                name: 'School Ticket Fare Type',
                content: startCase(schoolFareType),
                href: 'schoolFareType',
            });
        }
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
    fareType,
    passengerType,
    schoolFareType,
    termTime,
    fullTimeRestrictions,
    csrfToken,
}: FareConfirmationProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={[]}>
        <CsrfForm action="/api/fareConfirmation" method="post" csrfToken={csrfToken}>
            <>
                <h1 className="govuk-heading-l">Check your answers before sending your fares information</h1>
                <ConfirmationTable
                    header="Fare Information"
                    confirmationElements={buildFareConfirmationElements(
                        fareType,
                        passengerType,
                        schoolFareType,
                        termTime,
                        fullTimeRestrictions,
                    )}
                />
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: FareConfirmationProps } => {
    const csrfToken = getCsrfToken(ctx);
    const fareTypeAttribute = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);
    const schoolFareTypeAttribute = getSessionAttribute(ctx.req, SCHOOL_FARE_TYPE_ATTRIBUTE) as SchoolFareTypeAttribute;
    const termTimeAttribute = getSessionAttribute(ctx.req, TERM_TIME_ATTRIBUTE) as TermTimeAttribute;
    const fullTimeRestrictionsAttribute = getSessionAttribute(
        ctx.req,
        FULL_TIME_RESTRICTIONS_ATTRIBUTE,
    ) as FullTimeRestrictionAttribute;

    if (
        !passengerTypeAttribute ||
        isPassengerTypeAttributeWithErrors(passengerTypeAttribute) ||
        !isFareType(fareTypeAttribute) ||
        (fareTypeAttribute.fareType === 'schoolService' && !schoolFareTypeAttribute)
    ) {
        throw new Error('Could not extract the correct attributes for the user journey.');
    }

    return {
        props: {
            fareType: fareTypeAttribute.fareType,
            passengerType: passengerTypeAttribute,
            schoolFareType: schoolFareTypeAttribute?.schoolFareType || '',
            termTime: termTimeAttribute?.termTime.toString() || '',
            fullTimeRestrictions: fullTimeRestrictionsAttribute?.fullTimeRestrictions || [],
            csrfToken,
        },
    };
};

export default FareConfirmation;
