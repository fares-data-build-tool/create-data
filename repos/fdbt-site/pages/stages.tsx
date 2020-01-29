import '../design/Pages.scss';
import React from 'react';
import { NextPageContext } from 'next';
import Layout from '../layout/Layout';
import { parseCookies } from 'nookies';
import { OPERATOR_COOKIE, SERVICE_COOKIE } from '../constants';
import { getHost, isSessionValid } from '../utils';
import TableForm from '../components/TableForm';


const title = 'Confirmation - Fares data build tool';
const description = 'Confirmation page of the Fares data build tool';

export interface ServiceProps {
  operator: string,
  service: string
}

const Stages = (props: ServiceProps) => {
    return (
      <Layout title={title} description={description}>
          <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
          <p className="govuk-body-l">Welcome operator {props.operator}</p>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="sort">
                Please submit your stages for your service {props.service}
              </label>
            </div>
            <TableForm offset={1} />
          </main>
      </Layout>
    );
}

Stages.getInitialProps = async (ctx: NextPageContext) => {
  function redirectOnError() {
    if (ctx.res) {
      ctx.res.writeHead(302, {
        Location: '/error'
      })
      ctx.res.end();
    }  
  };

  const cookies = parseCookies(ctx);
  const operatorCookie = cookies[OPERATOR_COOKIE];
  const serviceCookie = cookies[SERVICE_COOKIE];
  if(operatorCookie && serviceCookie) {
    const url: string = getHost(ctx.req) + "/api/validate";
    const isValid = await isSessionValid(url, ctx.req);
    if (isValid){
      const operatorObject = JSON.parse(operatorCookie);
      const serviceObject = JSON.parse(serviceCookie);
      return {operator: operatorObject.operator, service: serviceObject.service };
    } else {
      redirectOnError();
    }
  } else {
    redirectOnError();
  }
};

export default Stages;