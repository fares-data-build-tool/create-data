import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';
import { ErrorInfo, NextPageContextWithSession, Operator } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import { MULTIPLE_OPERATOR_ATTRIBUTE, OPERATOR_ATTRIBUTE } from '../constants/attributes';
import { getSearchOperatorsByNocRegion, getSearchOperatorsBySchemeOpRegion } from '../data/auroradb';
import { getAndValidateNoc, getAndValidateSchemeOpRegion, getCsrfToken, isSchemeOperator } from '../utils';
import { removeExcessWhiteSpace } from './api/apiUtils/validator';
import { isSearchInputValid } from './api/searchOperators';
import { isMultipleOperatorAttributeWithErrors } from '../interfaces/typeGuards';

const title = 'Search Operators - Create Fares Data Service';
const description = 'Search Operators page for the Create Fares Data Service';

export const searchInputId = 'search-input';
export const addOperatorsErrorId = 'add-operator-checkbox-0';
export const removeOperatorsErrorId = 'remove-operator-checkbox-0';

export interface SearchOperatorProps {
    searchText: string;
    errors: ErrorInfo[];
    searchResults: Operator[];
    selectedOperators: Operator[];
    csrfToken: string;
}

export const showSelectedOperators = (selectedOperators: Operator[], errors: ErrorInfo[]): ReactElement => {
    const removeOperatorsErrors: ErrorInfo[] = [];
    errors.forEach(err => {
        if (err.id === removeOperatorsErrorId) {
            removeOperatorsErrors.push(err);
        }
    });
    return (
        <div className={`govuk-form-group ${removeOperatorsErrors.length > 0 ? 'govuk-form-group--error' : ''}`}>
            <fieldset className="govuk-fieldset">
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                    <h1 className="govuk-fieldset__heading" id="selected-operators">
                        Here&apos;s what you have added
                    </h1>
                </legend>
                <fieldset className="govuk-fieldset">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                        <h2 className="govuk-fieldset__heading govuk-visually-hidden">Remove selected operators</h2>
                    </legend>
                    <div className="govuk-inset-text">
                        <FormElementWrapper
                            errors={removeOperatorsErrors}
                            errorId={removeOperatorsErrorId}
                            errorClass=""
                        >
                            <div className="govuk-checkboxes">
                                {selectedOperators.map((operator, index) => (
                                    <div key={operator.nocCode} className="govuk-checkboxes__item">
                                        <input
                                            className="govuk-checkboxes__input"
                                            id={`remove-operator-checkbox-${index}`}
                                            name="operatorsToRemove"
                                            value={`${operator.nocCode}#${operator.name}`}
                                            type="checkbox"
                                        />
                                        <label
                                            className="govuk-label govuk-checkboxes__label"
                                            htmlFor={`remove-operator-checkbox-${index}`}
                                        >
                                            {operator.name} - {operator.nocCode}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </FormElementWrapper>
                        <input
                            type="submit"
                            name="removeOperators"
                            value={selectedOperators.length > 1 ? 'Remove Operators' : 'Remove Operator'}
                            id="remove-operators-button"
                            className="govuk-button govuk-button--secondary govuk-!-margin-top-5"
                        />
                    </div>
                </fieldset>
            </fieldset>
        </div>
    );
};

export const renderSearchBox = (operatorsAdded: boolean, errors: ErrorInfo[]): ReactElement => {
    const fieldsetProps = {
        legend: {
            className: operatorsAdded ? 'govuk-fieldset__legend--m' : 'govuk-fieldset__legend--l',
        },
        heading: {
            className: 'govuk-fieldset__heading',
            id: 'operator-search',
            content: operatorsAdded
                ? 'Search for more operators that the ticket covers'
                : 'Search for the operators that the ticket covers',
        },
    };
    const searchInputErrors: ErrorInfo[] = [];
    errors.forEach(err => {
        if (err.id === searchInputId) {
            searchInputErrors.push(err);
        }
    });
    return (
        <div className={`govuk-form-group ${searchInputErrors.length > 0 ? 'govuk-form-group--error' : ''}`}>
            <fieldset className="govuk-fieldset" aria-describedby={fieldsetProps.heading.id}>
                <legend className={fieldsetProps.legend.className}>
                    <h2 className={fieldsetProps.heading.className} id={fieldsetProps.heading.id}>
                        {fieldsetProps.heading.content}
                    </h2>
                </legend>
                {searchInputErrors.length > 0 ? (
                    <span id={`${searchInputId}-error`} className="govuk-error-message">
                        <span className="govuk-visually-hidden">Error: </span>
                        {searchInputErrors[0].errorMessage}
                    </span>
                ) : null}
                <label className="govuk-label" htmlFor={searchInputId}>
                    Operator name
                </label>
                <input
                    className={`govuk-input govuk-!-width-three-quarters${
                        searchInputErrors.length > 0 ? ' govuk-input--error' : ''
                    }`}
                    id={searchInputId}
                    name="searchText"
                    type="text"
                />
                <input
                    type="submit"
                    value="Search"
                    name="search"
                    id="search-button"
                    className="govuk-button govuk-!-margin-left-5"
                />
            </fieldset>
        </div>
    );
};

export const showSearchResults = (searchText: string, searchResults: Operator[], errors: ErrorInfo[]): ReactElement => {
    const addOperatorsErrors: ErrorInfo[] = [];
    errors.forEach(err => {
        if (err.id === addOperatorsErrorId) {
            addOperatorsErrors.push(err);
        }
    });
    return (
        <div className={`govuk-form-group ${addOperatorsErrors.length > 0 ? 'govuk-form-group--error' : ''}`}>
            <fieldset className="govuk-fieldset" aria-describedby="operator-search-results">
                <legend className="govuk-fieldset__legend">
                    <h2 className="govuk-body-l govuk-!-margin-bottom-0" id="operator-search-results">
                        Your search for &apos;<strong>{searchText}</strong>&apos; returned
                        <strong>
                            {' '}
                            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                        </strong>
                    </h2>
                </legend>
                <FormElementWrapper errors={addOperatorsErrors} errorId={addOperatorsErrorId} errorClass="">
                    <>
                        <div className="govuk-checkboxes">
                            <p className="govuk-hint" id="traveline-hint-text">
                                Select the operators results and click add operator(s). This data is taken from the
                                Traveline National Dataset.
                            </p>
                            <p className="govuk-hint" id="noc-hint-text">
                                You will see that all operator names are followed by a series of characters. These
                                characters are the operator&apos;s National Operator Code (NOC).
                            </p>
                            {searchResults.map((operator, index) => {
                                const { nocCode, name } = operator;
                                return (
                                    <div className="govuk-checkboxes__item" key={`checkbox-item-${name}`}>
                                        <input
                                            className="govuk-checkboxes__input"
                                            id={`add-operator-checkbox-${index}`}
                                            name="operatorsToAdd"
                                            type="checkbox"
                                            value={`${nocCode}#${name}`}
                                        />
                                        <label
                                            className="govuk-label govuk-checkboxes__label"
                                            htmlFor={`add-operator-checkbox-${index}`}
                                        >
                                            {name} - {nocCode}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                </FormElementWrapper>
                <div className="govuk-!-margin-top-7">
                    <input
                        type="submit"
                        name="addOperators"
                        value="Add Operator(s)"
                        id="add-operator-button"
                        className="govuk-button govuk-button--secondary"
                    />
                </div>
            </fieldset>
        </div>
    );
};

const SearchOperators = ({
    searchText,
    errors,
    searchResults,
    selectedOperators,
    csrfToken,
}: SearchOperatorProps): ReactElement => {
    const selectedOperatorsToDisplay = selectedOperators.length > 0;
    const searchResultsToDisplay = searchResults.length > 0 || errors.find(err => err.id === addOperatorsErrorId);
    return (
        <BaseLayout title={title} description={description}>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <ErrorSummary errors={errors} />
                    {selectedOperatorsToDisplay ? (
                        <CsrfForm action="/api/searchOperators" method="post" csrfToken={csrfToken}>
                            {showSelectedOperators(selectedOperators, errors)}
                        </CsrfForm>
                    ) : null}
                    <CsrfForm action="/api/searchOperators" method="post" csrfToken={csrfToken}>
                        {renderSearchBox(selectedOperatorsToDisplay, errors)}
                    </CsrfForm>
                    {searchResultsToDisplay ? (
                        <CsrfForm action="/api/searchOperators" method="post" csrfToken={csrfToken}>
                            {showSearchResults(searchText, searchResults, errors)}
                        </CsrfForm>
                    ) : null}
                    {selectedOperatorsToDisplay ? (
                        <CsrfForm action="/api/searchOperators" method="post" csrfToken={csrfToken}>
                            <div>
                                <input
                                    type="submit"
                                    value="Confirm operators and continue"
                                    name="continueButtonClick"
                                    id="continue-button"
                                    className="govuk-button"
                                />
                            </div>
                        </CsrfForm>
                    ) : null}
                </div>
                <div className="govuk-grid-column-one-third">
                    <h3 className="govuk-heading-s">What is a National Operator Code (NOC)?</h3>
                    <p className="govuk-body">
                        A National Operator Code (NOC) is a unique identifier given to every bus operator in England. No
                        two operators can have the same NOC.
                    </p>
                </div>
            </div>
        </BaseLayout>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: SearchOperatorProps }> => {
    const csrfToken = getCsrfToken(ctx);

    const schemeOp = isSchemeOperator(ctx);
    const searchParam = getAndValidateSchemeOpRegion(ctx) || getAndValidateNoc(ctx);

    let errors: ErrorInfo[] = [];
    let searchText = '';
    const searchResults: Operator[] = [];

    const searchOperatorsAttribute = getSessionAttribute(ctx.req, MULTIPLE_OPERATOR_ATTRIBUTE);
    const selectedOperators: Operator[] = searchOperatorsAttribute?.selectedOperators
        ? searchOperatorsAttribute.selectedOperators
        : [];

    if (isMultipleOperatorAttributeWithErrors(searchOperatorsAttribute)) {
        errors = searchOperatorsAttribute.errors;
        updateSessionAttribute(ctx.req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators });
    }

    const { searchOperator } = ctx.query;

    if (searchOperator) {
        searchText = searchOperator ? removeExcessWhiteSpace(searchOperator.toString()) : '';

        if (searchText.length < 3) {
            errors = [
                {
                    errorMessage: 'Search requires a minimum of three characters',
                    id: 'search-input',
                },
            ];
        } else if (!isSearchInputValid(searchText)) {
            errors.push({
                errorMessage: 'Search must only include alphanumeric characters, hyphens or colons',
                id: searchInputId,
            });
        }
        const results = schemeOp
            ? await getSearchOperatorsBySchemeOpRegion(searchText, searchParam)
            : await getSearchOperatorsByNocRegion(searchText, searchParam);
        const operatorAttribute = getSessionAttribute(ctx.req, OPERATOR_ATTRIBUTE);

        if (!operatorAttribute?.name) {
            throw new Error('Could not extract the necessary operator info for the searchOperators page.');
        }

        results.forEach(operator => {
            if (operator.name !== operatorAttribute.name) {
                searchResults.push(operator);
            }
        });
        if (searchResults.length === 0) {
            errors = [
                {
                    errorMessage: `No operators found for '${searchText}'. Try another search term.`,
                    id: 'search-input',
                },
            ];
        }
    }

    return { props: { errors, searchText, searchResults, selectedOperators, csrfToken } };
};

export default SearchOperators;
