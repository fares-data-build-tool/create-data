import { NextApiResponse } from 'next';
import uniqBy from 'lodash/uniqBy';
import { ErrorInfo, NextApiRequestWithSession, Operator } from '../../interfaces';
import { MULTIPLE_OPERATOR_ATTRIBUTE } from '../../constants/attributes';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { removeExcessWhiteSpace } from '../../utils/apiUtils/validator';
import { removeOperatorsErrorId, searchInputId } from '../searchOperators';
import { operatorHasBodsServices } from '../../data/auroradb';

export const removeOperatorsFromPreviouslySelectedOperators = (
    rawList: string[],
    selectedOperators: Operator[],
): Operator[] => {
    const listToRemove = new Set(rawList.map((item) => item.split('#')[0]));
    const updatedList = selectedOperators.filter((operator) => !listToRemove.has(operator.nocCode));
    return updatedList;
};

export const addOperatorsToPreviouslySelectedOperators = (rawList: string[]): Operator[] => {
    if (rawList.length == 0) {
        const selectedOperators: Operator[] = [];
        return selectedOperators;
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

        const multiOperatorAttribute = getSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE);
        let selectedOperators = multiOperatorAttribute ? multiOperatorAttribute.selectedOperators : [];

        if (search) {
            if (userSelectedOperators) {
                const rawList: string[] =
                    typeof userSelectedOperators === 'string' ? [userSelectedOperators] : userSelectedOperators;
                selectedOperators = addOperatorsToPreviouslySelectedOperators(rawList);
            } else {
                selectedOperators = [];
            }
            console.log('just before update Session ');
            updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators });

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

        if (errors.length > 0) {
            updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators, errors });
            redirectTo(res, '/searchOperators');
            return;
        }

        // updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators });

        if (continueButtonClick) {
            // if (userSelectedOperators) {
            //     const rawList: string[] =
            //         typeof userSelectedOperators === 'string' ? [userSelectedOperators] : userSelectedOperators;
            //     selectedOperators = addOperatorsToPreviouslySelectedOperators(rawList);
            //     updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators });
            // } else {
            //     selectedOperators = [];
            //     errors.push({
            //         errorMessage: `Select at least one operator`,
            //         id: removeOperatorsErrorId,
            //     });

            //     updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators, errors });
            //     redirectTo(res, '/searchOperators');
            //     return;
            // }
            if (!userSelectedOperators) {
                selectedOperators = [];
                errors.push({
                    errorMessage: `Select at least one operator`,
                    id: removeOperatorsErrorId,
                });
                console.log('updated Session');
                updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators, errors });
                redirectTo(res, '/searchOperators');
                return;
            }
            const rawList: string[] =
                typeof userSelectedOperators === 'string' ? [userSelectedOperators] : userSelectedOperators;
            selectedOperators = addOperatorsToPreviouslySelectedOperators(rawList);
            const operatorsWithNoServices = await getOperatorsWithoutServices(selectedOperators);
            if (operatorsWithNoServices.length > 0) {
                errors.push({
                    errorMessage: `Some of the selected operators have no services. To continue you must only select operators which have services in BODS`,
                    id: removeOperatorsErrorId,
                });
                operatorsWithNoServices.forEach((names) => {
                    errors.push({ errorMessage: names, id: removeOperatorsErrorId });
                });
                console.log('updated Session');
                updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators, errors });
                redirectTo(res, '/searchOperators');
                return;
            }
            console.log('updated Session');
            updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators });
            redirectTo(res, '/saveOperatorGroup');
            return;
        }

        redirectTo(res, '/searchOperators');
    } catch (err) {
        const message = 'There was a problem in the search operators api.';
        redirectToError(res, message, 'api.searchOperators', err);
    }
};
