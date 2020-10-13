import { NextApiResponse } from 'next';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { SEARCH_OPERATOR_ATTRIBUTE } from '../../constants';
import { redirectTo, redirectToError } from './apiUtils';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { OperatorNameType } from '../../data/auroradb';

export interface SearchOperators {
    selectedOperators: OperatorNameType[];
    errors: ErrorInfo[];
}

export const populateOperatorsFromRequest = (
    requestBody: { [key: string]: string },
    operators: OperatorNameType[],
): OperatorNameType[] => {
    const body: { [key: string]: string | string[] } = requestBody;

    const selectedOperators: OperatorNameType[] = [];

    Object.entries(body).forEach(entry => {
        if (entry[0] === 'searchText' || entry[0] === 'addOperator') {
            return;
        }

        if (!operators.some(operator => operator.nocCode === entry[1].toString())) {
            selectedOperators.push({
                operatorPublicName: entry[0].toString(),
                nocCode: entry[1].toString(),
            });
        }
    });

    return selectedOperators;
};

export const checkValidOperatorEntry = (searchText: string): boolean => {
    const searchRegex = new RegExp(/^[a-zA-Z0-9\-:\s]+$/g);
    return searchRegex.test(searchText);
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    const errors: ErrorInfo[] = [];

    const { addOperator } = req.body;
    const refererUrl = req?.headers?.referer;
    const queryString = refererUrl?.substring(refererUrl?.indexOf('?') + 1);

    const searchOperatorAttribute = getSessionAttribute(req, SEARCH_OPERATOR_ATTRIBUTE);

    const { searchText } = req.body;

    if (!checkValidOperatorEntry(searchText)) {
        errors.push({
            errorMessage: 'Search must only include letters a to z, hyphens, spaces or colons',
            id: 'searchText',
        });

        updateSessionAttribute(req, SEARCH_OPERATOR_ATTRIBUTE, {
            errors,
            selectedOperators: searchOperatorAttribute?.selectedOperators || [],
        });
        redirectTo(res, `/searchOperators`);
    }

    if (addOperator) {
        if (Object.keys(req.body).length - 2 === 0) {
            errors.push({
                errorMessage: 'Choose at least one operator from the options',
                id: 'searchText',
            });

            updateSessionAttribute(req, SEARCH_OPERATOR_ATTRIBUTE, {
                errors,
                selectedOperators: searchOperatorAttribute?.selectedOperators || [],
            });
            redirectTo(res, `/searchOperators?${queryString}`);
        }

        const currentSelectedOperators = (searchOperatorAttribute && searchOperatorAttribute.selectedOperators) || [];

        const selectedOperators: OperatorNameType[] = populateOperatorsFromRequest(req.body, currentSelectedOperators);

        const mergedArray = selectedOperators.concat(currentSelectedOperators);

        updateSessionAttribute(req, SEARCH_OPERATOR_ATTRIBUTE, {
            selectedOperators: mergedArray,
            errors,
        });

        redirectTo(res, `/searchOperators`);
    }

    try {
        const refinedSearch = req.body.searchText;

        if (refinedSearch.length < 3) {
            errors.push({
                errorMessage: 'Search requires a minimum of three characters',
                id: 'searchText',
            });
            updateSessionAttribute(req, SEARCH_OPERATOR_ATTRIBUTE, {
                errors,
                selectedOperators: searchOperatorAttribute?.selectedOperators || [],
            });
            redirectTo(res, '/searchOperators');
        }

        updateSessionAttribute(req, SEARCH_OPERATOR_ATTRIBUTE, {
            errors,
            selectedOperators: searchOperatorAttribute?.selectedOperators || [],
        });
        redirectTo(res, `/searchOperators?searchOperator=${refinedSearch}`);
    } catch (err) {
        const message = 'There was a problem in the search operators api.';
        redirectToError(res, message, 'api.searchOperators', err);
    }
};
