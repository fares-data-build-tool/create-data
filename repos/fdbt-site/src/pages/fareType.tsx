import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import { v4 as uuidv4 } from 'uuid';
import TwoThirdsLayout from '../layout/Layout';
import { FARE_TYPE_COOKIE, OPERATOR_COOKIE } from '../constants';
import { ErrorInfo, CustomAppProps } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import { deleteCookieOnServerSide, setCookieOnServerSide, getAttributeFromIdToken } from '../utils/index';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import logger from '../utils/logger';

const title = 'Fare Type - Fares Data Build Tool';
const description = 'Fare Type selection page of the Fares Data Build Tool';

const errorId = 'fare-type-error';

type FareTypeProps = {
    operator: string;
    errors: ErrorInfo[];
};

export const buildUuid = (ctx: NextPageContext): string => {
    const uuid = uuidv4();
    const noc = getAttributeFromIdToken(ctx, 'custom:noc');
    return noc + uuid.substring(0, 8);
};

const FareType = ({ operator, errors = [], csrfToken }: FareTypeProps & CustomAppProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/fareType" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="fare-type-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="fare-type-page-heading">
                                    Select a fare type
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="fare-type-operator-hint">
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
                                            id="fare-type-flat-fare"
                                            name="fareType"
                                            type="radio"
                                            value="flatFare"
                                        />
                                        <label
                                            className="govuk-label govuk-radios__label"
                                            htmlFor="fare-type-flat-fare"
                                        >
                                            Flat Fare Ticket - Single Journey
                                        </label>
                                    </div>
                                </div>
                            </FormElementWrapper>
                        </fieldset>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
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
    const uuid = buildUuid(ctx);
    const cookieValue = JSON.stringify({ operator, uuid });

    setCookieOnServerSide(ctx, OPERATOR_COOKIE, cookieValue);

    logger.info({
        context: 'pages.fareType',
        message: 'transaction start',
    });

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
