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
    selectedOperators: Operator[];
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
    const removeOperator = (nocCode: string) => {
        if (nocCode === 'all') {
            setSelectedOperators([]);
        } else {
            const newSelectedOperators = selectedOperators.filter((operator) => operator.nocCode !== nocCode);
            setSelectedOperators(newSelectedOperators);
        }
    };
    return (
        <div>
            <legend className="govuk-fieldset__legend--s"></legend>
            <div className="">
                <>
                    <div className="">
                        <table>
                            <caption className="govuk-table__caption govuk-table__caption--m">
                                Selected operator(s)
                            </caption>
                            <thead className=" selectedOperators-header-color govuk-table__head">
                                <tr className="govuk-table__row">
                                    <th scope="col" className="govuk-table__header">
                                        {selectedOperators.length} Added
                                    </th>
                                    <th scope="col" className="govuk-table__header">
                                        <button
                                            className="selectedOperators-header-color govuk-link govuk-body align-top button-link govuk-!-margin-left-2"
                                            onClick={() => removeOperator('all')}
                                            name="removeOperator"
                                        >
                                            Remove all
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="govuk-table__body">
                                {selectedOperators.map((operator, index) => (
                                    <tr key={index} className="selectedOperators border-collaps">
                                        <td>
                                            {operator.name} - {operator.nocCode}
                                        </td>
                                        <td className="govuk-link">
                                            <button
                                                className="govuk-link govuk-body align-top button-link govuk-!-margin-left-2"
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
                    </div>
                </>
            </div>
        </div>
    );
};

export const renderSearchBox = (
    operatorsAdded: boolean,
    errors: ErrorInfo[],
    selectecOperators: Operator[],
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
    // console.log('!!!!!!!!! renderSearchBox selectedOperators', selectecOperators);
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
                    value={selectecOperators.map((operator) => `${operator.nocCode}#${operator.name}`)}
                />
                {selectecOperators.map((operator, index) => {
                    const { nocCode, name } = operator;
                    console.log('!!!!!!!!! renderSearchBox selectedOperators', nocCode, name);
                    return (
                        <>
                            <input
                                id={`add-operator-checkbox-${index}`}
                                name="operatorsToAdd"
                                type="hidden"
                                value={`${nocCode}#${name}`}
                            />
                        </>
                    );
                })}
                <input
                    type="submit"
                    value="Searchh"
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
    searchResults: Operator[],
    errors: ErrorInfo[],
    selectedOperatorss: Operator[],
    setSelectedOperatorss: React.Dispatch<React.SetStateAction<Operator[]>>,
): ReactElement => {
    const addOperatorsErrors: ErrorInfo[] = [];
    errors.forEach((err) => {
        if (err.id === addOperatorsErrorId) {
            addOperatorsErrors.push(err);
        }
    });
    const [operatorToAdd, setOperatorToAdd] = useState([]);
    console.log(operatorToAdd);
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('!!!!!!!!! handleSubmit selectedOperators', selectedOperatorss);
        if (operatorToAdd.length > 0) {
            const formattedoperatorToAdd = operatorToAdd.map((item) => ({
                nocCode: item.split('#')[0],
                name: item.split('#')[1],
            }));
            const newSelectedOperators = [...selectedOperatorss, ...formattedoperatorToAdd];
            const newUniqtSelectedOperators = uniqBy(newSelectedOperators, 'nocCode');
            setSelectedOperatorss(newUniqtSelectedOperators);
        }
    };
    const handleChange = (event) => {
        console.log('!!!!!!!!! handleChange selectedOperators', event);
        if (event.target.checked) {
            console.log(event.target.value, '✅ Checkbox is checked');
            console.log('counter!');
            setOperatorToAdd([...operatorToAdd, event.target.value]);
        } else {
            const filtered = operatorToAdd.filter((value: string) => value !== event.target.value);
            setOperatorToAdd(filtered);
            console.log(operatorToAdd, '⛔️ Checkbox is NOT checked');
        }
    };
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
                                            onChange={handleChange}
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
                        <div className="govuk-!-margin-top-7">
                            <button
                                // type="submit"
                                onClick={handleSubmit}
                                name="addOperators"
                                value="Add Operator(s)"
                                id="add-operator-button"
                                className="govuk-button govuk-button--secondary"
                            >
                                Add Operator(s)
                            </button>
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
    selectedOperators,
    csrfToken,
}: SearchOperatorProps): ReactElement => {
    const selectedOperatorsToDisplay = selectedOperators.length > 0;
    const searchResultsToDisplay = searchResults.length > 0 || errors.find((err) => err.id === addOperatorsErrorId);
    const [selectecOperators, setSelectedOperators] = useState<Operator[]>(selectedOperators);
    // selectedOperators = selectedOperators.filter((entry) => {
    // return entry.nocCode !== 'BLAC';
    // });

    return (
        <BaseLayout title={title} description={description}>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <ErrorSummary errors={errors} />
                    <CsrfForm action="/api/searchOperators" method="post" csrfToken={csrfToken}>
                        {renderSearchBox(selectedOperatorsToDisplay, errors, selectecOperators)}
                    </CsrfForm>
                    {searchResultsToDisplay ? (
                        <CsrfForm action="/api/searchOperators" method="post" csrfToken={csrfToken}>
                            {showSearchResults(
                                searchText,
                                searchResults,
                                errors,
                                selectecOperators,
                                setSelectedOperators,
                            )}
                        </CsrfForm>
                    ) : null}
                </div>
                <div className="govuk-grid-column-one-third selectedOperators">
                    <CsrfForm action="/api/searchOperators" method="post" csrfToken={csrfToken}>
                        {showSelectedOperators(selectecOperators, setSelectedOperators, errors)}
                    </CsrfForm>

                    <CsrfForm action="/api/searchOperators" method="post" csrfToken={csrfToken}>
                        <div>
                            {selectecOperators.map((operator, index) => {
                                const { nocCode, name } = operator;
                                return (
                                    <>
                                        <input
                                            id={`add-operator-checkbox-${index}`}
                                            name="operatorsToAdd"
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
                                className="govuk-button"
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

    return { props: { errors, searchText, searchResults, selectedOperators, csrfToken } };
};

export default SearchOperators;
