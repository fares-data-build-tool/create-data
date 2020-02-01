import '../design/Layout.scss';
import React, { FC } from 'react';
import { FEEDBACK_LINK } from '../constants';

const AlphaBanner: FC = () => (
    <div className="govuk-phase-banner">
        <p className="govuk-phase-banner__content">
            <strong className="govuk-tag govuk-phase-banner__content__tag">alpha</strong>
            <span className="govuk-phase-banner__text">
                This is a new service – your{' '}
                <a className="govuk-link" id="feedback_link" href={FEEDBACK_LINK}>
                    feedback
                </a>{' '}
                will help us to improve it.
            </span>
        </p>
    </div>
);

export default AlphaBanner;
