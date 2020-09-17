import { NextApiRequest, NextApiResponse } from 'next';
import isEmpty from 'lodash/isEmpty';
import { NextApiRequestWithSession } from '../../interfaces/index';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import {
    JOURNEY_ATTRIBUTE,
    INPUT_METHOD_ATTRIBUTE,
    PRICE_ENTRY_ATTRIBUTE,
    USER_DATA_BUCKET_NAME,
} from '../../constants/index';

import { getUuidFromCookie, redirectToError, redirectTo } from './apiUtils';
import { putStringInS3 } from '../../data/s3';
import { isSessionValid } from './apiUtils/validator';
import { isJourney } from '../../interfaces/typeGuards';

interface UserFareStages {
    fareStages: {
        stageName: string;
        prices: {
            price: string;
            fareZones: string[];
        }[];
    }[];
}

interface FareTriangleData {
    [stageName: string]: {
        [price: string]: {
            price: string;
            fareZones: string[];
        };
    };
}

export interface FaresInformation {
    inputs: FaresInput[];
    errorInformation: PriceEntryError[];
}

export interface FaresInput {
    input: string;
    locator: string;
}

export interface PriceEntryError {
    input: string;
    locator: string;
}

export const inputsValidityCheck = (req: NextApiRequest): FaresInformation => {
    const priceEntries = Object.entries(req.body);
    const errors: PriceEntryError[] = [];
    const sortedInputs: FaresInput[] = priceEntries.map(priceEntry => {
        if (priceEntry[1] !== '0' || Number(priceEntry[1]) !== 0) {
            if (!priceEntry[1] || Number.isNaN(Number(priceEntry[1])) || Number(priceEntry[1]) % 1 !== 0) {
                errors.push({
                    input: 'Enter a valid price for each stage',
                    locator: priceEntry[0],
                });
            }
        }
        return {
            input: priceEntry[1] as string,
            locator: priceEntry[0],
        };
    });
    return {
        inputs: sortedInputs,
        errorInformation: errors,
    };
};

export const faresTriangleDataMapper = (req: NextApiRequest): UserFareStages => {
    const arrayOfFareItemArrays: string[][] = Object.entries(req.body);
    const fareTriangle: FareTriangleData = {};

    for (let itemNum = 0; itemNum < arrayOfFareItemArrays.length; itemNum += 1) {
        const cellRef = arrayOfFareItemArrays[itemNum][0];
        const splitCellRefAsArray = cellRef.split('-');
        const destinationFareStageName = splitCellRefAsArray[0];
        const originFareStageName = splitCellRefAsArray[1];
        const price = arrayOfFareItemArrays[itemNum][1];

        if (!fareTriangle[originFareStageName]) {
            fareTriangle[originFareStageName] = {};
        }

        if (!fareTriangle[originFareStageName][price]) {
            fareTriangle[originFareStageName][price] = {
                price: (parseFloat(price) / 100).toFixed(2),
                fareZones: [],
            };
        }

        if (!fareTriangle[destinationFareStageName]) {
            fareTriangle[destinationFareStageName] = {};
        }
        fareTriangle[originFareStageName][price].fareZones.push(destinationFareStageName);
    }

    const originStages = Object.entries(fareTriangle);
    const mappedFareTriangle: UserFareStages = {
        fareStages: originStages.map(kv => {
            const pricesToDestinationStages = Object.values(kv[1]);
            return {
                stageName: kv[0],
                prices: pricesToDestinationStages,
            };
        }),
    };

    return mappedFareTriangle;
};

export const putDataInS3 = async (uuid: string, text: string): Promise<void> => {
    await putStringInS3(USER_DATA_BUCKET_NAME, `${uuid}.json`, text, 'application/json; charset=utf-8');
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        if (!req.body || isEmpty(req.body)) {
            throw new Error('Body of request not found.');
        }

        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        const errorCheck: FaresInformation = inputsValidityCheck(req);

        if (errorCheck.errorInformation.length > 0) {
            updateSessionAttribute(req, PRICE_ENTRY_ATTRIBUTE, errorCheck);
            redirectTo(res, '/priceEntry');
            return;
        }

        const mappedData = faresTriangleDataMapper(req);
        const uuid = getUuidFromCookie(req, res);
        await putDataInS3(uuid, JSON.stringify(mappedData));

        updateSessionAttribute(req, INPUT_METHOD_ATTRIBUTE, { inputMethod: 'manual' });

        const journeyAttribute = getSessionAttribute(req, JOURNEY_ATTRIBUTE);

        if (isJourney(journeyAttribute) && journeyAttribute?.outboundJourney) {
            redirectTo(res, '/outboundMatching');
            return;
        }
        redirectTo(res, '/matching');
    } catch (error) {
        const message = 'There was a problem generating the priceEntry JSON:';
        redirectToError(res, message, 'api.priceEntry', error);
    }
    res.end();
};
