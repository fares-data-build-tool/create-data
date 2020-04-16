import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { FARE_STAGES_COOKIE, USER_DATA_BUCKET_NAME } from '../../constants/index';
import { getUuidFromCookie, redirectToError, redirectTo } from './apiUtils';
import { putStringInS3 } from '../../data/s3';
import { isSessionValid } from './service/validator';

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

export const numberOfInputsIsValid = (req: NextApiRequest, res: NextApiResponse): boolean => {
    const cookies = new Cookies(req, res);
    const fareStagesCookie = unescape(decodeURI(cookies.get(FARE_STAGES_COOKIE) || ''));
    const fareStagesObject = JSON.parse(fareStagesCookie);
    const numberOfFareStages = fareStagesObject.fareStages;
    const expectedNumberOfPriceInputs = (numberOfFareStages * (numberOfFareStages - 1)) / 2;
    const numberOfInputInApiRequest = Object.entries(req.body).length;

    return expectedNumberOfPriceInputs === numberOfInputInApiRequest;
};

export const priceIsValid = (req: NextApiRequest): boolean => {
    const arrayOfFareItemArrays: string[][] = Object.entries(req.body);
    for (let itemNum = 0; itemNum < arrayOfFareItemArrays.length; itemNum += 1) {
        const price = arrayOfFareItemArrays[itemNum][1];
        if (!Number.isNaN(Number(price))) {
            return true;
        }
    }
    return false;
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

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        if (!numberOfInputsIsValid(req, res) || !priceIsValid(req)) {
            redirectTo(res, '/priceEntry');
            return;
        }
        const mappedData = faresTriangleDataMapper(req);
        const uuid = getUuidFromCookie(req, res);
        await putDataInS3(uuid, JSON.stringify(mappedData));
        redirectTo(res, '/matching');
    } catch (error) {
        const message = 'There was a problem generating the priceEntry JSON:';
        redirectToError(res, message, error);
    }
    res.end();
};
