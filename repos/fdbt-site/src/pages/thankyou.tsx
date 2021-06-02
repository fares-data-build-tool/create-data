import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import { decode } from 'jsonwebtoken';
import TwoThirdsLayout from '../layout/Layout';
import { FEEDBACK_LINK, ID_TOKEN_COOKIE, INTERNAL_NOC } from '../constants';
import { getUuidFromSession, getAttributeFromIdToken, deleteAllCookiesOnServerSide } from '../utils';
import { CognitoIdToken, NextPageContextWithSession } from '../interfaces';
import logger from '../utils/logger';
import { regenerateSession } from '../utils/sessions';

const title = 'Thank You - Create Fares Data Service';
const description = 'Thank you page for the Create Fares Data Service';

interface ThankYouProps {
    uuid: string;
    emailAddress: string;
}

const ThankYou = ({ uuid, emailAddress }: ThankYouProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description}>
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
            Your data will be converted to the NeTEx format and will be emailed to <strong>{emailAddress}</strong>{' '}
            within the next 5 minutes for the fares you have just told us about.
        </p>
        <p className="govuk-body">You will be contacted should there be a problem with your upload.</p>
        <h2 className="govuk-heading-m">Your options</h2>
        <p className="govuk-body">
            You now have two options; you can add another fare using this service, or you can continue to the Bus Open
            Data Service (BODS) to upload your NeTEx file.
        </p>
        <p className="govuk-body">
            If you would like to provide feedback on this service, please click&nbsp;
            <a href={FEEDBACK_LINK} className="govuk-link" aria-label="Provide feedback on this service">
                here
            </a>
        </p>
        <br />
        <a href="/home" role="button" draggable="false" className="govuk-button" data-module="govuk-button">
            Add another fare
        </a>
        <a
            href="https://publish.bus-data.dft.gov.uk/"
            role="button"
            draggable="false"
            className="govuk-button govuk-button--secondary govuk-!-margin-left-3"
            data-module="govuk-button"
            aria-label="continue to bods"
        >
            Continue to BODS
        </a>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): {} => {
    const uuid = getUuidFromSession(ctx);
    const noc = getAttributeFromIdToken(ctx, 'custom:noc');

    if (noc !== INTERNAL_NOC) {
        logger.info('', { context: 'pages.thankyou', message: 'transaction complete', uuid });
    }

    const cookies = parseCookies(ctx);
    const idToken = cookies[ID_TOKEN_COOKIE];
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    if (!decodedIdToken.email) {
        throw new Error('Could not extract the user email address from their ID token');
    }

    if (ctx.req) {
        regenerateSession(ctx.req);
        deleteAllCookiesOnServerSide(ctx);
    }

    return { props: { uuid, emailAddress: decodedIdToken.email } };
};

export default ThankYou;
