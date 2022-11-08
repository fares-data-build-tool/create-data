import { NextApiResponse } from 'next';
import uniqBy from 'lodash/uniqBy';
import { ErrorInfo, NextApiRequestWithSession, Operator } from '../../interfaces';
import { MULTIPLE_OPERATOR_ATTRIBUTE } from '../../constants/attributes';
import { getAndValidateNoc, redirectTo, redirectToError } from '../../utils/apiUtils';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { removeExcessWhiteSpace } from '../../utils/apiUtils/validator';
import { searchInputId } from '../searchOperators';
import {
    getOperatorGroupsByNameAndNoc,
    insertOperatorGroup,
    operatorHasBodsServices,
    updateOperatorGroup,
} from '../../data/auroradb';

export const replaceSelectedOperatorsWithUserSelectedOperators = (rawList: string[]): Operator[] => {
    if (rawList.length === 0) {
        return [];
    }
    const formattedRawList = rawList.map((item) => ({
        nocCode: item.split('#')[0],
        name: item.split('#')[1],
    }));
    const updatedList = uniqBy(formattedRawList, 'nocCode');
    return updatedList;
};
export const getOperatorsWithoutServices = async (selectedOperators: Operator[]): Promise<string[]> => {
    const results = await Promise.all(
        selectedOperators.map(async (operator) => {
            const nocCode = operator.nocCode;
            const hasService = await operatorHasBodsServices(nocCode);
            if (!hasService) {
                return operator.name;
            }
            return '';
        }),
    );
    return results.filter((item) => item !== '');
};

export const isSearchInputValid = (searchText: string): boolean => {
    const searchRegex = new RegExp(/^[a-zA-Z0-9\-:\s]+$/g);
    return searchRegex.test(searchText);
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const errors: ErrorInfo[] = [];
        const { search, searchText, userSelectedOperators, continueButtonClick } = req.body;
        const id = req.body.id && Number(req.body.id);
        const isInEditMode = id && Number.isInteger(id);
        const multiOperatorAttribute = getSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE);
        let selectedOperators = multiOperatorAttribute ? multiOperatorAttribute.selectedOperators : [];
        const noc = getAndValidateNoc(req, res);

        if (search) {
            if (userSelectedOperators) {
                const rawList: string[] =
                    typeof userSelectedOperators === 'string' ? [userSelectedOperators] : userSelectedOperators;
                selectedOperators = replaceSelectedOperatorsWithUserSelectedOperators(rawList);
            } else {
                selectedOperators = [];
            }

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
                updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators });
                redirectTo(res, `/searchOperators?searchOperator=${refinedSearch}${isInEditMode ? `&id=${id}` : ''}`);
                return;
            }
        }

        if (errors.length > 0) {
            updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators, errors });
            redirectTo(res, `/searchOperators${isInEditMode ? `?id=${id}` : ''}`);
            return;
        }

        if (continueButtonClick) {
            if (!userSelectedOperators) {
                selectedOperators = [];
                errors.push({
                    errorMessage: `Select at least one operator`,
                    id: searchInputId,
                });
                updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators, errors });
                redirectTo(res, `/searchOperators${isInEditMode ? `?id=${id}` : ''}`);
                return;
            }
            const rawList: string[] =
                typeof userSelectedOperators === 'string' ? [userSelectedOperators] : userSelectedOperators;
            selectedOperators = replaceSelectedOperatorsWithUserSelectedOperators(rawList);
            const operatorsWithNoServices = await getOperatorsWithoutServices(selectedOperators);
            if (operatorsWithNoServices.length > 0) {
                errors.push({
                    errorMessage: `Some of the selected operators have no services. To continue you must only select operators which have services in BODS`,
                    id: searchInputId,
                });
                operatorsWithNoServices.forEach((names) => {
                    errors.push({ errorMessage: names, id: searchInputId });
                });
                updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators, errors });
                redirectTo(res, `/searchOperators${isInEditMode ? `?id=${id}` : ''}`);
                return;
            }

            const { operatorGroupName } = req.body;
            const refinedGroupName = removeExcessWhiteSpace(operatorGroupName);
            const operatorGroup = await getOperatorGroupsByNameAndNoc(refinedGroupName, noc);

            if (!refinedGroupName) {
                errors.push({ id: 'operator-group-name', errorMessage: `Provide a name for the operator group` });
                updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators, errors });
                redirectTo(res, `/searchOperators${isInEditMode ? `?id=${id}` : ''}`);
                return;
            }

            if (operatorGroup !== undefined) {
                if (id !== operatorGroup.id) {
                    errors.push({
                        id: 'operator-group-name',
                        errorMessage: `A saved operator group with name ${refinedGroupName} already exists, provide a unique name`,
                    });
                    updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators, errors });
                    redirectTo(res, `/searchOperators${isInEditMode ? `?id=${id}` : ''}`);
                    return;
                }
            }

            if (isInEditMode) {
                await updateOperatorGroup(id, noc, selectedOperators, refinedGroupName);
            } else {
                await insertOperatorGroup(noc, selectedOperators, refinedGroupName);
            }

            updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, undefined);
            redirectTo(res, '/viewOperatorGroups');
            return;
        }

        redirectTo(res, `/searchOperators${isInEditMode ? `?id=${id}` : ''}`);
        return;
    } catch (err) {
        const message = 'There was a problem in the search operators api.';
        redirectToError(res, message, 'api.searchOperators', err);
    }
};
