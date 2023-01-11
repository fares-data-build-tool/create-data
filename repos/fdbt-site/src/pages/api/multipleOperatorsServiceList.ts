import { NextApiResponse } from 'next';
import {
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
} from '../../constants/attributes';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { NextApiRequestWithSession } from '../../interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../../../src/utils/sessions';
import { putUserDataInProductsBucketWithFilePath } from '../../utils/apiUtils/userData';
import { AdditionalOperator, SelectedService } from '../../interfaces/matchingJsonTypes';

export const getMultiOperatorsDataFromRequest = (requestBody: {
    [key: string]: string | string[];
}): AdditionalOperator[] => {
    //  example input {'LNUD#259#vHaXmz#YWAO259#25/03/2020': 'Brighouse - East Bierley'}

    const keyValuePairs = Object.entries(requestBody);
    console.log('here 1');
    const nocList: string[] = [];

    const unsortedMultiOperatorData = keyValuePairs.map((pair) => {
        const values = pair[0].split('#');
        const noc = values[0];
        const lineName = values[1];
        const lineId = values[2];
        const serviceCode = values[3];
        const startDate = values[4];
        const serviceDescription = pair[1] as string;

        if (!nocList.includes(noc)) {
            nocList.push(noc);
        }

        return {
            noc,
            lineName,
            lineId,
            serviceCode,
            startDate,
            serviceDescription,
        };
    });

    const sortedMultiOperatorData: AdditionalOperator[] = nocList.map((nocCode) => {
        const matchingData = unsortedMultiOperatorData.filter((data) => data.noc === nocCode);
        console.log('here 2');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const selectedServices: SelectedService[] = matchingData.map(({ noc, ...rest }) => rest);
        return {
            nocCode,
            selectedServices,
        };
    });

    return sortedMultiOperatorData;
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const operatorCount = req.body.operatorCount ? parseInt(req.body.operatorCount) : 0;
        const selectedOperatorCount = req.body.selectedOperatorCount ? parseInt(req.body.selectedOperatorCount) : 0;
        console.log('here 3');
        delete req.body.operatorCount;
        delete req.body.selectedOperatorCount;

        const listOfMultiOperatorsData = getMultiOperatorsDataFromRequest(req.body);
        console.log('here 4');
        if (operatorCount !== selectedOperatorCount) {
            updateSessionAttribute(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, {
                multiOperatorInfo: listOfMultiOperatorsData,
                errors: [
                    {
                        id: 'service-to-add-0',
                        errorMessage: 'All operators need to have at least one service selected',
                    },
                ],
            });
            redirectTo(res, '/multiOperatorServiceList');
            return;
        }

        const ticket = getSessionAttribute(req, MATCHING_JSON_ATTRIBUTE);
        const matchingJsonMetaData = getSessionAttribute(req, MATCHING_JSON_META_DATA_ATTRIBUTE);
        console.log('here 5');
        const inEditMode = ticket && matchingJsonMetaData;

        if (inEditMode) {
            const updatedTicket = {
                ...ticket,
                additionalOperators: listOfMultiOperatorsData,
            };
            console.log('here 6');
            // put the now updated matching json into s3
            // overriding the existing object
            await putUserDataInProductsBucketWithFilePath(updatedTicket, matchingJsonMetaData.matchingJsonLink);
            console.log('here 7');
            updateSessionAttribute(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, undefined);

            redirectTo(res, `/products/productDetails?productId=${matchingJsonMetaData.productId}`);
            return;
        }
        console.log('here 8');
        updateSessionAttribute(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, listOfMultiOperatorsData);
        redirectTo(res, '/multipleProducts');
        return;
    } catch (error) {
        console.log('here 9', error);
        const message =
            'There was a problem processing the selected services from the multipleOperatorsServicesList page:';
        redirectToError(res, message, 'api.multipleOperatorsServiceList', error);
    }
};
