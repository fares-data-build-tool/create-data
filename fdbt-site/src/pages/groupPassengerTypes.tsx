import React, { ReactElement } from 'react';
import InsetText from '../components/InsetText';
import { getSessionAttribute } from '../utils/sessions';
import TwoThirdsLayout from '../layout/Layout';
import { PASSENGER_TYPES_LIST, GROUP_PASSENGER_TYPES_ATTRIBUTE } from '../constants';
import { ErrorInfo, CustomAppProps, NextPageContextWithSession } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import { GroupPassengerTypesCollectionWithErrors, GroupPassengerTypesCollection } from './api/groupPassengerTypes';

const title = 'Define Group Passengers - Fares Data Build Tool';
const description = 'Group Passengers selection page of the Fares Data Build Tool';

export type PassengerAttributes = {
    passengerTypeDisplay: string;
    passengerTypeValue: string;
    greyedOut: boolean;
};

const isGroupPassengerWithErrors = (
    groupPassengerTypesAttribute: GroupPassengerTypesCollection | GroupPassengerTypesCollectionWithErrors,
): groupPassengerTypesAttribute is GroupPassengerTypesCollectionWithErrors =>
    (groupPassengerTypesAttribute as GroupPassengerTypesCollectionWithErrors).errors !== undefined;

interface PassengerTypeProps {
    groupPassengerInfo: GroupPassengerTypesCollection | GroupPassengerTypesCollectionWithErrors;
}

const insetText = 'More passenger types will become available soon';

const GroupPassengerTypes = ({ groupPassengerInfo, csrfToken }: PassengerTypeProps & CustomAppProps): ReactElement => {
    const errors: ErrorInfo[] = isGroupPassengerWithErrors(groupPassengerInfo) ? groupPassengerInfo.errors : [];
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/groupPassengerTypes" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="passenger-type-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="passenger-type-page-heading">
                                    Select a passenger type
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="passenger-type-hint">
                                Relate the ticket(s) to a passenger type
                            </span>
                            <FormElementWrapper
                                errors={errors}
                                errorId={errors[0] ? errors[0].id : ''}
                                errorClass="govuk-checkboxes--error"
                            >
                                <div className="govuk-checkboxes">
                                    {PASSENGER_TYPES_LIST.map(
                                        (passenger, index): ReactElement => (
                                            <div className="govuk-checkboxes__item" key={passenger.passengerTypeValue}>
                                                <input
                                                    className="govuk-checkboxes__input"
                                                    id={`passenger-type-${index}`}
                                                    name="passengerTypes"
                                                    type="checkbox"
                                                    value={passenger.passengerTypeValue}
                                                />
                                                <label
                                                    className="govuk-label govuk-checkboxes__label"
                                                    htmlFor={`passenger-type-${index}`}
                                                >
                                                    {`${passenger.passengerTypeDisplay}`}
                                                </label>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </FormElementWrapper>
                        </fieldset>
                    </div>
                    <InsetText text={insetText} />
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: PassengerTypeProps } => {
    const groupPassengerTypesAttribute = getSessionAttribute(ctx.req, GROUP_PASSENGER_TYPES_ATTRIBUTE);

    const defaultGroupPassengerInfo: GroupPassengerTypesCollection = {
        passengerTypes: [],
    };

    return {
        props: {
            groupPassengerInfo: groupPassengerTypesAttribute || defaultGroupPassengerInfo,
        },
    };
};

export default GroupPassengerTypes;
