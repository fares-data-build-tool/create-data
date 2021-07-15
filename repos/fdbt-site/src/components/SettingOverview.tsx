import React, { ReactElement } from 'react';
import { SettingsOverview } from '../interfaces';

const SettingOverview = ({ name, description, count }: SettingsOverview): ReactElement => {
    return (
        <>
            <a href={'/viewPassengerTypes'} className="setting-record">
                <p className="govuk-body-s govuk-!-font-weight-bold">
                    {name}
                    <b className="numberCircle">{count}</b>
                    {count === 0 ? null : <strong className="govuk-tag customised-tag">CUSTOMISED</strong>}
                </p>
                <p className="govuk-body-s">{description}</p>
            </a>
            <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible"></hr>
        </>
    );
};

export default SettingOverview;
