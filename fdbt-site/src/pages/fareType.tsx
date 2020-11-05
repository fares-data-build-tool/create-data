import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import { v4 as uuidv4 } from 'uuid';
import TwoThirdsLayout from '../layout/Layout';
import { FARE_TYPE_ATTRIBUTE, OPERATOR_COOKIE, INTERNAL_NOC, TICKET_REPRESENTATION_ATTRIBUTE } from '../constants';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import {
    setCookieOnServerSide,
    getAndValidateNoc,
    getCsrfToken,
    getAndValidateSchemeOpRegion,
    isSchemeOperator,
} from '../utils/index';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import logger from '../utils/logger';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import { isFareTypeAttributeWithErrors } from '../interfaces/typeGuards';
import { redirectTo } from './api/apiUtils';

const title = 'Fare Type - Create Fares Data Service ';
const description = 'Fare Type selection page of the Create Fares Data Service';

const errorId = 'fare-type-single';

type FareTypeProps = {
    operatorName: string;
    errors: ErrorInfo[];
    csrfToken: string;
};

export const buildUuid = (noc: string): string => {
    const uuid = uuidv4();

    return noc + uuid.substring(0, 8);
};

const FareTypePage = ({ operatorName, errors = [], csrfToken }: FareTypeProps): ReactElement => {
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
                                {operatorName}
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
                                    <div className="govuk-radios__item">
                                        <input
                                            className="govuk-radios__input"
                                            id="fare-type-multi-operator"
                                            name="fareType"
                                            type="radio"
                                            value="multiOperator"
                                        />
                                        <label
                                            className="govuk-label govuk-radios__label"
                                            htmlFor="fare-type-multi-operator"
                                        >
                                            Multi-operator - A ticket that covers more than one operator
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

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: FareTypeProps } => {
    const cookies = parseCookies(ctx);
    const csrfToken = getCsrfToken(ctx);

    const schemeOp = isSchemeOperator(ctx);
    let opIdentifier = getAndValidateSchemeOpRegion(ctx) || getAndValidateNoc(ctx);

    const operatorCookie = cookies[OPERATOR_COOKIE];

    if (!operatorCookie || !opIdentifier) {
        throw new Error('Necessary data not found to show faretype page');
    }
    const operatorInfo = JSON.parse(operatorCookie);
    const operatorName = schemeOp ? operatorInfo.operator : operatorInfo.operator.operatorPublicName;
    opIdentifier = schemeOp ? operatorName : opIdentifier;
    const uuid = buildUuid(opIdentifier);
    const cookieValue = JSON.stringify({ ...operatorInfo, uuid });

    setCookieOnServerSide(ctx, OPERATOR_COOKIE, cookieValue);

    if (schemeOp || opIdentifier !== INTERNAL_NOC) {
        logger.info('', {
            context: 'pages.fareType',
            message: 'transaction start',
        });
    }

    if (schemeOp && ctx.res) {
        updateSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE, { fareType: 'multiOperator' });
        updateSessionAttribute(ctx.req, TICKET_REPRESENTATION_ATTRIBUTE, { name: 'geoZone' });
        redirectTo(ctx.res, '/passengerType');
    }

    const fareTypeAttribute = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE);

    const errors: ErrorInfo[] =
        fareTypeAttribute && isFareTypeAttributeWithErrors(fareTypeAttribute) ? fareTypeAttribute.errors : [];

    return { props: { operatorName, errors, csrfToken } };
};

export default FareTypePage;
