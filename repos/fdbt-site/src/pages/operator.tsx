import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';

const title = 'Operator - Fares data build tool';
const description = 'Operator selection page of the Fares data build tool';

type Operator = {
    operatorName: string;
    nocCode: string;
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

const Operator = (): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/operator" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading" id="page-heading">
                                Which operator are you representing?
                            </h1>
                        </legend>
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

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async (ctx: NextPageContext): Promise<{}> => {
    deleteCookieOnServerSide(ctx, OPERATOR_COOKIE);
    return { props: {} };
};

export default Operator;
