import React, { ReactElement } from 'react';
import { SUPPORT_EMAIL_ADDRESS, SUPPORT_PHONE_NUMBER } from '../constants';
import { BaseLayout } from '../layout/Layout';

const title = 'Contact - Create Fares Data Service';
const description = 'Contact page for the Create Fares Data Service';

const Contact = (): ReactElement => {
    return (
        <BaseLayout title={title} description={description} hideHelp>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <h1 className="govuk-heading-l">Contact the Create Fares Data Service team</h1>
                    <h2 className="govuk-heading-m">Feedback and support</h2>
                    <p className="govuk-body">
                        If you are experiencing technical issues, please contact the Create Fares Data team through the
                        channels below
                    </p>
                    <h3 className="govuk-heading-s">By phone</h3>
                    <p className="govuk-body">
                        Create Fares Data Service support line:
                        <br />
                        Telephone: {SUPPORT_PHONE_NUMBER}
                        <br />
                        Monday to Friday, 9:00am to 5:00pm
                    </p>
                    <h3 className="govuk-heading-s">By email</h3>
                    <p className="govuk-body">
                        If you have any suggestions, comments or criticisms, please send an email to:&nbsp;
                        <a href={`mailto:${SUPPORT_EMAIL_ADDRESS}`}>{SUPPORT_EMAIL_ADDRESS}</a>
                    </p>
                    <h3 className="govuk-heading-s">Related services</h3>
                    <p className="govuk-body">
                        If your query relates to the use of the Bus Open Data Service go&nbsp;
                        <a href="https://publish.bus-data.dft.gov.uk/" aria-label="go to the bus open data service">
                            here
                        </a>
                        &nbsp;to view their contact details.
                    </p>
                    <h3 className="govuk-heading-s">Feedback</h3>
                    <p className="govuk-body">
                        To help improve the Create Fares Data service, send us your feedback&nbsp;
                        <a href="/feedback" aria-label="send feedback">
                            here
                        </a>
                    </p>
                </div>
                <div className="govuk-grid-column-one-third">
                    <h2 className="govuk-heading-m">Create Fares Data Service</h2>
                    <p className="govuk-body">
                        The Create Fares Data Service enables local bus operators in England to generate higher quality
                        fares information in an open data format
                    </p>
                </div>
            </div>
        </BaseLayout>
    );
};

export const getServerSideProps = (): {} => {
    return { props: {} };
};

export default Contact;
