import React from 'react';

export const GlobalSettingReturnHeader = () => (
    <div className="govuk-!-padding-top-2 govuk-!-padding-bottom-2" style={{ borderBottom: '4px solid yellow' }}>
        <div className="govuk-warning-text govuk-width-container govuk-!-margin-bottom-0">
            <span className="govuk-warning-text__icon" aria-hidden="true">
                !
            </span>
            <strong className="govuk-warning-text__text">
                Once you&apos;ve made your changes you can return to your fare creation
            </strong>
            <a
                href={`/globalSettingsRedirect`}
                className="govuk-button govuk-button--secondary"
                style={{ float: 'right', marginTop: '-32px' }}
            >
                Back
            </a>
        </div>
    </div>
);
