import React, { ReactElement } from 'react';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { GS_PASSENGER_GROUP_ATTRIBUTE } from '../constants/attributes';
import { getGroupPassengerTypeById, getPassengerTypesByNocCode } from '../data/auroradb';
import upperFirst from 'lodash/upperFirst';
import { ErrorInfo, GroupPassengerTypeDb, NextPageContextWithSession, SinglePassengerType } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { getSessionAttribute } from '../utils/sessions';

const title = 'Manage Passenger Group - Create Fares Data Service';
const description = 'Manage Passenger Group page of the Create Fares Data Service';

interface ManagePassengerGroupProps {
    passengers: SinglePassengerType[];
    csrfToken: string;
    errors: ErrorInfo[];
    inputs?: GroupPassengerTypeDb;
    editMode: boolean;
}

const hasError = (errors: ErrorInfo[], name: string) => {
    if (errors.filter((e) => e.id === name).length > 0) {
        return ' govuk-form-group--error';
    }
    return '';
};

const findCorrectPassengerType = (inputs: GroupPassengerTypeDb, passenger: SinglePassengerType) => {
    return inputs.groupPassengerType.companions.find((companion) => companion.id === passenger.id);
};

const ManagePassengerGroup = ({
    passengers,
    csrfToken,
    errors = [],
    inputs,
    editMode,
}: ManagePassengerGroupProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/managePassengerGroup" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <h1 className="govuk-heading-xl" id="group-page-heading">
                        Provide passenger group details
                    </h1>
                    <div className={`govuk-form-group${hasError(errors, 'max-group-size')}`} id="max-group-size-header">
                        <label htmlFor="max-group-size">
                            <h1 className="govuk-heading-m" id="group-size-heading">
                                How many passengers can use this ticket at one time?
                            </h1>
                        </label>

                        <p className="govuk-hint" id="group-size-example">
                            We need to know the maximum size of the group of passengers that can use this ticket at one
                            time. Example: Up to 5 passengers at a time would require an input of 5
                        </p>
                        <FormElementWrapper errors={errors} errorId="max-group-size" errorClass="govuk-input--error">
                            <input
                                className="govuk-input govuk-input--width-2"
                                id="max-group-size"
                                name="maxGroupSize"
                                type="text"
                                defaultValue={inputs?.groupPassengerType.maxGroupSize || ''}
                            />
                        </FormElementWrapper>
                    </div>

                    <div className={`govuk-form-group${hasError(errors, 'passenger-type-0')}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="passenger-type-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                                <h1 className="govuk-fieldset__heading" id="passenger-type-page-heading">
                                    Which type of passengers can use this ticket?
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="passenger-type-hint">
                                Select the passenger types included in your group ticket.
                            </span>
                            <FormElementWrapper
                                errors={errors}
                                errorId="passenger-type-0"
                                errorClass="govuk-checkboxes--error"
                            >
                                <div className="govuk-checkboxes" data-module="govuk-checkboxes">
                                    {passengers.map(
                                        (passenger, index): ReactElement => (
                                            <>
                                                <div className="govuk-checkboxes__item" key={passenger.id}>
                                                    <input
                                                        className="govuk-checkboxes__input"
                                                        id={`passenger-type-${index}`}
                                                        name="passengerTypes"
                                                        type="checkbox"
                                                        value={passenger.id}
                                                        data-aria-controls={`conditional-input-${index}`}
                                                        defaultChecked={
                                                            inputs?.groupPassengerType
                                                                ? !!findCorrectPassengerType(
                                                                      inputs,
                                                                      passenger,
                                                                  )
                                                                : false
                                                        }
                                                    />
                                                    <label
                                                        className="govuk-label govuk-checkboxes__label"
                                                        htmlFor={`passenger-type-${index}`}
                                                    >
                                                        {upperFirst(`${passenger.name}`)}
                                                    </label>
                                                </div>
                                                <div
                                                    className="govuk-checkboxes__conditional govuk-checkboxes__conditional--hidden"
                                                    id={`conditional-input-${index}`}
                                                >
                                                    <label htmlFor={`maximum-passengers-${passenger.name}`}>
                                                        <h1 className="govuk-heading-s" id="individual-limit-heading">
                                                            We need to know how many passengers can use this at one time
                                                        </h1>
                                                    </label>
                                                    <div className="govuk-form-group">
                                                        <label
                                                            className="govuk-label"
                                                            htmlFor={`minimum-passengers-${passenger.name}`}
                                                        >
                                                            Minimum (optional)
                                                        </label>
                                                        <input
                                                            className="govuk-input govuk-!-width-one-third"
                                                            id={`minimum-passengers-${passenger.name}`}
                                                            name={`minimumPassengers${passenger.id}`}
                                                            defaultValue={
                                                                inputs?.groupPassengerType
                                                                    ? findCorrectPassengerType(
                                                                          inputs,
                                                                          passenger,
                                                                      )?.minNumber
                                                                    : ''
                                                            }
                                                        />
                                                    </div>
                                                    <div className="govuk-form-group">
                                                        <label
                                                            className="govuk-label"
                                                            htmlFor={`maximum-passengers-${passenger.name}`}
                                                        >
                                                            Maximum (required)
                                                        </label>
                                                        <input
                                                            className="govuk-input govuk-!-width-one-third"
                                                            id={`maximum-passengers-${passenger.name}`}
                                                            name={`maximumPassengers${passenger.id}`}
                                                            defaultValue={
                                                                inputs?.groupPassengerType
                                                                    ? findCorrectPassengerType(
                                                                          inputs,
                                                                          passenger,
                                                                      )?.maxNumber
                                                                    : ''
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <input
                                                    type="hidden"
                                                    name={`${passenger.name}-type`}
                                                    value={passenger.passengerType.passengerType}
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`${passenger.name}-age-range-min`}
                                                    value={passenger.passengerType.ageRangeMin || ''}
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`${passenger.name}-age-range-max`}
                                                    value={passenger.passengerType.ageRangeMax || ''}
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`${passenger.name}-proof-docs`}
                                                    value={JSON.stringify(passenger.passengerType.proofDocuments || [])}
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`${passenger.name}-id`}
                                                    value={JSON.stringify(passenger.id)}
                                                />
                                            </>
                                        ),
                                    )}
                                </div>
                            </FormElementWrapper>
                        </fieldset>
                    </div>
                    <div
                        className={`govuk-form-group${hasError(errors, 'passenger-group-name')}`}
                        id="passenger-group-name"
                    >
                        <label htmlFor="passenger-group-name">
                            <h1 className="govuk-heading-m" id="passenger-group-name-heading">
                                Provide a name for your group
                            </h1>
                        </label>

                        <p className="govuk-hint" id="group-name-hint">
                            50 characters maximum
                        </p>
                        <FormElementWrapper
                            errors={errors}
                            errorId="passenger-group-name"
                            errorClass="govuk-input--error"
                        >
                            <input
                                className="govuk-input govuk-input--width-30 govuk-product-name-input__inner__input"
                                id="passenger-group-name"
                                name="passengerGroupName"
                                type="text"
                                maxLength={50}
                                defaultValue={inputs?.name || ''}
                            />
                        </FormElementWrapper>
                    </div>
                    <input type="submit" value={`${editMode ? 'Update' : 'Add'} passenger type`} id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: ManagePassengerGroupProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const userInputsAndErrors = getSessionAttribute(ctx.req, GS_PASSENGER_GROUP_ATTRIBUTE);
    const nationalOperatorCode = getAndValidateNoc(ctx);
    const passengers = await getPassengerTypesByNocCode(nationalOperatorCode, 'single');
    const passengerTypeId = Number(ctx.query.id);
    const editMode = !!ctx.query.id && Number.isInteger(passengerTypeId);

    if (editMode) {
        const groupToDisplay = await getGroupPassengerTypeById(passengerTypeId, nationalOperatorCode);
        if (!groupToDisplay) {
            throw new Error('No groups for this NOC matches the passed id');
        }

        return {
            props: {
                passengers,
                csrfToken,
                errors: [],
                inputs: groupToDisplay,
                editMode,
            },
        };
    }

    if (!userInputsAndErrors) {
        return {
            props: {
                passengers,
                csrfToken,
                errors: [],
                editMode,
            },
        };
    }

    return {
        props: {
            passengers,
            csrfToken,
            errors: userInputsAndErrors.errors,
            inputs: userInputsAndErrors.inputs,
            editMode,
        },
    };
};

export default ManagePassengerGroup;
