import '../../design/Pages.scss';
import React from 'react'
import Layout from '../../layout/Layout'
import { NextPageContext } from 'next';

const title = 'Cookies on GOV.UK';
const description = 'Cookies on GOV.UK';

const Cookies = () => {
  return (
    <Layout title={title} description={description}>
      <div className="govuk-width-container">
        <a href="/" className="govuk-back-link">Back</a>

        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
          <h1 className="govuk-heading-l">Cookies on GOV.UK</h1>
          <div className="govuk-body-s" data-module="govspeak">
            <p >Cookies are files saved on your phone, tablet or computer when you visit a website.</p>
            <p>We use cookies to store information about how you use the GOV.UK website, such as the pages you visit.</p>
          </div>

          <h2 className="govuk-heading-l">Cookies settings</h2>
          <div className="govuk-body-s" data-module="govspeak">
            <p>We use Javascript to set most of our cookies. Unfortunately Javascript is not running on your browser, so you cannot change your settings. You can try:</p>
            <ul>
              <li>reloading the page</li>
              <li>turning on Javascript in your browser</li>
            </ul>
          </div>
          <h2 className="govuk-heading-l">Government services</h2>
          <div className="govuk-body-s"data-module="govspeak">
            <p >Most services we link to are run by different government departments, for example DWP’s Universal Credit online, DVLA’s vehicle tax service, or HMRC’s webchat.
              These services may set additional cookies and, if so, will have their own cookie policy and banner linking to it.</p>
          </div>
        </main>
      </div>
    </Layout>
  )
}

Cookies.getInitialProps = async (ctx: NextPageContext) => {
  return{};
};

export default Cookies