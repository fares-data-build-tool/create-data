import { NextApiRequest, NextApiResponse } from 'next';
import isEmpty from 'lodash/isEmpty';

import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { JOURNEY_ATTRIBUTE, INPUT_METHOD_ATTRIBUTE, PRICE_ENTRY_ATTRIBUTE } from '../../constants/attributes';
import { USER_DATA_BUCKET_NAME } from '../../constants';

import { getUuidFromSession, redirectToError, redirectTo } from './apiUtils';
import { putStringInS3 } from '../../data/s3';
import { removeAllWhiteSpace } from './apiUtils/validator';
import { isJourney } from '../../interfaces/typeGuards';
import {
    FaresInformation,
    FaresInput,
    NextApiRequestWithSession,
    PriceEntryError,
    UserFareStages,
} from '../../interfaces';

interface ManualFareTriangleData {
    [stageName: string]: {
        [price: string]: {
            price: string;
            fareZones: string[];
        };
    };
}

export const inputsValidityCheck = (req: NextApiRequest): FaresInformation => {
    const errors: PriceEntryError[] = [];
    const priceEntries = Object.entries(req.body);
    const allEmpty = !priceEntries.find(priceEntry => priceEntry[1] !== '');
    if (allEmpty) {
        priceEntries.forEach(priceEntry => {
            errors.push({
                input: 'There must be at least one price entered',
                locator: removeAllWhiteSpace(priceEntry[0]),
            });
        });
    }
    const sortedInputs: FaresInput[] = priceEntries.map(priceEntry => {
        if (priceEntry[1] !== '0' || Number(priceEntry[1]) !== 0) {
            if (Number.isNaN(Number(priceEntry[1])) || Number(priceEntry[1]) % 1 !== 0) {
                errors.push({
                    input: 'Prices must be whole numbers or empty',
                    locator: removeAllWhiteSpace(priceEntry[0]),
                });
            }
        }
        return {
            input: priceEntry[1] as string,
            locator: removeAllWhiteSpace(priceEntry[0]),
        };
    });
    return {
        inputs: sortedInputs,
        errorInformation: errors,
    };
};

export const faresTriangleDataMapper = (req: NextApiRequest): UserFareStages => {
    const arrayOfFareItemArrays: string[][] = Object.entries(req.body);
    const fareTriangle: ManualFareTriangleData = {};

    for (let itemNum = 0; itemNum < arrayOfFareItemArrays.length; itemNum += 1) {
        const cellRef = arrayOfFareItemArrays[itemNum][0];
        const splitCellRefAsArray = cellRef.split('-');
        const destinationFareStageName = splitCellRefAsArray[0];
        const originFareStageName = splitCellRefAsArray[1];
        const price = arrayOfFareItemArrays[itemNum][1];

        if (!fareTriangle[originFareStageName]) {
            fareTriangle[originFareStageName] = {};
        }

        if (price) {
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

        const errorCheck: FaresInformation = inputsValidityCheck(req);

        if (errorCheck.errorInformation.length > 0) {
            updateSessionAttribute(req, PRICE_ENTRY_ATTRIBUTE, errorCheck);
            redirectTo(res, '/priceEntry');
            return;
        }

        const mappedData = faresTriangleDataMapper(req);
        const uuid = getUuidFromSession(req);
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
