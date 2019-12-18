import '../design/Pages.scss'
import React from 'react';
import { NextPageContext } from 'next'
import Layout from '../layout/Layout'
import { parseCookies } from 'nookies';
import { OPERATOR_COOKIE, SERVICE_COOKIE } from '../constants';

const title = 'Confirmation - Fares data build tool';
const description = 'Confirmation page of the Fares data build tool';

export interface ConfirmationProps {
  operator: string,
  service: string
}

const Confirmation = (props: ConfirmationProps) => {
    return (
      <Layout title={title} description={description}>
          <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <h1 className="govuk-heading-xl">Confirmation</h1>
            <p className="govuk-body-l">Thank you {props.operator}, for submitting data for service {props.service}.</p>
          </main>
      </Layout>
    );
}

Confirmation.getInitialProps = async (ctx: NextPageContext) => {
  const cookies = parseCookies(ctx);
  const operatorCookie = cookies[OPERATOR_COOKIE];
  const serviceCookie = cookies[SERVICE_COOKIE];
  const operatorObject = JSON.parse(operatorCookie);
  const serviceObject = JSON.parse(serviceCookie);
  if(operatorCookie && serviceCookie && operatorObject.uuid == serviceObject.uuid){
    return {operator: operatorObject.operator, service: serviceObject.service};
  } else{
    ctx.res.writeHead(302, {
      Location: '/error'
    });
    ctx.res.end();
    return {};
  }
};


export default Confirmation;