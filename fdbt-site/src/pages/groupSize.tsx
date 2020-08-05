import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import { CustomAppProps, NextPageContextWithSession, ErrorInfo } from '../interfaces';
import FormElementWrapper from '../components/FormElementWrapper';
import { getSessionAttribute } from '../utils/sessions';
import { GROUP_SIZE } from '../constants';
import { GroupTicketAttributeWithErrors, GroupTicketAttribute } from './api/groupSize';

const title = 'Group Size - Fares Data Build Tool';
const description = 'Group Size entry page of the Fares Data Build Tool';

export interface GroupSizeProps {
    groupTicketInfo: GroupTicketAttribute | GroupTicketAttributeWithErrors;
}

const isGroupTicketInfoWithErrors = (
    groupTicketInfo: GroupTicketAttribute | GroupTicketAttributeWithErrors,
): groupTicketInfo is GroupTicketAttributeWithErrors =>
    (groupTicketInfo as GroupTicketAttributeWithErrors).errors !== undefined;

const GroupSize = ({ groupTicketInfo, csrfToken }: GroupSizeProps & CustomAppProps): ReactElement => {
    const errors: ErrorInfo[] = isGroupTicketInfoWithErrors(groupTicketInfo) ? groupTicketInfo.errors : [];
    return (
        <TwoThirdsLayout title={title} description={description}>
            <CsrfForm action="/api/groupSize" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group${errors.length > 0 ? ' govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="group-size-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="group-size-page-heading">
                                    How many passengers can use this ticket at one time?
                                </h1>
                                <p className="govuk-hint" id="group-size-page-example">
                                    We need to know the size of the group of passengers that can use this ticket at one
                                    time. Example: Up to 5 passengers at a time.
                                </p>
                                <p className="govuk-hint" id="group-size-page-hint">
                                    You will be able to specify the exact number of passengers for each passenger type
                                    in the next step.
                                </p>
                            </legend>
                            <FormElementWrapper
                                errors={errors}
                                errorId={errors.length > 0 ? errors[0].id : ''}
                                errorClass="govuk-input--error"
                            >
                                <input
                                    className="govuk-input govuk-input--width-2"
                                    id="max-group-size"
                                    name="maxGroupSize"
                                    type="text"
                                    defaultValue={groupTicketInfo.maxGroupSize}
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

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: GroupSizeProps } => {
    const groupTicketInfo = getSessionAttribute(ctx.req, GROUP_SIZE);
    const defaultGroupTicketInfo: GroupTicketAttribute = {
        maxGroupSize: '',
    };
    return {
        props: {
            groupTicketInfo: groupTicketInfo || defaultGroupTicketInfo,
        },
    };
};

export default GroupSize;
