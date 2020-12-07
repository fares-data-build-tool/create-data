import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import TwoThirdsLayout from '../layout/Layout';
import { SCHOOL_FARE_TYPE_ATTRIBUTE, OPERATOR_COOKIE } from '../constants';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { isWithErrors } from '../interfaces/typeGuards';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import FareTypeRadios, { FareTypeRadioProps } from '../components/FareTypeRadios';
import { getCsrfToken } from '../utils/index';
import { getSessionAttribute } from '../utils/sessions';

const title = 'School Fare Type - Create Fares Data Service ';
const description = 'School Fare Type selection page of the Create Fares Data Service';

const errorId = 'school-fare-type-single';

interface SchoolFareTypeProps {
    operatorName: string;
    errors: ErrorInfo[];
    csrfToken: string;
}

const radioProps: FareTypeRadioProps = {
    standardFares: [
        {
            fareType: 'single',
            label: 'Single Ticket - Point to Point',
        },
        {
            fareType: 'period',
            label: 'Period Ticket (Day, Week, Month and Annual)',
        },
        {
            fareType: 'flatFare',
            label: 'Flat Fare Ticket - Single Journey',
        },
    ],
};

const SchoolFareType = ({ operatorName, errors = [], csrfToken }: SchoolFareTypeProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/schoolFareType" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="school-fare-type-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="school-fare-type-page-heading">
                                    Select a fare type
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="school-fare-type-operator-hint">
                                {operatorName}
                            </span>
                            <FormElementWrapper errors={errors} errorId={errorId} errorClass="govuk-radios--error">
                                <FareTypeRadios standardFares={radioProps.standardFares} />
                            </FormElementWrapper>
                        </fieldset>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: SchoolFareTypeProps } => {
    const csrfToken = getCsrfToken(ctx);
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];

    if (!operatorCookie) {
        throw new Error('Could not extract the necessary operator info for the schoolFareType page.');
    }

    const { name } = JSON.parse(operatorCookie);

    const schoolFareTypeAttribute = getSessionAttribute(ctx.req, SCHOOL_FARE_TYPE_ATTRIBUTE);

    const errors: ErrorInfo[] = isWithErrors(schoolFareTypeAttribute) ? schoolFareTypeAttribute.errors : [];

    return { props: { operatorName: name, errors, csrfToken } };
};

export default SchoolFareType;
