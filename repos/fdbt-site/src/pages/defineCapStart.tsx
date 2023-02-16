import { upperFirst } from 'lodash';
import React, { ReactElement } from 'react';
import { daysOfWeek } from '../constants';
import { CAP_START_ATTRIBUTE } from '../../src/constants/attributes';
import { isCapStartInfo } from '../../src/interfaces/typeGuards';
import { getSessionAttribute } from '../../src/utils/sessions';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import { getCsrfToken } from '../utils';

const title = 'Define cap start - Create Fares Data Service';
const description = 'Capped products start selection page of the Create Fares Data Service';

interface SelectCappedProductGroupProps {
    errors: ErrorInfo[];
    csrfToken: string;
}

const DefineCapStart = ({ errors = [], csrfToken }: SelectCappedProductGroupProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/defineCapStart" method="post" csrfToken={csrfToken}>
            <ErrorSummary errors={errors} />
            <div className="govuk-form-group">
                <fieldset className="govuk-fieldset" aria-describedby="fixed-weekdays-hint">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                        <h1 className="govuk-fieldset__heading">Define when cap is calculated from</h1>
                    </legend>
                    <h2 className="govuk-heading-m govuk-!-margin-top-6">Business week</h2>
                    <span id="fixed-weekdays-hint" className="govuk-hint">
                        Which day does your cap&apos;s calculation start on?
                    </span>
                    <div className="govuk-radios" data-module="govuk-radios">
                        <div className="govuk-radios__item">
                            <input
                                className="govuk-radios__input"
                                id="fixed-weekdays"
                                name="capStart"
                                type="radio"
                                value="fixedWeekdays"
                                data-aria-controls="conditional-fixed-weekdays"
                            />
                            <label className="govuk-label govuk-radios__label" htmlFor="fixed-weekdays">
                                Fixed weekdays
                            </label>
                        </div>
                        <div
                            className="govuk-radios__conditional govuk-radios__conditional--hidden"
                            id="conditional-fixed-weekdays"
                        >
                            <div className="govuk-form-group">
                                <label className="govuk-label" htmlFor="start-day">
                                    Start
                                </label>
                                <select className="govuk-select" id="start-day" name="startDay">
                                    {daysOfWeek.map((day) => (
                                        <option defaultValue={day[0]} key={day} value={day}>
                                            {upperFirst(day)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="govuk-radios__item">
                            <input
                                className="govuk-radios__input"
                                id="rolling-days"
                                name="capStart"
                                type="radio"
                                value="rollingDays"
                                aria-describedby="rolling-days-hint"
                            />
                            <label className="govuk-label govuk-radios__label" htmlFor="rolling-days">
                                Rolling days
                            </label>
                            <div id="rolling-days-hint" className="govuk-hint govuk-radios__hint">
                                Rolling seven days from first journey
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
            <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: SelectCappedProductGroupProps } => {
    const csrfToken = getCsrfToken(ctx);
    const capStartAttribute = getSessionAttribute(ctx.req, CAP_START_ATTRIBUTE);
    const errors: ErrorInfo[] = capStartAttribute && !isCapStartInfo(capStartAttribute) ? capStartAttribute : [];

    return {
        props: {
            errors,
            csrfToken,
        },
    };
};

export default DefineCapStart;
