import React, { ReactElement } from 'react';

const Help = (): ReactElement => {
    return (
        <div>
            <h2 className="govuk-heading-s">Help and Support</h2>
            <p className="govuk-body">
                If you are having problems, please contact the Create Fares Data Service via the link below:
                <div>
                    <a href="/contact" className="govuk-link govuk-!-font-size-19">
                        Contact Us
                    </a>
                </div>
            </p>
        </div>
    );
};

export default Help;
