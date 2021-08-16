import React, { FunctionComponent } from 'react';

export const GlobalSettingReturnHeader: FunctionComponent = () => (
    <div className="govuk-warning-text govuk-width-container govuk-!-margin-bottom-0">
        <div
            className="govuk-notification-banner"
            role="region"
            aria-labelledby="govuk-notification-banner-title"
            data-module="govuk-notification-banner"
            style={{ margin: '24px -15px 0' }}
        >
            <div className="govuk-notification-banner__header" />
            <div
                className="govuk-notification-banner__content"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <p className="govuk-heading-s govuk-!-margin-0">
                    Once you&apos;ve made your changes you can return to your fare creation.
                </p>
                <a
                    href={`/globalSettingsRedirect`}
                    className="govuk-button govuk-button--secondary"
                    style={{ alignSelf: 'flex-start' }}
                >
                    Back
                </a>
            </div>
        </div>
    </div>
);
