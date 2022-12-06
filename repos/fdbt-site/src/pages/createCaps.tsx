import React, { ReactElement, useState } from 'react';
import CapTable from '../components/CapTable';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import { CAPS_ATTRIBUTE } from '../constants/attributes';
import { Cap, ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { isWithErrors } from '../interfaces/typeGuards';
import { FullColumnLayout } from '../layout/Layout';
import { getCsrfToken } from '../utils';
import { getSessionAttribute } from '../utils/sessions';

const title = 'Create Caps - Create Fares Data Service';
const description = 'Create caps page of the Create Fares Data Service';

interface CreateCapsProps {
    errors: ErrorInfo[];
    userInput: Cap[];
    csrfToken: string;
    numberOfCapsToRender: number;
}

const CreateCaps = ({
    errors = [],
    userInput = [],
    csrfToken,
    numberOfCapsToRender,
}: CreateCapsProps): ReactElement => {
    const [numberOfCaps, setNumberOfCaps] = useState(numberOfCapsToRender);

    return (
        <FullColumnLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/createCaps" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <h1 className="govuk-heading-l" id="create-caps-page-heading">
                        Create your fare caps
                    </h1>
                    <div className="govuk-grid-row">
                        <CapTable numberOfCapsToDisplay={numberOfCaps} errors={errors} userInputtedCaps={userInput} />
                        <div className="flex-container">
                            {numberOfCaps < 10 ? (
                                <button
                                    id="add-another-button"
                                    type="button"
                                    className="govuk-button govuk-button--secondary govuk-!-margin-left-3 govuk-!-margin-bottom-3 time-restrictions-button-placement"
                                    onClick={(): void => setNumberOfCaps(numberOfCaps + 1)}
                                >
                                    Add another cap
                                </button>
                            ) : (
                                ''
                            )}

                            {numberOfCaps > 1 ? (
                                <button
                                    id="remove-button"
                                    type="button"
                                    className="govuk-button govuk-button--secondary govuk-!-margin-left-3 govuk-!-margin-bottom-3"
                                    onClick={(): void => setNumberOfCaps(numberOfCaps - 1)}
                                >
                                    Remove last cap
                                </button>
                            ) : (
                                ''
                            )}
                        </div>

                        <input
                            type="submit"
                            value="Continue"
                            id="continue-button"
                            className="govuk-button govuk-!-margin-left-3"
                        />
                    </div>
                </>
            </CsrfForm>
        </FullColumnLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: CreateCapsProps } => {
    const csrfToken = getCsrfToken(ctx);
    const capsAttribute = getSessionAttribute(ctx.req, CAPS_ATTRIBUTE);
    const numberOfCapsToRender = !!capsAttribute ? capsAttribute.caps.length : 1;

    return {
        props: {
            errors: isWithErrors(capsAttribute) ? capsAttribute.errors : [],
            userInput: capsAttribute ? capsAttribute.caps : [],
            csrfToken,
            numberOfCapsToRender,
        },
    };
};

export default CreateCaps;
