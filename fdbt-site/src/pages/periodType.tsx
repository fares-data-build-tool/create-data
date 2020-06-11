import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import TwoThirdsLayout from '../layout/Layout';
import { PERIOD_TYPE_COOKIE } from '../constants';
import { ErrorInfo, CustomAppProps } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';

const title = 'Period Type - Fares Data Build Tool';
const description = 'Period Type selection page of the Fares Data Build Tool';

const errorId = 'period-type-error';

type PeriodTypeProps = {
    errors: ErrorInfo[];
};

const PeriodType = ({ errors = [], csrfToken }: PeriodTypeProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/periodType" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <fieldset className="govuk-fieldset" aria-describedby="period-type-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="period-type-page-heading">
                                Select a type of period ticket
                            </h1>
                        </legend>
                        <FormElementWrapper errors={errors} errorId={errorId} errorClass="govuk-radios--errors">
                            <div className="govuk-radios">
                                <div className="govuk-radios__item">
                                    <input
                                        className={`govuk-radios__input ${
                                            errors.length > 0 ? 'govuk-input--error' : ''
                                        } `}
                                        id="period-type-geo-zone"
                                        name="periodType"
                                        type="radio"
                                        value="periodGeoZone"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="period-type-geo-zone">
                                        A ticket within a geographical zone
                                    </label>
                                </div>
                                <div className="govuk-radios__item">
                                    <input
                                        className={`govuk-radios__input ${
                                            errors.length > 0 ? 'govuk-input--error' : ''
                                        } `}
                                        id="period-type-single-set-service"
                                        name="periodType"
                                        type="radio"
                                        value="periodMultipleServices"
                                    />
                                    <label
                                        className="govuk-label govuk-radios__label"
                                        htmlFor="period-type-single-set-service"
                                    >
                                        A ticket for some or all of your network of services
                                    </label>
                                </div>
                                <div className="govuk-radios__item">
                                    <input
                                        className={`govuk-radios__input ${
                                            errors.length > 0 ? 'govuk-input--error' : ''
                                        } `}
                                        id="period-type-network"
                                        name="periodType"
                                        type="radio"
                                        value="periodMultipleOperators"
                                        disabled
                                        aria-disabled="true"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="period-type-network">
                                        A ticket for services across multiple operators (Not yet available)
                                    </label>
                                </div>
                            </div>
                        </FormElementWrapper>
                    </fieldset>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);

    if (cookies[PERIOD_TYPE_COOKIE]) {
        const periodTypeCookie = cookies[PERIOD_TYPE_COOKIE];
        const parsedPeriodTypeCookie = JSON.parse(periodTypeCookie);

        if (parsedPeriodTypeCookie.errorMessage) {
            const { errorMessage } = parsedPeriodTypeCookie;
            return { props: { errors: [{ errorMessage, id: errorId }] } };
        }
    }

    return { props: {} };
};

export default PeriodType;
