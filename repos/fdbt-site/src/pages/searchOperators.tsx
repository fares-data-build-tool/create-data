import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';
import uniqBy from 'lodash/uniqBy';
import { ErrorInfo, NextPageContextWithSession, Operator } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import { MULTIPLE_OPERATOR_ATTRIBUTE, OPERATOR_ATTRIBUTE } from '../constants/attributes';
import { getSearchOperatorsBySearchText } from '../data/auroradb';
import { getCsrfToken } from '../utils';
import { removeExcessWhiteSpace } from '../utils/apiUtils/validator';
import { isSearchInputValid } from './api/searchOperators';
import { isMultipleOperatorAttributeWithErrors } from '../interfaces/typeGuards';
import { useState } from 'react';

const title = 'Search Operators - Create Fares Data Service';
const description = 'Search Operators page for the Create Fares Data Service';

export const searchInputId = 'search-input';
export const addOperatorsErrorId = 'add-operator-checkbox-0';
export const removeOperatorsErrorId = 'remove-operator-checkbox-0';

export interface SearchOperatorProps {
    searchText: string;
    errors: ErrorInfo[];
    searchResults: Operator[];
    preSelectedOperators: Operator[];
    csrfToken: string;
}

export const showSelectedOperators = (
    selectedOperators: Operator[],
    setSelectedOperators: React.Dispatch<React.SetStateAction<Operator[]>>,
    errors: ErrorInfo[],
): ReactElement => {
    const removeOperatorsErrors: ErrorInfo[] = [];
    errors.forEach((err) => {
        if (err.id === removeOperatorsErrorId) {
            removeOperatorsErrors.push(err);
        }
    });
    const removeOperator = (nocCode: string, removeAll?: boolean) => {
        if (removeAll) {
            setSelectedOperators([]);
        } else {
            const newSelectedOperators = selectedOperators.filter((operator) => operator.nocCode !== nocCode);
            setSelectedOperators(newSelectedOperators);
        }
    };
    return (
        <>
            <table className="border-collaps width-100 margin-top-140">
                <caption className="govuk-table__caption govuk-table__caption--m">Selected operator(s)</caption>
                <thead className="selectedOperators-header-color">
                    <tr className="">
                        <th scope="col" className="left-padding govuk-table__header font-gds-transport">
                            {selectedOperators.length} added
                        </th>
                        <th scope="cor" className="govuk-table__header text-align-right">
                            <button
                                className="selectedOperators-button button-link govuk-!-margin-left-2"
                                onClick={() => removeOperator('', true)}
                                name="removeOperator"
                            >
                                Remove all
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody className="govuk-table__body">
                    {selectedOperators.map((operator, index) => (
                        <tr key={index} className="border-top">
                            <td className="govuk-label govuk-!-font-size-16" key={`td0-${index}`}>
                                {operator.name} - {operator.nocCode}
                            </td>
                            <td className="govuk-link text-align-center " key={`td1-${index}`}>
                                <button
                                    className="govuk-link  align-top button-link govuk-!-margin-left-2"
                                    onClick={() => removeOperator(operator.nocCode)}
                                    name="removeOperator"
                                    value={operator.name}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export const renderSearchBox = (
    operatorsAdded: boolean,
    errors: ErrorInfo[],
    selectedOperators: Operator[],
): ReactElement => {
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
    errors.forEach((err) => {
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
                    type="hidden"
                    name="selectedOperators"
                    value={selectedOperators.map((operator) => `${operator.nocCode}#${operator.name}`)}
                />
                {selectedOperators.map((operator, index) => {
                    const { nocCode, name } = operator;
                    return (
                        <>
                            <input
                                id={`add-operator-checkbox-${index}`}
                                name="userSelectedOperators"
                                type="hidden"
                                value={`${nocCode}#${name}`}
                            />
                        </>
                    );
                })}
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

export const showSearchResults = (
    searchText: string,
    databaseSearchResults: Operator[],
    errors: ErrorInfo[],
    selectedOperators: Operator[],
    setSelectedOperators: React.Dispatch<React.SetStateAction<Operator[]>>,
): ReactElement => {
    const addOperatorsErrors: ErrorInfo[] = [];
    errors.forEach((err) => {
        if (err.id === addOperatorsErrorId) {
            addOperatorsErrors.push(err);
        }
    });
    const [searchResultsCount, setSearchResultsCount] = useState(
        databaseSearchResults ? databaseSearchResults.length : 0,
    );
    const [showSearchResultsLine, setShowSearchResultsLine] = useState(true);
    const [searchResults, setSearchResults] = useState(databaseSearchResults);
    const addOperator = (operatorNocCode: string, operatorName: string) => {
        const newSelectedOperators = [...selectedOperators, {nocCode: operatorNocCode, name: operatorName}];
        const newUniqtSelectedOperators = uniqBy(newSelectedOperators, 'nocCode');
        setSelectedOperators(newUniqtSelectedOperators);
        if (searchResults.length > 0) {
            const newCount = searchResultsCount - 1;
            setSearchResultsCount(newCount);
        }
        setSearchResults(searchResults.filter((operator) => operator.nocCode !== operatorNocCode));
    };
    if (databaseSearchResults.length > 0 && searchResultsCount === 0) {
        setSearchResultsCount(-1);
        setShowSearchResultsLine(false);
    }

    return (
        <div className={`govuk-form-group ${addOperatorsErrors.length > 0 ? 'govuk-form-group--error' : ''}`}>
            <fieldset className="govuk-fieldset" aria-describedby="operator-search-results">
                <legend className="govuk-fieldset__legend">
                    {showSearchResultsLine && (
                        <h2 className="govuk-body-l govuk-!-margin-bottom-0" id="operator-search-results">
                            Your search for &apos;<strong>{searchText}</strong>&apos; returned
                            <strong>
                                {' '}
                                {databaseSearchResults.length} result{databaseSearchResults.length !== 1 ? 's' : ''}
                            </strong>
                        </h2>
                    )}
                </legend>
                <FormElementWrapper errors={addOperatorsErrors} errorId={addOperatorsErrorId} errorClass="">
                    <>
                        <div className="govuk-checkboxes">
                            <p className="govuk-hint" id="traveline-hint-text">
                                Select the operators results and click add operator(s). This data is taken from Bus Open
                                Data Service (BODS).
                            </p>
                            <p className="govuk-hint" id="noc-hint-text">
                                You will see that all operator names are followed by a series of characters. These
                                characters are the operator&apos;s National Operator Code (NOC).
                            </p>
                            {searchResults.map((operator, index) => {
                                const { nocCode, name } = operator;
                                return (
                                    <div className="govuk-checkboxes__item" key={`checkbox-item-${name}`}>
                                        <label
                                            className="govuk-label govuk-checkboxes__label"
                                            htmlFor={`add-operator-checkbox-${index}`}
                                            onClick={() => addOperator(operator.nocCode, operator.name)}
                                        >
                                            {name} - {nocCode}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                </FormElementWrapper>
            </fieldset>
        </div>
    );
};

const SearchOperators = ({
    searchText,
    errors,
    searchResults,
    preSelectedOperators,
    csrfToken,
}: SearchOperatorProps): ReactElement => {
    const operatorsAdded = preSelectedOperators.length > 0;
    const databaseSearchResults = searchResults ? searchResults : [];
    const searchResultsToDisplay = searchResults.length > 0 || errors.find((err) => err.id === addOperatorsErrorId);
    const [selectedOperators, setSelectedOperators] = useState<Operator[]>(preSelectedOperators);
    return (
        <BaseLayout title={title} description={description}>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <ErrorSummary errors={errors} />
                    <CsrfForm action="/api/searchOperators" method="post" csrfToken={csrfToken}>
                        {renderSearchBox(operatorsAdded, errors, selectedOperators)}
                    </CsrfForm>
                    {searchResultsToDisplay
                        ? showSearchResults(
                              searchText,
                              databaseSearchResults,
                              errors,
                              selectedOperators,
                              setSelectedOperators,
                          )
                        : null}
                </div>
                <div className="govuk-grid-column-one-third selectedOperators">
                    {showSelectedOperators(selectedOperators, setSelectedOperators, errors)}

                    <CsrfForm action="/api/searchOperators" method="post" csrfToken={csrfToken}>
                        <div>
                            {selectedOperators.map((operator, index) => {
                                const { nocCode, name } = operator;
                                return (
                                    <>
                                        <input
                                            id={`add-operator-checkbox-${index}`}
                                            name="userSelectedOperators"
                                            type="hidden"
                                            value={`${nocCode}#${name}`}
                                        />
                                    </>
                                );
                            })}
                            <input
                                type="submit"
                                value="Confirm operators and continue"
                                name="continueButtonClick"
                                id="continue-button"
                                className="govuk-button width-100"
                            />
                        </div>
                    </CsrfForm>
                </div>
            </div>
        </BaseLayout>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: SearchOperatorProps }> => {
    const csrfToken = getCsrfToken(ctx);

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
        const results = await getSearchOperatorsBySearchText(searchText);

        const operatorAttribute = getSessionAttribute(ctx.req, OPERATOR_ATTRIBUTE);

        if (!operatorAttribute?.name) {
            throw new Error('Could not extract the necessary operator info for the searchOperators page.');
        }

        results.forEach((operator: Operator) => {
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
    return { props: { errors, searchText, searchResults, preSelectedOperators: selectedOperators, csrfToken } };
};

export default SearchOperators;
