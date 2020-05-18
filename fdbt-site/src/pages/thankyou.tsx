import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import Layout from '../layout/Layout';
import { FEEDBACK_LINK } from '../constants';
import { getUuidFromCookies, deleteAllCookiesOnServerSide } from '../utils';

const title = 'Thank You - Fares Data Build Tool';
const description = 'Thank you page for the Fares Data Build Tool';

type ThankYouProps = {
    uuid: string;
};

const ThankYou = ({ uuid }: ThankYouProps): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper govuk-main-wrapper--l" id="main-content" role="main">
            <div className="govuk-grid-row">
                <div className="govuk-panel govuk-panel--confirmation">
                    <h1 className="govuk-panel__title" id="thank-you-page-heading">
                        Upload complete
                    </h1>
                    <div className="govuk-panel__body" id="uuid-ref-number">
                        Your reference number
                        <br />
                        <strong>{uuid}</strong>
                    </div>
                </div>
                <h2 className="govuk-heading-m">What happens next</h2>
                <p className="govuk-body">Thank you for submitting your fares data.</p>
                <p className="govuk-body">
                    Your data will be converted to the NeTEx format and published to the open data hub. You will be
                    contacted should there be a problem with your upload.
                </p>
                <p className="govuk-body">
                    If you would like to provide feedback on this service, please click{' '}
                    <a href={FEEDBACK_LINK} className="govuk-link">
                        here
                    </a>
                </p>
                <br />
                <a
                    href="/"
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

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const uuid = getUuidFromCookies(ctx);
    deleteAllCookiesOnServerSide(ctx);
    return { props: { uuid } };
};

export default ThankYou;
