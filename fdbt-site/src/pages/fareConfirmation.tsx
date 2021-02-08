import React, { ReactElement } from 'react';
import {
    FARE_TYPE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    FULL_TIME_RESTRICTIONS_ATTRIBUTE,
    SCHOOL_FARE_TYPE_ATTRIBUTE,
    TERM_TIME_ATTRIBUTE,
    GROUP_PASSENGER_INFO_ATTRIBUTE,
} from '../constants';
import {
    NextPageContextWithSession,
    FullTimeRestriction,
    TermTimeAttribute,
    FullTimeRestrictionAttribute,
    CompanionInfo,
} from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import ConfirmationTable, { ConfirmationElement } from '../components/ConfirmationTable';
import { getSessionAttribute } from '../utils/sessions';
import { isPassengerTypeAttributeWithErrors, isFareType } from '../interfaces/typeGuards';
import { PassengerType } from './api/passengerType';
import { getCsrfToken, sentenceCaseString } from '../utils';
import { SchoolFareTypeAttribute } from './api/schoolFareType';

const title = 'Fare Confirmation - Create Fares Data Service';
const description = 'Fare Confirmation page of the Create Fares Data Service';

type FareConfirmationProps = {
    fareType: string;
    passengerType: PassengerType;
    groupPassengerInfo: CompanionInfo[];
    schoolFareType: string;
    termTime: string;
    fullTimeRestrictions: FullTimeRestriction[];
    csrfToken: string;
};

export const buildFareConfirmationElements = (
    fareType: string,
    passengerType: PassengerType,
    groupPassengerInfo: CompanionInfo[],
    schoolFareType: string,
    termTime: string,
    fullTimeRestrictions: FullTimeRestriction[],
): ConfirmationElement[] => {
    const confirmationElements: ConfirmationElement[] = [
        {
            name: 'Fare type',
            content: sentenceCaseString(fareType),
            href: 'fareType',
        },
        {
            name: 'Passenger type',
            content: sentenceCaseString(passengerType.passengerType),
            href: fareType === 'schoolService' ? '' : 'passengerType',
        },
    ];

    if (passengerType.passengerType === 'group' && groupPassengerInfo.length > 0) {
        groupPassengerInfo.forEach(passenger => {
            if (passenger.ageRangeMin || passenger.ageRangeMax) {
                confirmationElements.push({
                    name: `${sentenceCaseString(passenger.passengerType)} passenger - age range`,
                    content: `Minimum age: ${passenger.ageRangeMin ? passenger.ageRangeMin : 'N/A'} Maximum age: ${
                        passenger.ageRangeMax ? passenger.ageRangeMax : 'N/A'
                    }`,
                    href: 'definePassengerType',
                });
            } else {
                confirmationElements.push({
                    name: `${sentenceCaseString(passenger.passengerType)} passenger - age range`,
                    content: 'N/A',
                    href: 'definePassengerType',
                });
            }
            if (passenger.proofDocuments && passenger.proofDocuments.length > 0) {
                confirmationElements.push({
                    name: `${sentenceCaseString(passenger.passengerType)} passenger - proof documents`,
                    content: passenger.proofDocuments.map(proofDoc => sentenceCaseString(proofDoc)).join(', '),
                    href: 'definePassengerType',
                });
            } else {
                confirmationElements.push({
                    name: `${sentenceCaseString(passenger.passengerType)} passenger - proof documents`,
                    content: 'N/A',
                    href: 'definePassengerType',
                });
            }
        });
    } else {
        if (passengerType.ageRange && (passengerType.ageRangeMin || passengerType.ageRangeMax)) {
            confirmationElements.push({
                name: 'Passenger information - age range',
                content: `Minimum age: ${passengerType.ageRangeMin ? passengerType.ageRangeMin : 'N/A'} Maximum age: ${
                    passengerType.ageRangeMax ? passengerType.ageRangeMax : 'N/A'
                }`,
                href: 'definePassengerType',
            });
        } else {
            confirmationElements.push({
                name: 'Passenger information - age range',
                content: 'N/A',
                href: 'definePassengerType',
            });
        }

        if (passengerType.proof && passengerType.proofDocuments) {
            confirmationElements.push({
                name: 'Passenger information - proof documents',
                content: passengerType.proofDocuments.map(proofDoc => sentenceCaseString(proofDoc)).join(', '),
                href: 'definePassengerType',
            });
        } else {
            confirmationElements.push({
                name: 'Passenger information - proof documents',
                content: 'N/A',
                href: 'definePassengerType',
            });
        }
    }

    if (fareType === 'schoolService') {
        if (termTime !== '') {
            confirmationElements.push({
                name: 'Only valid during term times',
                content: termTime === 'true' ? 'yes' : 'no',
                href: 'termTime',
            });
        }

        if (schoolFareType !== '') {
            confirmationElements.push({
                name: 'School ticket fare type',
                content: sentenceCaseString(schoolFareType),
                href: 'schoolFareType',
            });
        }
    }

    if (fullTimeRestrictions.length > 0) {
        fullTimeRestrictions.forEach(fullTimeRestriction => {
            confirmationElements.push({
                name: `Time restrictions - ${sentenceCaseString(fullTimeRestriction.day)}`,
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
    groupPassengerInfo,
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
                        groupPassengerInfo,
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

    const groupPassengerInfo = getSessionAttribute(ctx.req, GROUP_PASSENGER_INFO_ATTRIBUTE) || [];

    return {
        props: {
            fareType: fareTypeAttribute.fareType,
            passengerType: passengerTypeAttribute,
            schoolFareType: schoolFareTypeAttribute?.schoolFareType || '',
            groupPassengerInfo,
            termTime: termTimeAttribute?.termTime.toString() || '',
            fullTimeRestrictions: fullTimeRestrictionsAttribute?.fullTimeRestrictions || [],
            csrfToken,
        },
    };
};

export default FareConfirmation;
