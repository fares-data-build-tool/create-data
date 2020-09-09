import React, { ReactElement } from 'react';

const Help = (): ReactElement => {
    return (
        <>
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                <h1 className="govuk-fieldset__heading">Help and Support</h1>
            </legend>
            <p className="govuk-body">
                If you are having problems, please contact the Fares Data Build service via the link below:
                <div>
                    <a href="/contact" className="govuk-link">
                        Contact Us
                    </a>
                </div>
            </p>
        </>
    );
};

export default Help;
