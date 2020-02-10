import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE, SERVICE_COOKIE } from '../constants';
import { getHost, isSessionValid } from '../utils';
import TableForm from '../components/TableForm';

const title = 'Confirmation - Fares data build tool';
const description = 'Confirmation page of the Fares data build tool';

type StagesProps = {
    operator: string;
    service: string;
};

const Stages = ({ operator, service }: StagesProps): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <p className="govuk-body-l">Welcome operator {operator}</p>
            <div className="govuk-form-group">
                <label className="govuk-label" htmlFor="sort">
                    Please submit your stages for your service {service}
                </label>
            </div>
            <TableForm offset={1} />
        </main>
    </Layout>
);

Stages.getInitialProps = async (ctx: NextPageContext): Promise<{}> => {
    const redirectOnError = (): void => {
        if (ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/error',
            });
            ctx.res.end();
        }
    };

    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const serviceCookie = cookies[SERVICE_COOKIE];
    if (operatorCookie && serviceCookie) {
        const url = `${getHost(ctx.req)}/api/validate`;
        const isValid = await isSessionValid(url, ctx.req);
        if (isValid) {
            const operatorObject = JSON.parse(operatorCookie);
            const serviceObject = JSON.parse(serviceCookie);
            return {
                operator: operatorObject.operator,
                service: serviceObject.service,
            };
        }
        redirectOnError();
    }
    redirectOnError();

    return {};
};

export default Stages;
