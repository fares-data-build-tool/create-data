import '../design/Pages.scss';
import React from 'react';
import { NextPageContext } from 'next';
import Layout from '../layout/Layout';
import { parseCookies } from 'nookies';
import { OPERATOR_COOKIE, SERVICE_COOKIE } from '../constants';
import Router from 'next/router';

const title = 'Confirmation - Fares data build tool';
const description = 'Confirmation page of the Fares data build tool';

export interface ServiceProps {
  operator: string,
  service: string
}

const Operator = (props: ServiceProps) => {
    return (
      <Layout title={title} description={description}>
          <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
          <p className="govuk-body-l">Welcome operator {props.operator}</p>
          <form action="/api/stages" method="post" >
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="sort">
              Please submit your stages for your service {props.service}
            </label>
          </div>
            <input type="submit" value="Submit" className="govuk-button govuk-button--start" />
          </form>
          </main>
      </Layout>
    );
}

Operator.getInitialProps = async (ctx: NextPageContext) => {
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
    Router.push('/error')
    return {};
  }
};

export default Operator;