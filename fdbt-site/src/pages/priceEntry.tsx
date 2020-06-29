import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import ErrorSummary from '../components/ErrorSummary';
import { FullColumnLayout } from '../layout/Layout';
import { STAGE_NAMES_COOKIE, PRICE_ENTRY_ERRORS_COOKIE, PRICE_ENTRY_INPUTS_COOKIE } from '../constants';
import CsrfForm from '../components/CsrfForm';
import { CustomAppProps, ErrorInfo } from '../interfaces';
import { FaresInformation, FaresInput, PriceEntryError } from './api/priceEntry';

const title = 'Price Entry Fares Triangle - Fares Data Build Tool';
const description = 'Price Entry page of the Fares Data Build Tool';

const errorId = 'fare-triangle-container';

interface PriceEntryProps {
    stageNamesArray: string[];
    faresInformation?: FaresInformation;
    errors?: ErrorInfo[];
}

export const getDefaultValue = (fareInformation: FaresInformation, rowStage: string, columnStage: string): string => {
    if (!fareInformation) {
        return '';
    }
    const cellName = `${rowStage}-${columnStage}`;
    const defaultInput = fareInformation.inputs.find(input => {
        return input.k === cellName;
    });

    return defaultInput?.v || '';
};

export const createClassName = (
    inputs: FaresInformation | undefined,
    rowIndex: number,
    rowStage: string,
    columnStage: string,
): string => {
    const className = `govuk-input govuk-input--width-4 fare-triangle-input ${
        rowIndex % 2 === 0 ? 'fare-triangle-input-white' : 'fare-triangle-input-light-grey'
    }`;

    if (!inputs) {
        return className;
    }

    let errorClass = '';

    const name = `${rowStage}-${columnStage}`;

    if (inputs.errorInformation.some(el => el.k === name)) {
        errorClass = ' govuk-input--error';
    }

    return className + errorClass;
};

export const filterErrors = (errors: ErrorInfo[]): ErrorInfo[] => {
    const errorText = 'Enter a valid price for each stage';
    const filteredErrors: ErrorInfo[] = [];
    errors.forEach(error => {
        if (!filteredErrors.some(el => el.errorMessage === errorText)) {
            let updatedErrorMessage = '';
            if (error.errorMessage === 'A') {
                updatedErrorMessage = errorText;
            }
            filteredErrors.push({ errorMessage: updatedErrorMessage, id: error.id });
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
}: PriceEntryProps & CustomAppProps): ReactElement => (
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
                        <span className="govuk-hint" id="price-entry-hint">
                            Example: £2.40 would be 240
                        </span>
                        {errors.length > 0 ? createErrorSpans(errors) : null}
                    </fieldset>
                    <div className="fare-triangle-container" id={errorId}>
                        <div className="fare-triangle-column">
                            {stageNamesArray.map((rowStage, rowIndex) => (
                                <div
                                    className="govuk-heading-s fare-triangle-label-left"
                                    key={stageNamesArray[rowIndex]}
                                >
                                    <span>{rowIndex > 0 ? rowStage : null}</span>
                                </div>
                            ))}
                        </div>
                        <div className="fare-triangle">
                            {stageNamesArray.map((rowStage, rowIndex) => (
                                <div
                                    id={`row-${rowIndex}`}
                                    className="fare-triangle-row"
                                    key={stageNamesArray[rowIndex]}
                                >
                                    {stageNamesArray.slice(0, rowIndex).map((columnStage, columnIndex) => (
                                        <input
                                            className={createClassName(
                                                faresInformation,
                                                rowIndex,
                                                rowStage,
                                                columnStage,
                                            )}
                                            id={`cell-${rowIndex}-${columnIndex}`}
                                            name={`${rowStage}-${columnStage}`}
                                            type="text"
                                            key={stageNamesArray[columnIndex]}
                                            defaultValue={getDefaultValue(faresInformation, rowStage, columnStage)}
                                        />
                                    ))}
                                    <div className="govuk-heading-s fare-triangle-label-right">{rowStage}</div>
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

export const getServerSideProps = (ctx: NextPageContext): { props: PriceEntryProps } => {
    const cookies = parseCookies(ctx);
    const stageNamesCookie = cookies[STAGE_NAMES_COOKIE];
    const priceEntryErrorsCookie = cookies[PRICE_ENTRY_ERRORS_COOKIE];
    const priceEntryInputsCookie = cookies[PRICE_ENTRY_INPUTS_COOKIE];

    if (!stageNamesCookie) {
        throw new Error('Necessary stage names cookies not found to show price entry page');
    }

    const stageNamesArray = JSON.parse(stageNamesCookie);

    if (stageNamesArray.length === 0 && ctx.res) {
        throw new Error('No stages in cookie data');
    }

    if (priceEntryInputsCookie && priceEntryErrorsCookie) {
        const priceEntryCookieInputContents: FaresInput[] = JSON.parse(priceEntryInputsCookie);
        const priceEntryCookieErrorContents: PriceEntryError[] = JSON.parse(priceEntryErrorsCookie);

        const errors: ErrorInfo[] = priceEntryCookieErrorContents.map(error => {
            return { errorMessage: error.v, id: errorId };
        });
        const filteredErrors = filterErrors(errors);
        return {
            props: {
                stageNamesArray,
                faresInformation: {
                    inputs: priceEntryCookieInputContents,
                    errorInformation: priceEntryCookieErrorContents,
                },
                errors: filteredErrors,
            },
        };
    }

    return { props: { stageNamesArray } };
};

export default PriceEntry;
