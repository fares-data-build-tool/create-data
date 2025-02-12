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
    getOtherProductsByNoc,
    insertOperatorGroup,
    operatorHasBodsServices,
    operatorHasFerryOrTramServices,
    updateOperatorGroup,
    insertProductAdditionalNocs,
    deleteProductAdditionalNocs,
    updateProductIncompleteStatus,
} from '../../data/auroradb';
import { putUserDataInProductsBucketWithFilePath } from '../../utils/apiUtils/userData';
import { getAdditionalNocMatchingJsonLink } from '../../utils';
import { PRODUCTS_DATA_BUCKET_NAME } from '../../constants';
import { deleteMultipleObjectsFromS3, getProductsMatchingJson } from '../../data/s3';

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
    const operatorNamesWithoutServices: string[] = [];

    await Promise.all(
        selectedOperators.map(async (operator) => {
            const hasBodsServices = await operatorHasBodsServices(operator.nocCode);
            const hasFerryOrTramServices = await operatorHasFerryOrTramServices(operator.nocCode);

            if (!hasBodsServices && !hasFerryOrTramServices) {
                operatorNamesWithoutServices.push(operator.name);
            }
        }),
    );

    return operatorNamesWithoutServices;
};

export const isSearchInputValid = (searchText: string): boolean => {
    const searchRegex = new RegExp(/^[a-zA-Z0-9\-:\s]+$/g);
    return searchRegex.test(searchText);
};

export const updateAssociatedProducts = async (nocCode: string, operatorGroupNocs: string[]): Promise<void> => {
    const multiOperatorProductsFromDb = await getOtherProductsByNoc(nocCode);

    for await (const product of multiOperatorProductsFromDb) {
        if (product.fareType === 'multiOperator' || product.fareType === 'multiOperatorExt') {
            const ticket = await getProductsMatchingJson(product.matchingJsonLink);
            let newNocs: string[] = [];
            let removedNocs: string[] = [];

            if ('additionalNocs' in ticket) {
                newNocs = operatorGroupNocs.filter((noc) => !ticket.additionalNocs.includes(noc));
                removedNocs = ticket.additionalNocs.filter((noc) => !operatorGroupNocs.includes(noc));
                ticket.additionalNocs = operatorGroupNocs;
            } else if ('additionalOperators' in ticket) {
                const ticketAdditionalOperatorNocs = ticket.additionalOperators.map((operator) => operator.nocCode);
                newNocs = operatorGroupNocs.filter((noc) => !ticketAdditionalOperatorNocs.includes(noc));
                removedNocs = ticket.additionalOperators
                    .filter((noc) => !operatorGroupNocs.includes(noc.nocCode))
                    .map((noc) => noc.nocCode);

                ticket.additionalOperators = operatorGroupNocs.map((nocCode) => ({
                    nocCode,
                    selectedServices:
                        ticket.additionalOperators.find((operator) => operator.nocCode === nocCode)?.selectedServices ||
                        [],
                }));
            }

            await putUserDataInProductsBucketWithFilePath(ticket, product.matchingJsonLink);

            if (product.fareType === 'multiOperator') {
                if (newNocs.length > 0) {
                    await updateProductIncompleteStatus(product.id, true);
                }
            } else if (product.fareType === 'multiOperatorExt') {
                if (newNocs.length > 0) {
                    await insertProductAdditionalNocs(product.id, newNocs);
                }

                if (removedNocs.length > 0) {
                    await deleteProductAdditionalNocs(product.id, removedNocs);

                    const matchingJsonLinks = removedNocs.map((noc) =>
                        getAdditionalNocMatchingJsonLink(product.matchingJsonLink, noc),
                    );
                    await deleteMultipleObjectsFromS3(matchingJsonLinks, PRODUCTS_DATA_BUCKET_NAME);
                }
            }
        }
    }
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
                    errorMessage: `Some of the selected operators have no services. To continue you must only select operators which have services in BODS, or operators who have Ferry/Tram services in TNDS`,
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
                const operatorGroupNocs = selectedOperators.map((operator) => operator.nocCode);
                await updateAssociatedProducts(noc, operatorGroupNocs);
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
