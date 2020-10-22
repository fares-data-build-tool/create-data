import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import { v4 as uuidv4 } from 'uuid';
import TwoThirdsLayout from '../layout/Layout';
import { FARE_TYPE_ATTRIBUTE, OPERATOR_COOKIE, INTERNAL_NOC } from '../constants';
import { ErrorInfo, CustomAppProps, NextPageContextWithSession } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import { setCookieOnServerSide, getAndValidateNoc } from '../utils/index';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import logger from '../utils/logger';
import { getSessionAttribute } from '../utils/sessions';
import { isFareTypeAttributeWithErrors } from '../interfaces/typeGuards';

const title = 'Fare Type - Create Fares Data Service ';
const description = 'Fare Type selection page of the Create Fares Data Service';

const errorId = 'fare-type-single';

type FareTypeProps = {
    operator: string;
    errors: ErrorInfo[];
};

export const buildUuid = (noc: string): string => {
    const uuid = uuidv4();

    return noc + uuid.substring(0, 8);
};

const FareTypePage = ({ operator, errors = [], csrfToken }: FareTypeProps & CustomAppProps): ReactElement => {
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

export const getServerSideProps = (ctx: NextPageContextWithSession): {} => {
    const cookies = parseCookies(ctx);

    const operatorCookie = cookies[OPERATOR_COOKIE];
    const noc = getAndValidateNoc(ctx);

    if (!operatorCookie || !noc) {
        throw new Error('Necessary data not found to show faretype page');
    }
    const operatorInfo = JSON.parse(operatorCookie);
    const uuid = buildUuid(noc);
    const cookieValue = JSON.stringify({ ...operatorInfo, uuid });

    setCookieOnServerSide(ctx, OPERATOR_COOKIE, cookieValue);

    if (noc !== INTERNAL_NOC) {
        logger.info('', {
            context: 'pages.fareType',
            message: 'transaction start',
        });
    }

    const fareTypeAttribute = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE);

    const errors: ErrorInfo[] =
        fareTypeAttribute && isFareTypeAttributeWithErrors(fareTypeAttribute) ? fareTypeAttribute.errors : [];

    return { props: { operator: operatorInfo.operator.operatorPublicName, errors } };
};

export default FareTypePage;
