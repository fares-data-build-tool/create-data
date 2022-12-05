import React, { ReactElement } from 'react';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import RadioButtons from '../components/RadioButtons';
import { TYPE_OF_CAP_ATTRIBUTE } from '../constants/attributes';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import { getCsrfToken } from '../utils';
import { getSessionAttribute } from '../utils/sessions';

const title = 'Type of Cap - Create Fares Data Service';
const description = 'Type of cap selection page of the Create Fares Data Service';

interface TypeOfCapProps {
    errors: ErrorInfo[];
    csrfToken: string;
}

const TicketRepresentation = ({ errors = [], csrfToken }: TypeOfCapProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/typeOfCap" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="type-of-cap-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="type-of-cap-page-heading">
                                    {`Select a type of cap`}
                                </h1>
                            </legend>
                            <FormElementWrapper
                                errors={errors}
                                errorId="radio-option-byDistance"
                                errorClass="govuk-radios--errors"
                            >
                                <RadioButtons
                                    inputName="typeOfCap"
                                    options={[
                                        {
                                            value: 'byDistance',
                                            label: 'Pricing by distance',
                                            hint: 'Price increments by units of distance travelled up to a cap',
                                        },
                                        {
                                            value: 'byTaps',
                                            label: 'Pricing by taps',
                                            hint: 'Pricing increments by number of taps up to a cap',
                                        },
                                        {
                                            value: 'byProducts',
                                            label: 'Pricing by products',
                                            hint: 'Price increments by standard products up to a cap',
                                        },
                                    ]}
                                />
                            </FormElementWrapper>
                        </fieldset>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: TypeOfCapProps } => {
    const csrfToken = getCsrfToken(ctx);
    const typeOfCapAttribute = getSessionAttribute(ctx.req, TYPE_OF_CAP_ATTRIBUTE);
    const errors = !!typeOfCapAttribute && 'errorMessage' in typeOfCapAttribute ? [typeOfCapAttribute] : [];

    return {
        props: {
            errors,
            csrfToken,
        },
    };
};

export default TicketRepresentation;
