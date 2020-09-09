import React, { ReactElement } from 'react';
import startCase from 'lodash/startCase';
import { FARE_TYPE_ATTRIBUTE, PASSENGER_TYPE_ATTRIBUTE, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE } from '../constants';
import { CustomAppProps, NextPageContextWithSession } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import ConfirmationTable from '../components/ConfirmationTable';
import { getSessionAttribute } from '../utils/sessions';
import { isPassengerTypeAttributeWithErrors, isFareTypeAttributeWithErrors } from '../interfaces/typeGuards';
import { isTimeRestrictionsDefinitionWithErrors } from './defineTimeRestrictions';

const title = 'Confirmation - Fares Data Build Tool';
const description = 'Confirmation page of the Fares Data Build Tool';

type ConfirmationProps = {
    fareType: string;
    passengerType: string;
    timeRestrictions: string;
};

const Confirmation = ({
    csrfToken,
    fareType,
    passengerType,
    timeRestrictions,
}: ConfirmationProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={[]}>
        <CsrfForm action="/api/confirmation" method="post" csrfToken={csrfToken}>
            <>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-one-thirds">
                        <h1 className="govuk-heading-l">Check your answers before sending your fares information</h1>
                        <ConfirmationTable
                            confirmationElements={[
                                {
                                    header: 'Fare Information',
                                    innerElements: [
                                        { name: 'Faretype', content: startCase(fareType), href: '/fareType' },
                                        {
                                            name: 'Passenger Type',
                                            content: startCase(passengerType),
                                            href: '/passengerType',
                                        },
                                        {
                                            name: 'Time Restrictions',
                                            content: timeRestrictions,
                                            href: '/timeRestrictions',
                                        },
                                    ],
                                },
                            ]}
                        />
                        <h2 className="govuk-heading-m">Now send your fares information</h2>

                        <p className="govuk-body">
                            By submitting this notification you are confirming that, to the best of your knowledge, the
                            details you are providing are correct.
                        </p>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </div>
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: ConfirmationProps } => {
    const fareTypeInfo = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE);
    const passengerTypeInfo = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);
    const timeRestrictionsInfo = getSessionAttribute(ctx.req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE);

    if (
        !passengerTypeInfo ||
        isPassengerTypeAttributeWithErrors(passengerTypeInfo) ||
        !fareTypeInfo ||
        isFareTypeAttributeWithErrors(fareTypeInfo) ||
        (timeRestrictionsInfo && isTimeRestrictionsDefinitionWithErrors(timeRestrictionsInfo))
    ) {
        throw new Error('User has reached confirmation page with incorrect passenger type info.');
    }

    return {
        props: {
            fareType: fareTypeInfo.fareType,
            passengerType: passengerTypeInfo.passengerType,
            timeRestrictions: timeRestrictionsInfo ? 'Yes' : 'No',
        },
    };
};

export default Confirmation;
