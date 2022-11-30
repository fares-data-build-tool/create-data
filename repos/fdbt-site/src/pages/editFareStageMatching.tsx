import { ReactElement } from 'react';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { MATCHING_JSON_ATTRIBUTE } from '../constants/attributes';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { ReturnTicket, SingleTicket, WithIds } from '../interfaces/matchingJsonTypes';
import TwoThirdsLayout from '../layout/Layout';
import { getCsrfToken, isReturnTicket } from '../utils';
import { getSessionAttribute } from '../utils/sessions';

const title = 'Edit fare stages - Create Fares Data Service ';
const description = 'Edit fare stages page of the Create Fares Data Service';
const errorId = 'radio-option-single';

interface EditStagesProps {
    fareStages: string[];
    errors: ErrorInfo[];
    csrfToken: string;
}

const getFareStagesFromTicket = (ticket: WithIds<SingleTicket> | WithIds<ReturnTicket>): string[] => {
    if (isReturnTicket(ticket)) {
        return ticket.outboundFareZones.map((fareZone) => fareZone.name);
    }

    return (ticket as WithIds<SingleTicket>).fareZones.map((fareZone) => fareZone.name);
};

const FareType = ({ errors = [], csrfToken }: EditStagesProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/editFareStageMatching" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="fare-type-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="fare-type-page-heading">
                                    Edit some stuff
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="fare-type-operator-hint">
                                Do it
                            </span>
                            <FormElementWrapper errors={errors} errorId={errorId} errorClass="govuk-radios--error">
                                <input></input>
                            </FormElementWrapper>
                        </fieldset>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: EditStagesProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const ticket = getSessionAttribute(ctx.req, MATCHING_JSON_ATTRIBUTE) as
        | WithIds<SingleTicket>
        | WithIds<ReturnTicket>
        | undefined;

    if (!ticket) {
        throw new Error('Ticket not found in session.');
    }
    const fareStages = getFareStagesFromTicket(ticket);

    return { props: { fareStages, csrfToken, errors: [] } };
};

export default FareType;
