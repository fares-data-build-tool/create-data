import React, { ReactElement } from 'react';
import { TxcSourceAttribute } from '../interfaces';
import CsrfForm from './CsrfForm';

interface SwitchDataSourceProps {
    dataSourceAttribute: TxcSourceAttribute;
    pageUrl: string;
    csrfToken: string;
}

const SwitchDataSource = ({ dataSourceAttribute, pageUrl, csrfToken }: SwitchDataSourceProps): ReactElement => {
    const { hasBods, hasTnds, source } = dataSourceAttribute;
    const buttonDisabled = (source === 'bods' && !hasTnds) || (source === 'tnds' && !hasBods);

    return (
        <CsrfForm action="/api/switchDataSource" method="post" csrfToken={csrfToken}>
            <>
                <input type="hidden" name="referer" value={pageUrl} />
                <button
                    id="change-data-source"
                    type="submit"
                    className="govuk-button govuk-button--secondary"
                    disabled={buttonDisabled}
                >
                    Change TransXChange datasource to {source === 'bods' ? 'TNDS' : 'BODS'}
                </button>
            </>
        </CsrfForm>
    );
};

export default SwitchDataSource;
