import '../design/Pages.scss';
import React from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE, SERVICE_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';

const title = 'Confirmation - Fares data build tool';
const description = 'Confirmation page of the Fares data build tool';

type ServiceProps = {
    operator: string;
};

const Operator = ({ operator }: ServiceProps) => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <p className="govuk-body-l">Welcome operator {operator}</p>
            <form action="/api/service" method="post">
                <div className="govuk-form-group">
                    <label className="govuk-label" htmlFor="service">
                        Please select your service
                        <select className="govuk-select" id="service" name="service">
                            <option value="N1">N1</option>
                            <option value="13A" selected>
                                13A
                            </option>
                            <option value="12">12</option>
                            <option value="3">3</option>
                        </select>
                    </label>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button govuk-button--start" />
            </form>
        </main>
    </Layout>
);

Operator.getInitialProps = async (ctx: NextPageContext) => {
    deleteCookieOnServerSide(ctx, SERVICE_COOKIE);

    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];

    if (operatorCookie) {
        const operatorObject = JSON.parse(operatorCookie);
        return { operator: operatorObject.operator };
    }

    if (ctx.res) {
        ctx.res.writeHead(302, {
            Location: '/error',
        });
        ctx.res.end();
    }

    return {};
};

export default Operator;
