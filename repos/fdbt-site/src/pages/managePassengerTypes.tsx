import React, { ReactElement, useState } from 'react';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import { getCsrfToken } from '../utils';
import { MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE } from '../constants/attributes';
import { isWithErrors } from '../interfaces/typeGuards';
import { getSessionAttribute } from 'src/utils/sessions';
import ErrorSummary from '../components/ErrorSummary';

const title = 'Manage Passenger Type - Create Fares Data Service';
const description = 'Manage Passenger Type page of the Create Fares Data Service';

interface FormData {
    name: string;
    type: string;
    ageRangeMin: string;
    ageRangeMax: string;
    documents: string[];
}

interface FilteredRequestBody {
    name?: string;
    type?: string;
    ageRangeMin?: string;
    ageRangeMax?: string;
    proofDocuments?: string[];
}

interface ManagePassengerTypesProps {
    csrfToken: string;
    errors: ErrorInfo[];
    model: FilteredRequestBody;
}

const ManagePassengerTypes = ({ csrfToken, errors = [], model }: ManagePassengerTypesProps): ReactElement => {
    const [state, setState] = useState<FormData>({
        type: model.type ? model.type : '',
        name: model.name ? model.name : '',
        ageRangeMin: model.ageRangeMin ? model.ageRangeMin : '',
        ageRangeMax: model.ageRangeMax ? model.ageRangeMax : '',
        documents: model.proofDocuments ? model.proofDocuments : [],
    });

    const typeChangeHandler = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        const currentState = { ...state };

        currentState.type = changeEvent.currentTarget.value;

        setState({ ...currentState });
    };

    const ageRangeMinHandler = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        const currentState = { ...state };

        currentState.ageRangeMin = changeEvent.currentTarget.value;

        setState({ ...currentState });
    };

    const ageRangeMaxHandler = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        const currentState = { ...state };

        currentState.ageRangeMax = changeEvent.currentTarget.value;

        setState({ ...currentState });
    };

    const proofDocumentsHandler = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        const currentState = { ...state };

        const checked = changeEvent.currentTarget.checked;
        const value = changeEvent.currentTarget.value;

        if (checked) {
            currentState.documents.push(value);
        } else {
            currentState.documents = currentState.documents.filter((doc) => doc !== value);
        }

        setState({ ...currentState });
    };

    const nameHandler = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        const currentState = { ...state };

        currentState.name = changeEvent.currentTarget.value;

        setState({ ...currentState });
    };
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/managePassengerType" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />

                    <h1 className="govuk-heading-l" id="define-passenger-type-page-heading">
                        Provide passenger type details
                    </h1>

                    <div className={`govuk-form-group${hasError(errors, 'type')}`} id="type">
                        <fieldset className="govuk-fieldset">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                                <h1 className="govuk-fieldset__heading">Select passenger type</h1>
                            </legend>
                            <div className="govuk-radios">
                                <div className="govuk-radios__item">
                                    <input
                                        className="govuk-radios__input"
                                        id="adult"
                                        name="type"
                                        type="radio"
                                        value="adult"
                                        checked={state.type === 'adult'}
                                        onChange={typeChangeHandler}
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
                                        checked={state.type === 'child'}
                                        onChange={typeChangeHandler}
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
                                        checked={state.type === 'infant'}
                                        onChange={typeChangeHandler}
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
                                        checked={state.type === 'senior'}
                                        onChange={typeChangeHandler}
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
                                        checked={state.type === 'student'}
                                        onChange={typeChangeHandler}
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
                                        checked={state.type === 'youngPerson'}
                                        onChange={typeChangeHandler}
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
                                        checked={state.type === 'anyone'}
                                        onChange={typeChangeHandler}
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="anyone">
                                        Anyone
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <fieldset className="govuk-fieldset">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                            <h1 className="govuk-fieldset__heading">Does this passenger type have an age range?</h1>
                        </legend>

                        <div className="govuk-form-group">
                            <div id="ageRangeMin" className="govuk-hint">
                                Minimum age (if applicable)
                            </div>

                            <input
                                className="govuk-input govuk-input--width-5"
                                id="ageRangeMin"
                                name="ageRangeMin"
                                type="text"
                                value={state.ageRangeMin !== undefined ? state.ageRangeMin : ''}
                                onChange={ageRangeMinHandler}
                            />
                        </div>

                        <div className="govuk-form-group">
                            <div id="ageRangeMax" className="govuk-hint">
                                Maximum age (if applicable)
                            </div>

                            <input
                                className="govuk-input govuk-input--width-5"
                                id="ageRangeMax"
                                name="ageRangeMax"
                                type="text"
                                value={state.ageRangeMax !== undefined ? state.ageRangeMax : ''}
                                onChange={ageRangeMaxHandler}
                            />
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
                                        checked={state.documents.includes('membershipCard')}
                                        onChange={proofDocumentsHandler}
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
                                        checked={state.documents.includes('studentCard')}
                                        onChange={proofDocumentsHandler}
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
                                        checked={state.documents.includes('identityDocument')}
                                        onChange={proofDocumentsHandler}
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

                        <input
                            className="govuk-input"
                            id="passenger_type_name"
                            name="name"
                            type="text"
                            aria-describedby="passenger_type_name_hint"
                            value={state.name !== undefined ? state.name : ''}
                            onChange={nameHandler}
                        />
                    </div>

                    <input type="submit" value="Add passenger type" id="continue-button" className="govuk-button" />
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

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: ManagePassengerTypesProps } => {
    const csrfToken = getCsrfToken(ctx);

    const errorsFromSession = getSessionAttribute(ctx.req, MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE);

    const errors: ErrorInfo[] = isWithErrors(errorsFromSession) ? errorsFromSession.errors : [];

    const model = { ...errorsFromSession };

    return {
        props: {
            csrfToken,
            errors,
            model,
        },
    };
};

export default ManagePassengerTypes;
