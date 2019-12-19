import '../design/Layout.scss'
import React from "react";

export default class AlphaBanner extends React.Component {
    render() {
        return (
          <div className="govuk-phase-banner">
            <p className="govuk-phase-banner__content">
              <strong className="govuk-tag govuk-phase-banner__content__tag">
            alpha
          </strong>
              <span className="govuk-phase-banner__text">
                This is a new service – your <a className="govuk-link" href="mailto:fdbt@transportforthenorth.com">feedback</a> will help us to improve it.
              </span>
            </p>
          </div>
        );
    }
}
