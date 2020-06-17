import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';

const title = 'Contact Us- Fares Data Build Tool';
const description = 'Contact Us page for the Fares Data Build Tool';

const ContactUs = (): ReactElement => {
    return (
        <BaseLayout title={title} description={description}>
            <div className="govuk-grid-row">
                <h1 className="govuk-heading-xl">Contact the Fares Data Build Service</h1>
                <div className="govuk-grid-column-two-thirds">
                    <h2 className="govuk-heading-m">Feedback and support</h2>
                    <p className="govuk-body">
                        If you are experiencing technical issues, please contact the Fares Data Build service through
                        the channels below
                    </p>
                    <span className="govuk-body">By email</span>
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

export default ContactUs;
