import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { FEEDBACK_LINK, SERVICE_COOKIE } from '../constants';

const title = 'Thank You - Fares data build tool';
const description = 'Thank you page for the Fares Data Build Tool';

type ThankyouProps = {
    uuid: string;
};

const Thankyou = ({ uuid }: ThankyouProps): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper govuk-main-wrapper--l" id="main-content" role="main">
            <div className="govuk-grid-row">
                <div className="govuk-panel govuk-panel--confirmation">
                    <h1 className="govuk-panel__title">Application complete</h1>
                    <div className="govuk-panel__body">
                        Your reference number
                        <br />
                        <strong>{uuid}</strong>
                    </div>
                </div>
                <h2 className="govuk-heading-m">What happens next</h2>
                <p className="govuk-body">Thank you, we&apos;ve submitted your fares data.</p>
                <p className="govuk-body">
                    We will contact you should there be any problem with the data you&apos;ve provided. Your data will
                    be converted to the NeTEx format and published.
                </p>
                <p className="govuk-body">
                    <a href={FEEDBACK_LINK} className="govuk-link">
                        What did you think of this service?
                    </a>
                </p>
                <br />
                <a
                    href="/index"
                    role="button"
                    draggable="false"
                    className="govuk-button govuk-button--start"
                    data-module="govuk-button"
                >
                    Add another fare
                </a>
            </div>
        </main>
    </Layout>
);

Thankyou.getInitialProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);
    const serviceCookie = cookies[SERVICE_COOKIE];
    if (serviceCookie) {
        const serviceObject = JSON.parse(serviceCookie);
        return {
            uuid: serviceObject.uuid,
        };
    }

    return {};
};

export default Thankyou;
