import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';

const title = 'Contact - Fares Data Build Tool';
const description = 'Contact page for the Fares Data Build Tool';

const Contact = (): ReactElement => {
    return (
        <BaseLayout title={title} description={description}>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <h1 className="govuk-heading-l">Contact the Fares Data Build Tool team</h1>
                    <h2 className="govuk-heading-m">Feedback and support</h2>
                    <p className="govuk-body">
                        If you are experiencing technical issues, please contact the Fares Data Build service through
                        the channels below
                    </p>
                    <span className="govuk-body govuk-!-font-weight-bold">By phone</span>
                    <p className="govuk-body">
                        Fares Data Build Tool support line:
                        <br />
                        Telephone: 0800 464 3290
                        <br />
                        Monday to Friday, 9:00am to 5:00pm
                    </p>
                    <span className="govuk-body govuk-!-font-weight-bold">By email</span>
                    <p className="govuk-body">
                        If you have any suggestions, comments or criticisms, please send an email to:&nbsp;
                        <a href="mailto:fdbt-support@infinityworks.com">fdbt-support@infinityworks.com</a>
                    </p>
                </div>
                <div className="govuk-grid-column-one-third">
                    <h2 className="govuk-heading-m">Fares Data Build Tool</h2>
                    <p className="govuk-body">
                        The Fares Data Build tool enables local bus operators in England to generate higher quality
                        fares information in an open data format
                    </p>
                </div>
            </div>
        </BaseLayout>
    );
};

export default Contact;
