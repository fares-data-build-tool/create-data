import '../design/Pages.scss'
import React from 'react';
import { NextPageContext } from 'next'
import Layout from '../layout/Layout'

const title = 'Error - Fares data build tool';
const description = 'Error page of the Fares data build tool';

const Error = () => {
    return (
      <Layout title={title} description={description}>
          <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <h1 className="govuk-heading-xl">ERROR</h1>
          </main>
      </Layout>
    );
}

Error.getInitialProps = async (ctx: NextPageContext) => {
    return {};
};

export default Error;