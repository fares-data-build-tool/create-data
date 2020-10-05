import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import { CustomAppProps, ErrorInfo, NextPageContextWithSession } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { getSessionAttribute } from '../utils/sessions';
import { SEARCH_OPERATOR_ATTRIBUTE } from '../constants';
import { isSearchOperatorAttributeWithErrors } from '../interfaces/typeGuards';
import { getSearchOperators, OperatorNameType } from '../data/auroradb';
import { getAndValidateNoc } from '../utils';
import { removeExcessWhiteSpace } from './api/apiUtils/validator';

const title = 'Search Operators - Fares Data Build Tool';
const description = 'Search Operators page for the Fares Data Build Tool';

type SearchOperatorProps = {
    errors: ErrorInfo[];
    searchText: string;
    operators: OperatorNameType[];
};

const SearchOperators = ({
    errors = [],
    csrfToken,
    operators,
    searchText,
}: SearchOperatorProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description}>
        <CsrfForm action="/api/searchOperators" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <div className="govuk-form-group">
                        <h1 className="govuk-label-wrapper">
                            <label className="govuk-label govuk-label--l" htmlFor="event-name">
                                Search for the operators that the ticket covers
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
                                                        value={`${nocCode}#${operatorPublicName}`}
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
                                            value="Add Operator(s)"
                                            id="add-operator-button"
                                            className="govuk-button govuk-button--secondary"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="submit"
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

    if (!nocCode) {
        throw new Error('Necessary cookies not found to show operators page');
    }

    const searchOperatorsAttribute = getSessionAttribute(ctx.req, SEARCH_OPERATOR_ATTRIBUTE);

    const { searchOperator } = ctx.query;

    if (isSearchOperatorAttributeWithErrors(searchOperatorsAttribute) && searchOperatorsAttribute.errors.length > 0) {
        const { errors } = searchOperatorsAttribute;
        return {
            props: {
                errors,
                searchText: '',
                operators: [],
            },
        };
    }

    const searchText = searchOperator && searchOperator !== '' ? removeExcessWhiteSpace(searchOperator.toString()) : '';

    let operators: OperatorNameType[];

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
                operators: [],
            },
        };
    }

    if (searchText !== '') {
        const errors: ErrorInfo[] = [];

        operators = await getSearchOperators(searchText, nocCode);
        if (operators.length === 0) {
            errors.push({
                errorMessage: `No operators found for: ${searchText} . Try another search term.`,
                id: 'searchText',
            });
        }
        return { props: { errors, searchText, operators } };
    }

    return { props: { errors: [], searchText, operators: [] } };
};

export default SearchOperators;
