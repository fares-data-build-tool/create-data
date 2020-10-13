import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import TwoThirdsLayout from '../layout/Layout';
import { CustomAppProps, ErrorInfo, NextPageContextWithSession } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { getSessionAttribute } from '../utils/sessions';
import { SEARCH_OPERATOR_ATTRIBUTE, OPERATOR_COOKIE } from '../constants';
import { getSearchOperators, OperatorNameType } from '../data/auroradb';
import { getAndValidateNoc } from '../utils';

const title = 'Search Operators - Fares Data Build Tool';
const description = 'Search Operators page for the Fares Data Build Tool';

type SearchOperatorProps = {
    errors: ErrorInfo[];
    searchText: string;
    operators: OperatorNameType[];
    selectedOperators: OperatorNameType[];
};

const fetchSearchData = async (
    searchText: string,
    nocCode: string,
    operatorName: string,
): Promise<OperatorNameType[]> => {
    const operators = await getSearchOperators(searchText, nocCode);

    const filteredOperators: OperatorNameType[] = [];
    operators.forEach(operator => {
        if (operator.operatorPublicName !== operatorName) {
            filteredOperators.push(operator);
        }
    });

    return operators;
};

const SearchOperators = ({
    errors = [],
    csrfToken,
    operators,
    searchText,
    selectedOperators,
}: SearchOperatorProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description}>
        <CsrfForm action="/api/searchOperators" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />

                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <div className="govuk-form-group">
                        {selectedOperators && selectedOperators.length > 0 ? (
                            <div className="govuk-inset-text">
                                {selectedOperators.map(operator => {
                                    return <p className="govuk-body">{operator.operatorPublicName}</p>;
                                })}
                            </div>
                        ) : null}
                        <h1 className="govuk-label-wrapper">
                            <label className="govuk-label govuk-label--l" htmlFor="event-name">
                                {selectedOperators && selectedOperators.length > 0
                                    ? 'Confirm your selected operators'
                                    : 'Search for the operators that the ticket covers'}
                            </label>
                        </h1>
                        <FormElementWrapper errors={errors} errorId="searchText" errorClass="govuk-input--error">
                            <>
                                <label className="govuk-label  govuk-!-margin-top-5" htmlFor="searchText">
                                    Operator name
                                </label>
                                <input
                                    className="govuk-input govuk-!-width-three-quarters"
                                    id="searchText"
                                    name="searchText"
                                    type="text"
                                />
                                <input
                                    type="submit"
                                    value="Search"
                                    id="search-button"
                                    className="govuk-button govuk-!-margin-left-5"
                                />
                            </>
                        </FormElementWrapper>
                        {operators.length > 0 ? (
                            <FormElementWrapper
                                errors={errors}
                                errorId="checkbox-0"
                                errorClass=""
                                addFormGroupError={false}
                            >
                                <>
                                    <div className="govuk-checkboxes">
                                        <h2 className="govuk-body govuk-heading-l">
                                            Your search for <strong>{searchText}</strong> returned
                                            <strong> {operators.length} result(s)</strong>
                                        </h2>
                                        <p className="govuk-hint" id="operator-hint-text">
                                            Select the operators results and click add operator(s). This data is taken
                                            from the Traveline National Dataset.
                                        </p>
                                        {operators.map((operator, index) => {
                                            const { nocCode, operatorPublicName } = operator;
                                            return (
                                                <div
                                                    className="govuk-checkboxes__item"
                                                    key={`checkbox-item-${operatorPublicName}`}
                                                >
                                                    <input
                                                        className="govuk-checkboxes__input"
                                                        id={`checkbox-${index}`}
                                                        name={operatorPublicName}
                                                        type="checkbox"
                                                        value={`${nocCode}`}
                                                    />
                                                    <label
                                                        className="govuk-label govuk-checkboxes__label"
                                                        htmlFor={`checkbox-${index}`}
                                                    >
                                                        {operatorPublicName}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="govuk-!-margin-top-7">
                                        <input
                                            type="submit"
                                            name="addOperator"
                                            value="Add Operator(s)"
                                            id="add-operator-button"
                                            className="govuk-button govuk-button--secondary"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="submit"
                                            name="continue"
                                            value="Continue"
                                            id="continue-button"
                                            className="govuk-button"
                                        />
                                    </div>
                                </>
                            </FormElementWrapper>
                        ) : null}
                    </div>
                </div>
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: SearchOperatorProps }> => {
    const nocCode = getAndValidateNoc(ctx);

    const searchOperatorsAttribute = getSessionAttribute(ctx.req, SEARCH_OPERATOR_ATTRIBUTE);

    if (!searchOperatorsAttribute) {
        return {
            props: {
                errors: [],
                searchText: '',
                operators: [],
                selectedOperators: [],
            },
        };
    }

    const cookies = parseCookies(ctx);
    // structure of the operator cookie is very strange here
    const operatorName: string = JSON.parse(cookies[OPERATOR_COOKIE]).operator.operatorPublicName;

    const { searchOperator } = ctx.query;

    const searchText = searchOperator && searchOperator !== '' ? searchOperator.toString() : '';

    const selectedOperatorsList = searchOperatorsAttribute?.selectedOperators;

    let filteredOperators: OperatorNameType[] = [];

    if (searchText !== '') {
        filteredOperators = await fetchSearchData(searchText, nocCode, operatorName);
    }

    if (searchText !== '' && searchText.length < 3) {
        return {
            props: {
                errors: [
                    {
                        errorMessage: 'Search requires a minimum of three characters',
                        id: 'searchText',
                    },
                ],
                searchText,
                operators: filteredOperators || [],
                selectedOperators: selectedOperatorsList,
            },
        };
    }

    if (searchOperatorsAttribute.errors.length > 0) {
        return {
            props: {
                errors: searchOperatorsAttribute.errors,
                searchText: searchText || '',
                operators: [],
                selectedOperators: searchOperatorsAttribute.selectedOperators,
            },
        };
    }

    if (searchText !== '') {
        const errors: ErrorInfo[] = [];

        if (filteredOperators.length === 0) {
            errors.push({
                errorMessage: `No operators found for: ${searchText} . Try another search term.`,
                id: 'searchText',
            });
        }
        return {
            props: { errors, searchText, operators: filteredOperators, selectedOperators: selectedOperatorsList || [] },
        };
    }

    return {
        props: {
            errors: searchOperatorsAttribute.errors,
            searchText,
            operators: [],
            selectedOperators: selectedOperatorsList || [],
        },
    };
};

export default SearchOperators;
