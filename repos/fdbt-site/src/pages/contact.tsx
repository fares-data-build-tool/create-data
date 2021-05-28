import React, { ReactElement } from 'react';
import { SUPPORT_EMAIL_ADDRESS, SUPPORT_PHONE_NUMBER } from '../constants';
import { BaseLayout } from '../layout/Layout';
import FileAttachment from '../components/FileAttachment';
import ServiceGuide from '../assets/files/Create-Fares-Data-Service-Guide.pdf';
import ServiceGuideFrontPage from '../assets/images/service-guide-front-page.png';

const title = 'Contact - Create Fares Data Service';
const description = 'Contact page for the Create Fares Data Service';

interface ContactProps {
    supportEmail: string;
    supportPhone: string;
}

const Contact = ({ supportEmail, supportPhone }: ContactProps): ReactElement => {
    return (
        <BaseLayout title={title} description={description} hideHelp>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <h1 className="govuk-heading-l">Contact the Create Fares Data Service team</h1>
                    <h2 className="govuk-heading-m">Feedback and support</h2>
                    <p className="govuk-body">
                        If you are experiencing technical issues, or if you have any suggestions, comments or
                        criticisms, please contact the Create Fares Data team through one of the channels below.
                    </p>
                    <p className="govuk-body">
                        The Help Desk is available Monday to Friday, 9am to 5pm (excluding Bank Holidays in England and
                        Wales, and the 24th of December).
                    </p>
                    <p className="govuk-body">The Help Desk can be contacted by telephone or email as follows.</p>
                    <p className="govuk-body">
                        Telephone: {supportPhone}
                        <br />
                        Email: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
                    </p>
                    <h3 className="govuk-heading-s">Related services</h3>
                    <p className="govuk-body">
                        If your query relates to the use of the Bus Open Data Service go&nbsp;
                        <a href="https://publish.bus-data.dft.gov.uk/" aria-label="go to the bus open data service">
                            here
                        </a>
                        &nbsp;to view their contact details
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
                    <h2 className="govuk-heading-s">Create Fares Data Service</h2>
                    <p className="govuk-body">
                        The Create Fares Data Service enables local bus operators in England to generate higher quality
                        fares information in an open data format
                    </p>
                </div>
                <div className="govuk-grid-column-one-third">
                    <h2 className="govuk-heading-s">Help documents</h2>
                    <FileAttachment
                        displayName="Create fares data service guide"
                        attachmentUrl={`${ServiceGuide}`}
                        imageUrl={ServiceGuideFrontPage}
                        size="8KB"
                    />
                </div>
            </div>
        </BaseLayout>
    );
};

export const getServerSideProps = (): {} => {
    return {
        props: {
            supportEmail: SUPPORT_EMAIL_ADDRESS || 'test@example.com',
            supportPhone: SUPPORT_PHONE_NUMBER || '0800 123 1234',
        },
    };
};

export default Contact;
