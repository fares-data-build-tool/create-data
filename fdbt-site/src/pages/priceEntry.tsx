import React, { ReactElement } from 'react';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import ErrorSummary from '../components/ErrorSummary';
import { FullColumnLayout } from '../layout/Layout';
import { STAGE_NAMES_ATTRIBUTE, PRICE_ENTRY_ATTRIBUTE } from '../constants';
import CsrfForm from '../components/CsrfForm';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { FaresInformation } from './api/priceEntry';
import { isInputCheck } from '../interfaces/typeGuards';
import { getCsrfToken } from '../utils';

const title = 'Price Entry - Create Fares Data Service';
const description = 'Price Entry page of the Create Fares Data Service';

interface PriceEntryProps {
    stageNamesArray: string[];
    faresInformation?: FaresInformation;
    errors?: ErrorInfo[];
    csrfToken: string;
}

export const getDefaultValue = (fareInformation: FaresInformation, rowStage: string, columnStage: string): string => {
    if (!fareInformation) {
        return '';
    }
    const cellName = `${rowStage}-${columnStage}`;
    const defaultInput = fareInformation.inputs.find(input => {
        return input.locator === cellName;
    });

    return defaultInput?.input || '';
};

export const createClassName = (
    inputs: FaresInformation | undefined,
    rowStage: string,
    columnStage: string,
): string => {
    const className = 'govuk-input govuk-input--width-4';

    if (!inputs) {
        return className;
    }

    let errorClass = '';

    const name = `${rowStage}-${columnStage}`;

    if (inputs.errorInformation.some(el => el.locator === name)) {
        errorClass = ' govuk-input--error';
    }

    return className + errorClass;
};

export const filterErrors = (errors: ErrorInfo[]): ErrorInfo[] => {
    const filteredErrors: ErrorInfo[] = [];
    errors.forEach(error => {
        if (!filteredErrors.some(el => !!el.errorMessage && el.errorMessage !== '')) {
            filteredErrors.push({ errorMessage: error.errorMessage, id: error.id });
        }
    });

    return filteredErrors;
};

export const createErrorSpans = (errors: ErrorInfo[]): ReactElement[] => {
    const errorSpans: ReactElement[] = [];

    errors.forEach((error: ErrorInfo) => {
        errorSpans.push(<span className="govuk-error-message">{error.errorMessage}</span>);
    });

    return errorSpans;
};

const PriceEntry = ({
    stageNamesArray,
    csrfToken,
    faresInformation = { inputs: [], errorInformation: [] },
    errors = [],
}: PriceEntryProps): ReactElement => (
    <FullColumnLayout title={title} description={description}>
        <CsrfForm action="/api/priceEntry" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <fieldset className="govuk-fieldset" aria-describedby="price-entry-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="price-entry-page-heading">
                                Enter the prices for all fare stages in pence
                            </h1>
                        </legend>
                    </fieldset>
                    <span className="govuk-hint" id="price-entry-hint">
                        For example, £2.40 would be 240
                    </span>
                    {errors.length > 0 ? createErrorSpans(errors) : null}

                    <div className="fare-triangle-container">
                        <div className="fare-triangle">
                            {stageNamesArray.map((rowStage, rowIndex) => (
                                <div id={`row-${rowIndex}`} className="fare-triangle-row" key={rowStage}>
                                    <span className="govuk-heading-s fare-triangle-label-left">
                                        <span>{rowIndex > 0 ? rowStage : null}</span>
                                    </span>
                                    {stageNamesArray.slice(0, rowIndex).map(columnStage => (
                                        <React.Fragment key={columnStage}>
                                            <span
                                                className={`fare-triangle-input ${
                                                    rowIndex % 2 === 0
                                                        ? 'fare-triangle-input-white'
                                                        : 'fare-triangle-input-light-grey'
                                                }`}
                                            >
                                                <input
                                                    id={`${rowStage}-${columnStage}`}
                                                    className={createClassName(faresInformation, rowStage, columnStage)}
                                                    name={`${rowStage}-${columnStage}`}
                                                    type="text"
                                                    aria-describedby="price-entry-hint"
                                                    defaultValue={getDefaultValue(
                                                        faresInformation,
                                                        rowStage,
                                                        columnStage,
                                                    )}
                                                />
                                            </span>
                                            <label
                                                htmlFor={`${rowStage}-${columnStage}`}
                                                className="govuk-visually-hidden"
                                            >
                                                Input price from {columnStage} to {rowStage} in pence
                                            </label>
                                        </React.Fragment>
                                    ))}
                                    <div aria-sort="none" className="govuk-heading-s fare-triangle-label-right">
                                        {rowStage}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </FullColumnLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: PriceEntryProps } => {
    const csrfToken = getCsrfToken(ctx);
    const stageNamesInfo = getSessionAttribute(ctx.req, STAGE_NAMES_ATTRIBUTE);

    if (!stageNamesInfo || stageNamesInfo.length === 0 || isInputCheck(stageNamesInfo)) {
        throw new Error('Necessary stage names not found to show price entry page');
    }

    const stageNamesArray: string[] = stageNamesInfo;

    if (stageNamesArray.length === 0 && ctx.res) {
        throw new Error('No stages in cookie data');
    }

    const priceEntryInfo = getSessionAttribute(ctx.req, PRICE_ENTRY_ATTRIBUTE);

    if (priceEntryInfo) {
        const errors: ErrorInfo[] = priceEntryInfo.errorInformation.map(error => {
            return { errorMessage: error.input, id: priceEntryInfo.errorInformation[0].locator };
        });
        const filteredErrors = filterErrors(errors);
        updateSessionAttribute(ctx.req, PRICE_ENTRY_ATTRIBUTE, undefined);
        return {
            props: {
                stageNamesArray,
                faresInformation: {
                    inputs: priceEntryInfo.inputs,
                    errorInformation: priceEntryInfo.errorInformation,
                },
                errors: filteredErrors,
                csrfToken,
            },
        };
    }

    return { props: { stageNamesArray, csrfToken } };
};

export default PriceEntry;
