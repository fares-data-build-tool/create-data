import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPageContext, NextPage } from 'next';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';

const title = 'Operator - Fares data build tool';
const description = 'Operator selection page of the Fares data build tool';

const hardCodedOperators = [
    {OperatorName:"Connexions Buses",
        NOCCode:"HCTY"},
    {OperatorName:"Durham County Council",
        NOCCode:"DCCL"},
    // TODO: Find correct NOC
    {OperatorName:"Lancashire County Council",
        NOCCode:"PLACEHOLDERLANCASHIRE"},
    {OperatorName:"Manchester Community Transport",
        NOCCode:"MCTR"},
    {OperatorName:"Pilkington Bus",
        NOCCode:"KNGT"},
    {OperatorName:"TLC Travel",
        NOCCode:"TLCT"},
    // TODO: Find correct NOC
    {OperatorName:"Transport for Greater Manchester",
        NOCCode:"PLACEHOLDERTFGM"},

];

const getOperators = (operators:any[]): ReactElement[] => {
    const operatorsDivs:any[] = [];
    for (let operator = 0; operator < operators.length; operator+=1){
        operatorsDivs.push(<div className="govuk-radios__item">
            <input
            className="govuk-radios__input"
            id={`operator-name${operator}`}
            name="operator"
            type="radio"
            value={JSON.stringify(operators[operator])}
        />
            <label className="govuk-label govuk-radios__label" htmlFor={`operator-name${operator}`}>
                {`${operators[operator].OperatorName}`}
            </label>
        </div>)
    }

    return operatorsDivs;
}

const Operator: NextPage = () => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/operator" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="operator-name-hint">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading">
                                Which operator are you representing?
                            </h1>
                        </legend>
                        <span id="operator-name-hint" className="govuk-hint">
                            Select one option.
                        </span>
                        <div className="govuk-radios">
                            {getOperators(hardCodedOperators)}
                        </div>
                    </fieldset>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button govuk-button--start" />
            </form>
        </main>
    </Layout>
);

Operator.getInitialProps = async (ctx: NextPageContext) => {
    deleteCookieOnServerSide(ctx, OPERATOR_COOKIE);
    return {};
};

export default Operator;
