import { NextApiResponse } from 'next';
import isArray from 'lodash/isArray';
import {
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
} from '../../constants/attributes';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { ServiceWithNocCode, SelectedServiceByNocCode } from 'fdbt-types/matchingJsonTypes';
import { MultiOperatorInfo, NextApiRequestWithSession } from 'src/interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../../../src/utils/sessions';
import { putUserDataInProductsBucketWithFilePath } from '../../utils/apiUtils/userData';

const errorId = 'service-to-add-1';
const redirectUrl = '/multipleOperatorsServiceList';

export const getMultiOperatorsDataFromRequest = (requestBody: {
    [key: string]: string | string[];
}): MultiOperatorInfo[] => {
    let nocCode = '';
    const serviceDetails: ServiceWithNocCode[] = [];
    const convertServiceDetails = (value: string, description: string | string[]): ServiceWithNocCode => {
        let splitStrings = [];
        let serviceDescription: string;
        [nocCode, ...splitStrings] = value.split('#');
        if (isArray(description)) {
            [serviceDescription] = description;
        } else {
            serviceDescription = description;
        }

        return {
            nocCode: nocCode,
            lineName: splitStrings[0],
            lineId: splitStrings[1],
            serviceCode: splitStrings[2],
            startDate: splitStrings[3],
            serviceDescription: serviceDescription,
            selected: false,
        };
    };

    Object.entries(requestBody)
        .filter((item) => item[0] !== 'operatorCount')
        .forEach((e) => {
            const value = convertServiceDetails(e[0], e[1]);
            serviceDetails.push(value);
        });

    const selectedServices: SelectedServiceByNocCode[] = [];

    const getIndexOfMultiOperatorsService = (noc: string): number => {
        const index = selectedServices.findIndex((serviceDetails) => Object.keys(serviceDetails).includes(noc));
        return index;
    };
    serviceDetails.forEach((service: ServiceWithNocCode) => {
        const indexOfFound = getIndexOfMultiOperatorsService(service.nocCode);
        if (indexOfFound === -1) {
            selectedServices.push({ [`${service.nocCode}`]: [service] });
        } else {
            selectedServices[indexOfFound][service.nocCode].push(service);
        }
    });
    const newListOfMultiOperatorsData: MultiOperatorInfo[] = selectedServices.flatMap((selectedService) => {
        return Object.entries(selectedService).flatMap((keyValuePair) => {
            return { nocCode: keyValuePair[0], services: keyValuePair[1] };
        });
    });

    return newListOfMultiOperatorsData;
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const operatorCount = req.body.operatorCount ? parseInt(req.body.operatorCount) : 0;
        delete req.body.operatorCount;
        const listOfMultiOperatorsData = getMultiOperatorsDataFromRequest(req.body);

        if (operatorCount !== listOfMultiOperatorsData.length) {
            updateSessionAttribute(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, {
                multiOperatorInfo: listOfMultiOperatorsData,
                errors: [{ id: errorId, errorMessage: 'All operators need to have at least one service' }],
            });
            redirectTo(res, `${redirectUrl}`);
            return;
        }

        const ticket = getSessionAttribute(req, MATCHING_JSON_ATTRIBUTE);
        const matchingJsonMetaData = getSessionAttribute(req, MATCHING_JSON_META_DATA_ATTRIBUTE);

        const inEditMode = ticket && matchingJsonMetaData;

        if (inEditMode) {
            const updatedTicket = {
                ...ticket,
                additionalOperators: listOfMultiOperatorsData.map((operator) => ({
                    nocCode: operator.nocCode,
                    selectedServices: operator.services,
                })),
            };

            // put the now updated matching json into s3
            // overriding the existing object
            await putUserDataInProductsBucketWithFilePath(updatedTicket, matchingJsonMetaData.matchingJsonLink);

            updateSessionAttribute(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, undefined);

            redirectTo(res, `/products/productDetails?productId=${matchingJsonMetaData.productId}`);
            return;
        }

        updateSessionAttribute(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, listOfMultiOperatorsData);
        redirectTo(res, '/multipleProducts');
        return;
    } catch (error) {
        const message =
            'There was a problem processing the selected services from the multipleOperatorsServicesList page:';
        redirectToError(res, message, 'api.multipleOperatorsServiceList', error);
    }
};
