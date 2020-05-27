import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE } from '../constants';
import ErrorSummary from '../components/ErrorSummary';
import { ErrorInfo } from '../types';
import { buildTitle } from '../utils/index';
import FormElementWrapper from '../components/FormElementWrapper';

const title = 'Operator - Fares Data Build Tool';
const description = 'Operator selection page of the Fares Data Build Tool';

const errorId = 'operator-error';

type Operator = {
    operatorName: string;
    nocCode: string;
};

type OperatorProps = {
    errors: ErrorInfo[];
};

const hardCodedOperators: Operator[] = [
    { operatorName: 'Blackpool Transport', nocCode: 'BLAC' },
    { operatorName: 'Connexions Buses', nocCode: 'HCTY' },
    { operatorName: 'Durham County Council', nocCode: 'DCCL' },
    { operatorName: 'East Yorkshire Council', nocCode: 'ERDG' },
    { operatorName: 'Lancashire County Council', nocCode: 'PBLT' },
    { operatorName: 'Manchester Community Transport', nocCode: 'MCTR' },
    { operatorName: 'Pilkington Bus', nocCode: 'NWBT' },
    { operatorName: 'TLC Travel', nocCode: 'TLCT' },
    { operatorName: 'Transport for Greater Manchester', nocCode: 'VISB' },
    { operatorName: "Warrington's Own Buses", nocCode: 'WBTR' },
];

const Operator = ({ errors = [] }: OperatorProps): ReactElement => {
    return (
        <Layout title={buildTitle(errors, title)} description={description}>
            <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
                <form action="/api/operator" method="post">
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="operator-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                                <h1 className="govuk-fieldset__heading" id="operator-page-heading">
                                    Which organisation are you representing?
                                </h1>
                            </legend>
                            <FormElementWrapper errors={errors} errorId={errorId} errorClass="govuk-radios--error">
                                <div className="govuk-radios">
                                    {hardCodedOperators.map(
                                        (operator, index): ReactElement => (
                                            <div className="govuk-radios__item" key={operator.operatorName}>
                                                <input
                                                    className="govuk-radios__input"
                                                    id={`operator-name${index}`}
                                                    name="operator"
                                                    type="radio"
                                                    value={JSON.stringify(operator)}
                                                />
                                                <label
                                                    className="govuk-label govuk-radios__label"
                                                    htmlFor={`operator-name${index}`}
                                                >
                                                    {`${operator.operatorName}`}
                                                </label>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </FormElementWrapper>
                        </fieldset>
                    </div>
                    <input
                        type="submit"
                        value="Continue"
                        id="continue-button"
                        className="govuk-button govuk-button--start"
                    />
                </form>
            </main>
        </Layout>
    );
};

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);

    if (cookies[OPERATOR_COOKIE]) {
        const operatorCookie = cookies[OPERATOR_COOKIE];
        const parsedOperatorCookie = JSON.parse(operatorCookie);

        if (parsedOperatorCookie.errorMessage) {
            const { errorMessage } = parsedOperatorCookie;
            return { props: { errors: [{ errorMessage, id: errorId }] } };
        }
    }

    return { props: {} };
};

export default Operator;
