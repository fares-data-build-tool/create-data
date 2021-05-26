import React, { ReactElement } from 'react';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import InsetText from '../components/InsetText';
import RadioConditionalInput from '../components/RadioConditionalInput';
import { GROUP_PASSENGER_TYPE, GROUP_REUSE_PASSENGER_TYPE, PASSENGER_TYPES_WITH_GROUP } from '../constants';
import { PASSENGER_TYPE_ATTRIBUTE, SAVED_PASSENGER_GROUPS_ATTRIBUTE } from '../constants/attributes';
import { getPassengerTypesByNocCode } from '../data/auroradb';
import {
    ErrorInfo,
    GroupPassengerType,
    NextPageContextWithSession,
    RadioConditionalInputFieldset,
} from '../interfaces';
import { isPassengerTypeAttributeWithErrors } from '../interfaces/typeGuards';
import TwoThirdsLayout from '../layout/Layout';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';

const title = 'Passenger Type - Create Fares Data Service';
const description = 'Passenger Type selection page of the Create Fares Data Service';

const insetText = 'More passenger types will become available soon';

interface PassengerTypeProps {
    errors?: ErrorInfo[];
    csrfToken: string;
    savedGroups: GroupPassengerType[];
}

export const getFieldsets = (errors: ErrorInfo[], savedGroups: GroupPassengerType[]): RadioConditionalInputFieldset => {
    const groups = [...PASSENGER_TYPES_WITH_GROUP];
    if (!savedGroups.length) {
        groups.pop();
    }

    return {
        radioError: errors,
        heading: {
            id: 'passenger-types-fieldset',
            content: '',
            hidden: true,
        },
        radios: groups.map(({ passengerTypeValue: value, passengerTypeDisplay: display }) => ({
            id: `passenger-type-${value}`,
            key: value,
            name: 'passengerType',
            value,
            dataAriaControls: 'passenger-type-required-conditional',
            label: display,
            type: 'radio',
            inputType: 'dropdown',
            ...(value !== GROUP_REUSE_PASSENGER_TYPE
                ? {}
                : {
                      inputHint: {
                          id: 'choose-saved-group-hint',
                          content: 'Select a saved group to use',
                      },
                      selectIdentifier: 'reuseGroup',
                      inputErrors: errors,
                      inputs: savedGroups.map((group, index) => ({
                          id: `group-passenger-type-${index}`,
                          name: group.name,
                          label: group.name,
                      })),
                  }),
        })),
    };
};

const PassengerType = ({ errors = [], csrfToken, savedGroups }: PassengerTypeProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/passengerType" method="post" csrfToken={csrfToken}>
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
                            Specific details of your fare type, including age range, can be entered in the next section
                        </span>
                        <FormElementWrapper
                            errors={errors}
                            errorId={`passenger-type-${GROUP_PASSENGER_TYPE}`}
                            errorClass="govuk-radios--error"
                        >
                            <div className="govuk-radios">
                                <RadioConditionalInput
                                    key="passenger-types-fieldset"
                                    fieldset={getFieldsets(errors, savedGroups)}
                                />
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

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: PassengerTypeProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);

    let savedGroups = getSessionAttribute(ctx.req, SAVED_PASSENGER_GROUPS_ATTRIBUTE);
    if (savedGroups === undefined) {
        const noc = getAndValidateNoc(ctx);
        savedGroups = await getPassengerTypesByNocCode(noc, 'group');
        updateSessionAttribute(ctx.req, SAVED_PASSENGER_GROUPS_ATTRIBUTE, savedGroups);
    }

    const errors: ErrorInfo[] =
        passengerTypeAttribute && isPassengerTypeAttributeWithErrors(passengerTypeAttribute)
            ? passengerTypeAttribute.errors
            : [];

    return { props: { errors, csrfToken, savedGroups } };
};

export default PassengerType;
