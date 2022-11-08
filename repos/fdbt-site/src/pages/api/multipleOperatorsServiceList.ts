import { NextApiResponse } from 'next';
import isArray from 'lodash/isArray';
import { MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE } from '../../constants/attributes';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { ServiceWithNocCode, SelectedServiceByNocCode } from 'fdbt-types/matchingJsonTypes';
import { MultiOperatorInfo, NextApiRequestWithSession } from 'src/interfaces';
import { updateSessionAttribute } from '../../../src/utils/sessions';

const errorId = 'checkbox-0';

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
        };
    };
    console.log(requestBody);

    Object.entries(requestBody)
        .filter((item) => item[0] !== 'operatorCount')
        .forEach((e) => {
            const value = convertServiceDetails(e[0], e[1]);
            serviceDetails.push(value);
        });
    const multiOperatorsService: SelectedServiceByNocCode[] = [];

    const getIndexOfMultiOperatorsService = (noc: string): number => {
        const index = multiOperatorsService.findIndex((serviceDetails) => Object.keys(serviceDetails).includes(noc));
        return index;
    };
    serviceDetails.forEach((service: ServiceWithNocCode) => {
        const indexOfFound = service?.nocCode ? getIndexOfMultiOperatorsService(service.nocCode) : -1;
        if (indexOfFound === -1) {
            multiOperatorsService.push({ [`${service.nocCode}`]: [service] });
        } else {
            if (indexOfFound > -1 && service?.nocCode) {
                multiOperatorsService[indexOfFound][service.nocCode].push(service);
            } else {
                // eslint-disable-next-line no-console
                console.log(`indexOfFound is ${indexOfFound}`);
            }
        }
    });
    const newListOfMultiOperatorsData: MultiOperatorInfo[] = [];
    multiOperatorsService.forEach((obj) => {
        Object.entries(obj).forEach((v) => {
            newListOfMultiOperatorsData.push({ nocCode: v[0], services: v[1] });
        });
    });

    return newListOfMultiOperatorsData;
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    const redirectUrl = '/multipleOperatorsServiceList';

    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            updateSessionAttribute(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, {
                multiOperatorInfo: [],
                errors: [{ id: errorId, errorMessage: 'Choose at least one service from the options' }],
            });
            redirectTo(res, `${redirectUrl}`);
            return;
        }

        const requestBody: { [key: string]: string } = req.body;

        const operatorCount = requestBody.operatorCount ? parseInt(requestBody.operatorCount) : 0;
        delete requestBody.confirm;
        delete requestBody.operatorCount;
        const listOfMultiOperatorsData = getMultiOperatorsDataFromRequest(requestBody);
        if (operatorCount !== listOfMultiOperatorsData.length) {
            updateSessionAttribute(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, {
                multiOperatorInfo: listOfMultiOperatorsData.length > 0 ? listOfMultiOperatorsData : [],
                errors: [{ id: errorId, errorMessage: 'All operators need to have at least one service' }],
            });
            redirectTo(res, `${redirectUrl}`);
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
