import { NextApiResponse } from 'next';
import uniqBy from 'lodash/uniqBy';
import { ErrorInfo, NextApiRequestWithSession, Operator } from '../../interfaces';
import { MULTIPLE_OPERATOR_ATTRIBUTE } from '../../constants/attributes';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { removeExcessWhiteSpace } from '../../utils/apiUtils/validator';
import { addOperatorsErrorId, removeOperatorsErrorId, searchInputId } from '../searchOperators';
import { getBodsServicesByNoc } from '../../data/auroradb';

export const removeOperatorsFromPreviouslySelectedOperators = (
    rawList: string[],
    selectedOperators: Operator[],
): Operator[] => {
    const listToRemove = new Set(rawList.map((item) => item.split('#')[0]));
    const updatedList = selectedOperators.filter((operator) => !listToRemove.has(operator.nocCode));
    return updatedList;
};

export const addOperatorsToPreviouslySelectedOperators = (
    rawList: string[],
    selectedOperators: Operator[],
): Operator[] => {
    const formattedRawList = rawList.map((item) => ({
        nocCode: item.split('#')[0],
        name: item.split('#')[1],
    }));
    const combinedLists = selectedOperators.concat(formattedRawList);
    const updatedList = uniqBy(combinedLists, 'nocCode');

    return updatedList;
};

export const isSearchInputValid = (searchText: string): boolean => {
    const searchRegex = new RegExp(/^[a-zA-Z0-9\-:\s]+$/g);
    return searchRegex.test(searchText);
};

export const bodsHasServices = async (nocCode: string): Promise<boolean> => {
    const services = await getBodsServicesByNoc(nocCode);
    if (services.length > 0) {
        return true;
    }
    return false;
};
export const operatorsWithNoServers = (selectedOperators: Operator[]): string[] => {
    const operatorsList: string[] = [];
    Object.entries(selectedOperators).forEach((entry) => {
        const nocCode = entry[1].nocCode;
        const bodsName = entry[1].name;
        const hasService = bodsHasServices(nocCode);
        if (!hasService) {
            operatorsList.push(bodsName);
        }
    });
    return operatorsList;
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const errors: ErrorInfo[] = [];
        const {
            search,
            searchText,
            addOperators,
            operatorsToAdd,
            removeOperators,
            operatorsToRemove,
            continueButtonClick,
        } = req.body;

        const multiOperatorAttribute = getSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE);
        let selectedOperators = multiOperatorAttribute ? multiOperatorAttribute.selectedOperators : [];

        if (removeOperators) {
            if (!operatorsToRemove) {
                errors.push({
                    errorMessage: 'Select at least one operator to remove',
                    id: removeOperatorsErrorId,
                });
            } else {
                const rawList: string[] =
                    typeof operatorsToRemove === 'string' ? [operatorsToRemove] : operatorsToRemove;
                selectedOperators = removeOperatorsFromPreviouslySelectedOperators(rawList, selectedOperators);
            }
        } else if (addOperators) {
            if (!operatorsToAdd) {
                const previousSearch = req.headers.referer?.split('?searchOperator=')[1] || '';
                errors.push({ errorMessage: 'Select at least one operator to add', id: addOperatorsErrorId });
                updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators, errors });
                redirectTo(res, `/searchOperators?searchOperator=${previousSearch}`);
                return;
            }
            const rawList: string[] = typeof operatorsToAdd === 'string' ? [operatorsToAdd] : operatorsToAdd;
            selectedOperators = addOperatorsToPreviouslySelectedOperators(rawList, selectedOperators);
        } else if (search) {
            const refinedSearch = removeExcessWhiteSpace(searchText);
            if (refinedSearch.length < 3) {
                errors.push({
                    errorMessage: 'Search requires a minimum of three characters',
                    id: searchInputId,
                });
            } else if (!isSearchInputValid(refinedSearch)) {
                errors.push({
                    errorMessage: 'Search must only include alphanumeric characters, hyphens or colons',
                    id: searchInputId,
                });
            } else {
                redirectTo(res, `/searchOperators?searchOperator=${refinedSearch}`);
                return;
            }
        }

        if (continueButtonClick) {
            if (operatorsToRemove) {
                errors.push({
                    errorMessage: "Click the 'Remove Operator(s)' button to remove operators",
                    id: removeOperatorsErrorId,
                });
            }
            if (operatorsToAdd) {
                const previousSearch = req.headers.referer?.split('?searchOperator=')[1] || '';
                errors.push({
                    errorMessage: "Click the 'Add Operator(s)' button to add operators",
                    id: addOperatorsErrorId,
                });
                updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators, errors });
                redirectTo(res, `/searchOperators?searchOperator=${previousSearch}`);
                return;
            }
        }

        if (errors.length > 0) {
            updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators, errors });
            redirectTo(res, '/searchOperators');
            return;
        }

        updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators });

        if (continueButtonClick) {
            const operatorNames = operatorsWithNoServers(selectedOperators);
            if (operatorNames.length > 0) {
                errors.push({
                    errorMessage: `${operatorNames.join(', ')} has no services`,
                    id: removeOperatorsErrorId,
                });
                updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators, errors });
                redirectTo(res, '/searchOperators');
                return;
            }
            redirectTo(res, '/saveOperatorGroup');
            return;
        }

        redirectTo(res, '/searchOperators');
    } catch (err) {
        const message = 'There was a problem in the search operators api.';
        redirectToError(res, message, 'api.searchOperators', err);
    }
};
