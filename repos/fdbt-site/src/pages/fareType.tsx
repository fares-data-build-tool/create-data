import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import TwoThirdsLayout from '../layout/Layout';
import { FARE_TYPE_COOKIE, OPERATOR_COOKIE } from '../constants';
import { ErrorInfo } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import { deleteCookieOnServerSide } from '../utils/index';
import FormElementWrapper from '../components/FormElementWrapper';

const title = 'Fare Type - Fares Data Build Tool';
const description = 'Fare Type selection page of the Fares Data Build Tool';

const errorId = 'fare-type-error';

type FareTypeProps = {
    operator: string;
    errors: ErrorInfo[];
};

const FareType = ({ operator, errors = [] }: FareTypeProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <form action="/api/fareType" method="post">
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <fieldset className="govuk-fieldset" aria-describedby="fare-type-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="fare-type-page-heading">
                                Select a fare type
                            </h1>
                        </legend>
                        <span className="govuk-hint" id="faretype-operator-hint">
                            {operator}
                        </span>
                        <FormElementWrapper errors={errors} errorId={errorId} errorClass="govuk-radios--error">
                            <div className="govuk-radios">
                                <div className="govuk-radios__item">
                                    <input
                                        className="govuk-radios__input"
                                        id="fare-type-single"
                                        name="fareType"
                                        type="radio"
                                        value="single"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="fare-type-single">
                                        Single Ticket - Point to Point
                                    </label>
                                </div>
                                <div className="govuk-radios__item">
                                    <input
                                        className="govuk-radios__input"
                                        id="fare-type-period"
                                        name="fareType"
                                        type="radio"
                                        value="period"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="fare-type-period">
                                        Period Ticket (Day, Week, Month and Annual)
                                    </label>
                                </div>
                                <div className="govuk-radios__item">
                                    <input
                                        className="govuk-radios__input"
                                        id="fare-type-return"
                                        name="fareType"
                                        type="radio"
                                        value="return"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="fare-type-return">
                                        Return Ticket - Single Service
                                    </label>
                                </div>
                                <div className="govuk-radios__item">
                                    <input
                                        className="govuk-radios__input"
                                        id="fare-type-flatFare"
                                        name="fareType"
                                        type="radio"
                                        value="flatFare"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="fare-type-flatFare">
                                        Flat Fare Ticket - Single Journey
                                    </label>
                                </div>
                            </div>
                        </FormElementWrapper>
                    </fieldset>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </form>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);

    const operatorCookie = cookies[OPERATOR_COOKIE];

    if (!operatorCookie) {
        throw new Error('Necessary cookies not found to show faretype page');
    }

    const operatorInfo = JSON.parse(operatorCookie);
    const { operator } = operatorInfo;

    if (cookies[FARE_TYPE_COOKIE]) {
        const fareTypeCookie = cookies[FARE_TYPE_COOKIE];
        const parsedFareTypeCookie = JSON.parse(fareTypeCookie);

        if (parsedFareTypeCookie.errorMessage) {
            const { errorMessage } = parsedFareTypeCookie;
            deleteCookieOnServerSide(ctx, FARE_TYPE_COOKIE);
            return { props: { operator: operator.operatorPublicName, errors: [{ errorMessage, id: errorId }] } };
        }
    }

    return { props: { operator: operator.operatorPublicName } };
};

export default FareType;
