import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { FARETYPE_COOKIE } from '../constants';
import { ErrorInfo } from '../types';
import ErrorSummary from '../components/ErrorSummary';
import { deleteCookieOnServerSide, buildTitle } from '../utils/index';

const title = 'FareType - Fares data build tool';
const description = 'Fare Type selection page of the Fares data build tool';

type FareTypeProps = {
    errors: ErrorInfo[];
};

const FareType = ({ errors = [] }: FareTypeProps): ReactElement => {
    return (
        <Layout title={buildTitle(errors, title)} description={description}>
            <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
                <form action="/api/fareType" method="post">
                    <ErrorSummary errorHref="#fareType-page-heading" errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="fareType-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                                <h1 className="govuk-fieldset__heading" id="fareType-page-heading">
                                    What type of fare would you like to provide?
                                </h1>
                                {errors.length > 0 && (
                                    <span id="fareType-error" className="govuk-error-message error-message-padding">
                                        <span>{errors[0].errorMessage}</span>
                                    </span>
                                )}
                            </legend>
                            <div className="govuk-radios">
                                <div className="govuk-radios__item">
                                    <input
                                        className={`govuk-radios__input ${
                                            errors.length > 0 ? 'govuk-input--error' : ''
                                        } `}
                                        id="fareType-single"
                                        name="fareType"
                                        type="radio"
                                        value="single"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="fareType-single">
                                        Single - Point to Point
                                    </label>
                                </div>
                                <div className="govuk-radios__item">
                                    <input
                                        className={`govuk-radios__input ${
                                            errors.length > 0 ? 'govuk-input--error' : ''
                                        } `}
                                        id="fareType-period"
                                        name="fareType"
                                        type="radio"
                                        value="period"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="fareType-period">
                                        Period Tickets
                                    </label>
                                </div>
                                <div className="govuk-radios__item">
                                    <input
                                        className={`govuk-radios__input ${
                                            errors.length > 0 ? 'govuk-input--error' : ''
                                        } `}
                                        id="fareType-return"
                                        name="fareType"
                                        type="radio"
                                        value="return"
                                        disabled
                                        aria-disabled="true"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="fareType-return">
                                        Return
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <input
                        type="submit"
                        value="Continue"
                        id="continue-button"
                        className="govuk-button govuk-button--start"
                    />
                </form>
            </main>
        </Layout>
    );
};

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);

    if (cookies[FARETYPE_COOKIE]) {
        const fareTypeCookie = unescape(decodeURI(cookies[FARETYPE_COOKIE]));
        const parsedFareTypeCookie = JSON.parse(fareTypeCookie);

        if (parsedFareTypeCookie.errorMessage) {
            const { errorMessage } = parsedFareTypeCookie;
            deleteCookieOnServerSide(ctx, FARETYPE_COOKIE);
            return { props: { errors: [{ errorMessage }] } };
        }
    }

    return { props: {} };
};

export default FareType;
