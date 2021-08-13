import React, { ReactElement } from 'react';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import PassengerTypeCard from '../components/PassengerTypeCard';
import { PASSENGER_TYPE_ATTRIBUTE } from '../constants/attributes';
import FormElementWrapper from '../components/FormElementWrapper';
import { getGroupPassengerTypesFromGlobalSettings, getPassengerTypesByNocCode } from '../data/auroradb';
import { ErrorInfo, FullGroupPassengerType, NextPageContextWithSession, SinglePassengerType } from '../interfaces';
import { isPassengerTypeAttributeWithErrors } from '../interfaces/typeGuards';
import TwoThirdsLayout from '../layout/Layout';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { getSessionAttribute } from '../utils/sessions';

const title = 'Select Passenger Type - Create Fares Data Service';
const description = 'Select Passenger Type selection page of the Create Fares Data Service';

interface PassengerTypeProps {
    errors: ErrorInfo[];
    csrfToken: string;
    savedGroups: FullGroupPassengerType[];
    savedPassengerTypes: SinglePassengerType[];
}

const SelectPassengerType = ({
    errors = [],
    csrfToken,
    savedGroups,
    savedPassengerTypes,
}: PassengerTypeProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/selectPassengerType" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <fieldset className="govuk-fieldset" aria-describedby="passenger-type-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="passenger-type-page-heading">
                                Select a passenger type
                            </h1>
                        </legend>
                        <div className="govuk-warning-text">
                            <span className="govuk-warning-text__icon govuk-!-margin-top-1" aria-hidden="true">
                                !
                            </span>
                            <strong className="govuk-warning-text__text">
                                <span className="govuk-warning-text__assistive">Warning</span>
                                You can create new types in your{' '}
                                <a className="govuk-link" href="/viewPassengerTypes">
                                    operator settings.
                                </a>{' '}
                                <br />
                                Don&apos;t worry you can navigate back to this page when you are finished.
                            </strong>
                        </div>

                        {savedPassengerTypes.length === 0 ? (
                            <>
                                <span className="govuk-body">
                                    <i>You currently have no saved passenger types</i>
                                </span>
                            </>
                        ) : (
                            <div className="govuk-heading-m">
                                <div className="govuk-radios" id="individual-passengers">
                                    <h3>Individuals</h3>
                                    <FormElementWrapper errors={errors} errorId={''} errorClass="govuk-radios--error">
                                        <>
                                            {savedPassengerTypes.map((passengerType) => (
                                                <PassengerTypeCard
                                                    contents={passengerType}
                                                    key={passengerType.id.toString()}
                                                />
                                            ))}
                                        </>
                                    </FormElementWrapper>

                                    <h3>Groups</h3>
                                    {savedGroups.length ? (
                                        <>
                                            {savedGroups.map((passengerTypeGroup) => (
                                                <PassengerTypeCard
                                                    contents={passengerTypeGroup}
                                                    key={passengerTypeGroup.id.toString()}
                                                />
                                            ))}
                                        </>
                                    ) : (
                                        <span className="govuk-body">
                                            <i>You currently have no saved groups</i>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </fieldset>
                </div>
                {!!savedPassengerTypes.length && (
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                )}
                <a className="govuk-button govuk-button--secondary govuk-!-margin-left-2" href="/viewPassengerTypes">
                    Create new
                </a>
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: PassengerTypeProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const nationalOperatorCode = getAndValidateNoc(ctx);
    const singlePassengerTypes = await getPassengerTypesByNocCode(nationalOperatorCode, 'single');
    const groupPassengerTypes = await getGroupPassengerTypesFromGlobalSettings(nationalOperatorCode);
    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);

    const errors: ErrorInfo[] =
        passengerTypeAttribute && isPassengerTypeAttributeWithErrors(passengerTypeAttribute)
            ? passengerTypeAttribute.errors
            : [];

    return {
        props: { errors, csrfToken, savedGroups: groupPassengerTypes, savedPassengerTypes: singlePassengerTypes },
    };
};

export default SelectPassengerType;
