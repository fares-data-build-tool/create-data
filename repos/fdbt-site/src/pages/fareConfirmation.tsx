import React, { ReactElement } from 'react';
import {
    FARE_TYPE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    FULL_TIME_RESTRICTIONS_ATTRIBUTE,
    SCHOOL_FARE_TYPE_ATTRIBUTE,
    TERM_TIME_ATTRIBUTE,
    GROUP_PASSENGER_INFO_ATTRIBUTE,
    CARNET_FARE_TYPE_ATTRIBUTE,
} from '../constants/attributes';
import {
    NextPageContextWithSession,
    FullTimeRestriction,
    TermTimeAttribute,
    FullTimeRestrictionAttribute,
    ConfirmationElement,
    PassengerType,
    SchoolFareTypeAttribute,
    CompanionInfo,
} from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import ConfirmationTable from '../components/ConfirmationTable';
import { getSessionAttribute } from '../utils/sessions';
import { isPassengerTypeAttributeWithErrors, isFareType } from '../interfaces/typeGuards';
import { getCsrfToken, sentenceCaseString } from '../utils';

const title = 'Fare Confirmation - Create Fares Data Service';
const description = 'Fare Confirmation page of the Create Fares Data Service';

interface FareConfirmationProps {
    fareType: string;
    carnet: boolean;
    passengerType: PassengerType;
    groupPassengerInfo: CompanionInfo[];
    schoolFareType: string;
    termTime: string;
    fullTimeRestrictions: FullTimeRestriction[];
    newTimeRestrictionCreated: string;
    csrfToken: string;
}

export const buildFareConfirmationElements = (
    fareType: string,
    carnet: boolean,
    passengerType: PassengerType,
    groupPassengerInfo: CompanionInfo[],
    schoolFareType: string,
    termTime: string,
    fullTimeRestrictions: FullTimeRestriction[],
    newTimeRestrictionCreated: string,
): ConfirmationElement[] => {
    const confirmationElements: ConfirmationElement[] = [
        {
            name: 'Fare type',
            content: carnet ? 'Carnet' : sentenceCaseString(fareType),
            href: 'fareType',
        },
        {
            name: 'Passenger type',
            content: sentenceCaseString(passengerType.passengerType),
            href: fareType === 'schoolService' ? '' : 'passengerType',
        },
    ];

    if (carnet) {
        confirmationElements.splice(1, 0, {
            name: 'Carnet type',
            content: sentenceCaseString(fareType),
            href: 'carnetFareType',
        });
    }

    if (passengerType.passengerType === 'group' && groupPassengerInfo.length > 0) {
        groupPassengerInfo.forEach(passenger => {
            const href = `definePassengerType?groupPassengerType=${passenger.passengerType}`;
            if (passenger.ageRangeMin || passenger.ageRangeMax) {
                confirmationElements.push({
                    name: `${sentenceCaseString(passenger.passengerType)} passenger - age range`,
                    content: `Minimum age: ${passenger.ageRangeMin ? passenger.ageRangeMin : 'N/A'} Maximum age: ${
                        passenger.ageRangeMax ? passenger.ageRangeMax : 'N/A'
                    }`,
                    href,
                });
            } else {
                confirmationElements.push({
                    name: `${sentenceCaseString(passenger.passengerType)} passenger - age range`,
                    content: 'N/A',
                    href,
                });
            }
            if (passenger.proofDocuments && passenger.proofDocuments.length > 0) {
                confirmationElements.push({
                    name: `${sentenceCaseString(passenger.passengerType)} passenger - proof documents`,
                    content: passenger.proofDocuments.map(proofDoc => sentenceCaseString(proofDoc)).join(', '),
                    href,
                });
            } else {
                confirmationElements.push({
                    name: `${sentenceCaseString(passenger.passengerType)} passenger - proof documents`,
                    content: 'N/A',
                    href,
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
                href: `${passengerType.passengerType === 'anyone' ? '' : 'definePassengerType'}`,
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
                href: `${passengerType.passengerType === 'anyone' ? '' : 'definePassengerType'}`,
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
            fullTimeRestriction.timeBands.forEach(timeBand => {
                confirmationElements.push({
                    name: `Time restrictions - ${sentenceCaseString(fullTimeRestriction.day)}`,
                    content: `Start time: ${timeBand.startTime || 'N/A'} End time: ${timeBand.endTime || 'N/A'}`,
                    href: 'defineTimeRestrictions',
                });
            });
            if (!fullTimeRestriction.timeBands || fullTimeRestriction.timeBands.length === 0) {
                confirmationElements.push({
                    name: `Time restrictions - ${sentenceCaseString(fullTimeRestriction.day)}`,
                    content: 'N/A',
                    href: 'defineTimeRestrictions',
                });
            }
        });
    }

    if (newTimeRestrictionCreated) {
        confirmationElements.push({
            name: 'Time restriction saved for reuse',
            content: `Name: ${newTimeRestrictionCreated}`,
            href: '',
        });
    }
    return confirmationElements;
};

const FareConfirmation = ({
    fareType,
    carnet,
    passengerType,
    groupPassengerInfo,
    schoolFareType,
    termTime,
    fullTimeRestrictions,
    newTimeRestrictionCreated,
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
                        carnet,
                        passengerType,
                        groupPassengerInfo,
                        schoolFareType,
                        termTime,
                        fullTimeRestrictions,
                        newTimeRestrictionCreated,
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
    const carnetAttribute = getSessionAttribute(ctx.req, CARNET_FARE_TYPE_ATTRIBUTE);
    const carnet = !!carnetAttribute;
    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);
    const schoolFareTypeAttribute = getSessionAttribute(ctx.req, SCHOOL_FARE_TYPE_ATTRIBUTE) as SchoolFareTypeAttribute;
    const termTimeAttribute = getSessionAttribute(ctx.req, TERM_TIME_ATTRIBUTE) as TermTimeAttribute;
    const fullTimeRestrictionsAttribute = getSessionAttribute(
        ctx.req,
        FULL_TIME_RESTRICTIONS_ATTRIBUTE,
    ) as FullTimeRestrictionAttribute;
    const newTimeRestrictionCreated = (ctx.query?.createdTimeRestriction as string) || '';
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
            carnet,
            passengerType: passengerTypeAttribute,
            schoolFareType: schoolFareTypeAttribute?.schoolFareType || '',
            groupPassengerInfo,
            termTime: termTimeAttribute?.termTime.toString() || '',
            fullTimeRestrictions: fullTimeRestrictionsAttribute?.fullTimeRestrictions || [],
            newTimeRestrictionCreated,
            csrfToken,
        },
    };
};

export default FareConfirmation;
