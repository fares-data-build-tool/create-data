import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import { SERVICE_ATTRIBUTE, DIRECTION_ATTRIBUTE } from '../constants/attributes';
import { getServiceByIdAndDataSource } from '../data/auroradb';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import { getAndValidateNoc, getCsrfToken, sentenceCaseString } from '../utils';
import CsrfForm from '../components/CsrfForm';
import { isService } from '../interfaces/typeGuards';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import FormElementWrapper from '../components/FormElementWrapper';
import { redirectTo } from '../utils/apiUtils';

const title = 'Single Direction - Create Fares Data Service';
const description = 'Single Direction selection page of the Create Fares Data Service';

interface SingleDirectionProps {
    errors: ErrorInfo[];
    csrfToken: string;
    directions: string[];
}

const Direction = ({ errors, csrfToken, directions }: SingleDirectionProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/direction" method="post" csrfToken={csrfToken}>
            <ErrorSummary errors={errors} />
            <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                <h1 className="govuk-heading-l" id="single-direction-page-heading">
                    Select a journey direction
                </h1>
                <label className={`govuk-label govuk-visually-hidden`} htmlFor={'select-direction'}>
                    Journey direction
                </label>
                <FormElementWrapper errors={errors} errorId={'select-direction'} errorClass="govuk-select--error">
                    <select className={`govuk-select`} id={'select-direction'} name={'direction'}>
                        <option value="" disabled>
                            Select One
                        </option>
                        {directions.map((direction) => (
                            <option key={direction} value={direction} className="journey-option">
                                {sentenceCaseString(direction)}
                            </option>
                        ))}
                    </select>
                </FormElementWrapper>
                <br />
                <span className="govuk-hint hint-text" id="traveline-sub-hint">
                    If you have route variations within your fares triangle, you are only required to upload one
                    complete triangle that includes all of the potential stops
                </span>
            </div>
            <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: SingleDirectionProps }> => {
    const csrfToken = getCsrfToken(ctx);

    const directionAttribute = getSessionAttribute(ctx.req, DIRECTION_ATTRIBUTE);
    const nocCode = getAndValidateNoc(ctx);

    const serviceAttribute = getSessionAttribute(ctx.req, SERVICE_ATTRIBUTE);

    if (!isService(serviceAttribute) || !nocCode || !ctx.res) {
        throw new Error('Necessary attributes not found to show direction page');
    }

    const service = await getServiceByIdAndDataSource(nocCode, serviceAttribute.id, 'bods');
    const directions = Array.from(
        service.journeyPatterns.reduce((set, pattern) => {
            set.add(pattern.direction);
            return set;
        }, new Set<string>()),
    );

    if (directions.length === 1) {
        updateSessionAttribute(ctx.req, DIRECTION_ATTRIBUTE, { direction: directions[0] });
        redirectTo(ctx.res, '/inputMethod');
    }

    return {
        props: {
            errors: (directionAttribute && 'errors' in directionAttribute && directionAttribute.errors) || [],
            csrfToken,
            directions,
        },
    };
};

export default Direction;
