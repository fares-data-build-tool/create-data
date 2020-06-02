import React, { FC } from 'react';

const Footer: FC = () => (
    <footer className="govuk-footer " role="contentinfo">
        <div className="govuk-width-container ">
            <div className="govuk-footer__meta">
                <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
                    <h2 className="govuk-visually-hidden">Support links</h2>
                    <ul className="govuk-footer__inline-list">
                        <li className="govuk-footer__inline-list-item">
                            <a className="govuk-footer__link" href="https://www.gov.uk/help">
                                Help
                            </a>
                        </li>
                        <li className="govuk-footer__inline-list-item">
                            <a className="govuk-footer__link" href="https://www.gov.uk/help/cookies">
                                Cookies
                            </a>
                        </li>
                        <li className="govuk-footer__inline-list-item">
                            <a className="govuk-footer__link" href="https://www.gov.uk/contact">
                                Contact
                            </a>
                        </li>
                        <li className="govuk-footer__inline-list-item">
                            <a className="govuk-footer__link" href="https://www.gov.uk/help/terms-conditions">
                                Terms and conditions
                            </a>
                        </li>
                    </ul>
                    <div className="govuk-footer__meta-custom">
                        Built by{' '}
                        <a
                            href="https://transportforthenorth.com/"
                            className="govuk-footer__link"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Transport for the North
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
