import React, { ReactElement } from 'react';
import { FEEDBACK_LINK } from '../constants';

const PhaseBanner = (): ReactElement => (
    <div className="govuk-phase-banner">
        <p className="govuk-phase-banner__content">
            <strong className="govuk-tag govuk-phase-banner__content__tag">beta</strong>
            <span className="govuk-phase-banner__text">
                This is a new service – your{' '}
                <a className="govuk-link" id="feedback-link" href={FEEDBACK_LINK}>
                    feedback
                </a>{' '}
                will help us to improve it.
            </span>
        </p>
    </div>
);

export default PhaseBanner;
