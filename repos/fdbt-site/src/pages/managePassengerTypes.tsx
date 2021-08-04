import React, { ReactElement } from 'react';
import { ErrorInfo, NextPageContextWithSession, SinglePassengerType } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE } from '../constants/attributes';
import { isWithErrors } from '../interfaces/typeGuards';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { getPassengerTypeById } from '../data/auroradb';

const title = 'Manage Passenger Types - Create Fares Data Service';
const description = 'Manage Passenger Type page of the Create Fares Data Service';

interface FilteredRequestBodyPassengerType {
    passengerType?: string;
    ageRangeMin?: string;
    ageRangeMax?: string;
    proofDocuments?: string[];
}

interface FilteredRequestBody {
    id?: number;
    name?: string;
    passengerType: FilteredRequestBodyPassengerType;
}

interface ManagePassengerTypesProps {
    isInEditMode: boolean;
    csrfToken: string;
    errors: ErrorInfo[];
    model: FilteredRequestBody;
}

const ManagePassengerTypes = ({
    isInEditMode,
    csrfToken,
    errors = [],
    model,
}: ManagePassengerTypesProps): ReactElement => {
    const id = model?.id;
    const name = model?.name;
    const type = model?.passengerType?.passengerType;
    const ageRangeMin = model?.passengerType?.ageRangeMin;
    const ageRangeMax = model?.passengerType?.ageRangeMax;
    const documents = model?.passengerType?.proofDocuments ?? [];

    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/managePassengerTypes" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />

                    <input type="hidden" name="id" value={id} />

                    <h1 className="govuk-heading-l" id="define-passenger-type-page-heading">
                        Provide passenger type details
                    </h1>

                    <div className={`govuk-form-group${hasError(errors, 'type')}`} id="type">
                        <fieldset className="govuk-fieldset">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                                <h1 className="govuk-fieldset__heading">Select passenger type</h1>
                            </legend>

                            <FormElementWrapper errors={errors} errorId={'type'} errorClass={'govuk-radios--error'}>
                                <div className="govuk-radios">
                                    <div className="govuk-radios__item">
                                        <input
                                            className="govuk-radios__input"
                                            id="adult"
                                            name="type"
                                            type="radio"
                                            value="adult"
                                            defaultChecked={type === 'adult'}
                                        />
                                        <label className="govuk-label govuk-radios__label" htmlFor="adult">
                                            Adult
                                        </label>
                                    </div>
                                    <div className="govuk-radios__item">
                                        <input
                                            className="govuk-radios__input"
                                            id="child"
                                            name="type"
                                            type="radio"
                                            value="child"
                                            defaultChecked={type === 'child'}
                                        />
                                        <label className="govuk-label govuk-radios__label" htmlFor="child">
                                            Child
                                        </label>
                                    </div>
                                    <div className="govuk-radios__item">
                                        <input
                                            className="govuk-radios__input"
                                            id="infant"
                                            name="type"
                                            type="radio"
                                            value="infant"
                                            defaultChecked={type === 'infant'}
                                        />
                                        <label className="govuk-label govuk-radios__label" htmlFor="infant">
                                            Infant
                                        </label>
                                    </div>
                                    <div className="govuk-radios__item">
                                        <input
                                            className="govuk-radios__input"
                                            id="senior"
                                            name="type"
                                            type="radio"
                                            value="senior"
                                            defaultChecked={type === 'senior'}
                                        />
                                        <label className="govuk-label govuk-radios__label" htmlFor="senior">
                                            Senior
                                        </label>
                                    </div>
                                    <div className="govuk-radios__item">
                                        <input
                                            className="govuk-radios__input"
                                            id="student"
                                            name="type"
                                            type="radio"
                                            value="student"
                                            defaultChecked={type === 'student'}
                                        />
                                        <label className="govuk-label govuk-radios__label" htmlFor="student">
                                            Student
                                        </label>
                                    </div>
                                    <div className="govuk-radios__item">
                                        <input
                                            className="govuk-radios__input"
                                            id="young_person"
                                            name="type"
                                            type="radio"
                                            value="youngPerson"
                                            defaultChecked={type === 'youngPerson'}
                                        />
                                        <label className="govuk-label govuk-radios__label" htmlFor="young_person">
                                            Young person
                                        </label>
                                    </div>
                                    <div className="govuk-radios__item">
                                        <input
                                            className="govuk-radios__input"
                                            id="anyone"
                                            name="type"
                                            type="radio"
                                            value="anyone"
                                            defaultChecked={type === 'anyone'}
                                        />
                                        <label className="govuk-label govuk-radios__label" htmlFor="anyone">
                                            Anyone
                                        </label>
                                    </div>
                                </div>
                            </FormElementWrapper>
                        </fieldset>
                    </div>

                    <fieldset className="govuk-fieldset">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                            <h1 className="govuk-fieldset__heading">Does this passenger type have an age range?</h1>
                        </legend>

                        <div className={`govuk-form-group${hasError(errors, 'age-range-min')}`}>
                            <div id="age-range-min" className="govuk-hint">
                                Minimum age (if applicable)
                            </div>

                            <FormElementWrapper
                                errors={errors}
                                errorId={'age-range-min'}
                                errorClass={'govuk-input--error'}
                            >
                                <input
                                    className="govuk-input govuk-input--width-5"
                                    name="ageRangeMin"
                                    type="text"
                                    defaultValue={ageRangeMin}
                                />
                            </FormElementWrapper>
                        </div>

                        <div className={`govuk-form-group${hasError(errors, 'age-range-max')}`}>
                            <div id="age-range-max" className="govuk-hint">
                                Maximum age (if applicable)
                            </div>

                            <FormElementWrapper
                                errors={errors}
                                errorId={'age-range-max'}
                                errorClass={'govuk-input--error'}
                            >
                                <input
                                    className="govuk-input govuk-input--width-5"
                                    name="ageRangeMax"
                                    type="text"
                                    defaultValue={ageRangeMax}
                                />
                            </FormElementWrapper>
                        </div>
                    </fieldset>

                    <div className="govuk-form-group">
                        <fieldset className="govuk-fieldset">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                                <h1 className="govuk-fieldset__heading">
                                    Does this passenger type require a proof document?
                                </h1>
                            </legend>

                            <div id="proofDocuments-hint" className="govuk-hint">
                                Select the applicable proof document(s)
                            </div>

                            <div className="govuk-checkboxes" data-module="govuk-checkboxes">
                                <div className="govuk-checkboxes__item">
                                    <input
                                        className="govuk-checkboxes__input"
                                        id="membership_card"
                                        name="proofDocuments"
                                        type="checkbox"
                                        value="membershipCard"
                                        defaultChecked={documents.includes('membershipCard')}
                                    />

                                    <label className="govuk-label govuk-checkboxes__label" htmlFor="membership_card">
                                        Membership card
                                    </label>
                                </div>

                                <div className="govuk-checkboxes__item">
                                    <input
                                        className="govuk-checkboxes__input"
                                        id="student_card"
                                        name="proofDocuments"
                                        type="checkbox"
                                        value="studentCard"
                                        defaultChecked={documents.includes('studentCard')}
                                    />

                                    <label className="govuk-label govuk-checkboxes__label" htmlFor="student_card">
                                        Student card
                                    </label>
                                </div>

                                <div className="govuk-checkboxes__item">
                                    <input
                                        className="govuk-checkboxes__input"
                                        id="identity_document"
                                        name="proofDocuments"
                                        type="checkbox"
                                        value="identityDocument"
                                        defaultChecked={documents.includes('identityDocument')}
                                    />

                                    <label className="govuk-label govuk-checkboxes__label" htmlFor="identity_document">
                                        Identity document
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <div className={`govuk-form-group${hasError(errors, 'name')}`} id="name">
                        <h1 className="govuk-label-wrapper">
                            <label className="govuk-label govuk-label--m" htmlFor="passenger_type_name">
                                Provide a name for your passenger type
                            </label>
                        </h1>

                        <div id="passenger_type_name_hint" className="govuk-hint">
                            50 characters maximum
                        </div>

                        <FormElementWrapper errors={errors} errorId={'name'} errorClass={'govuk-input--error'}>
                            <input
                                className="govuk-input"
                                id="passenger_type_name"
                                name="name"
                                type="text"
                                aria-describedby="passenger_type_name_hint"
                                defaultValue={name}
                            />
                        </FormElementWrapper>
                    </div>

                    <input
                        type="submit"
                        value={`${isInEditMode ? 'Update' : 'Add'} passenger type`}
                        id="continue-button"
                        className="govuk-button"
                    />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

const hasError = (errors: ErrorInfo[], name: string) => {
    if (errors.filter((e) => e.id === name).length > 0) {
        return ' govuk-form-group--error';
    }

    return '';
};

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: ManagePassengerTypesProps }> => {
    const nationalOperatorCode = getAndValidateNoc(ctx);

    let singlePassengerType: SinglePassengerType | undefined;

    const csrfToken = getCsrfToken(ctx);

    const passengerTypeId = Number(ctx.query.id);

    const isInEditMode = Number.isInteger(passengerTypeId);

    let sessionObject = getSessionAttribute(ctx.req, MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE);

    if (isInEditMode && sessionObject?.id !== passengerTypeId) {
        updateSessionAttribute(ctx.req, MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, undefined);
        sessionObject = undefined;
    }

    if (sessionObject === undefined && isInEditMode) {
        singlePassengerType = await getPassengerTypeById(passengerTypeId, nationalOperatorCode);

        if (singlePassengerType === undefined) {
            throw Error('could not find passenger type');
        }
    }

    const errors: ErrorInfo[] = isWithErrors(sessionObject) ? sessionObject.errors : [];

    const model =
        sessionObject === undefined
            ? ({ ...singlePassengerType } as FilteredRequestBody)
            : ({ ...sessionObject } as FilteredRequestBody);

    return {
        props: {
            isInEditMode,
            csrfToken,
            errors,
            model,
        },
    };
};

export default ManagePassengerTypes;
