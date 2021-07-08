import React, { ReactElement } from 'react';
import { FEEDBACK_LINK } from '../constants';

const PhaseBanner = (): ReactElement => (
    <div className="app-phase-banner__wrapper">
        <div className="govuk-phase-banner app-phase-banner app-width-container">
            <p className="govuk-phase-banner__content">
                <strong className="govuk-tag govuk-phase-banner__content__tag">beta</strong>
                <span className="govuk-phase-banner__text">
                    This is a new service – your{' '}
                    <a className="govuk-link" href={FEEDBACK_LINK}>
                        feedback
                    </a>{' '}
                    will help us to improve it.
                </span>
            </p>
        </div>
    </div>
);

export default PhaseBanner;
