import '../design/Pages.scss';
import React from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE, SERVICE_COOKIE } from '../constants';

const title = 'Confirmation - Fares data build tool';
const description = 'Confirmation page of the Fares data build tool';

type ConfirmationProps = {
    operator: string;
    service: string;
};

const Confirmation = ({ operator, service }: ConfirmationProps) => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <h1 className="govuk-heading-xl">Confirmation</h1>
            <p className="govuk-body-l">
                Thank you {operator}, for submitting data for service {service}.
            </p>
        </main>
    </Layout>
);

Confirmation.getInitialProps = async (ctx: NextPageContext) => {
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const serviceCookie = cookies[SERVICE_COOKIE];
    const operatorObject = JSON.parse(operatorCookie);
    const serviceObject = JSON.parse(serviceCookie);
    if (operatorCookie && serviceCookie && operatorObject.uuid === serviceObject.uuid) {
        return { operator: operatorObject.operator, service: serviceObject.service };
    }

    if (ctx.res) {
        ctx.res.writeHead(302, {
            Location: '/error',
        });
        ctx.res.end();
    }

    return {};
};

export default Confirmation;
