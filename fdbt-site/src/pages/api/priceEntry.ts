import { NextApiRequest, NextApiResponse } from 'next';
import { STAGE_NAMES_COOKIE } from '../../constants/index';
import { getCookies, redirectToError, redirectTo } from './apiUtils';
import { putStringInS3 } from '../../data/s3';

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

export const priceInputIsValid = (req: NextApiRequest): boolean => {
    const cookies = getCookies(req);
    const stageNamesCookie = unescape(decodeURI(cookies[STAGE_NAMES_COOKIE]));
    const numberOfStagesInCookie = JSON.parse(stageNamesCookie).length;
    const expectedNumberOfPriceInputs = numberOfStagesInCookie ** 2 / 2;
    const numberofInputInApiRequest = Object.entries(req.body).length;
    if (expectedNumberOfPriceInputs === numberofInputInApiRequest) {
        return true;
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

        if (price) {
            if (!Number.isNaN(Number(price))) {
                if (!fareTriangle[originFareStageName][price]) {
                    fareTriangle[originFareStageName][price] = {
                        price: (parseFloat(price) / 100).toFixed(2),
                        fareZones: [],
                    };
                }
                fareTriangle[originFareStageName][price].fareZones.push(destinationFareStageName);
            }
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

export const getUuidFromCookie = (req: NextApiRequest): string => {
    const cookies = getCookies(req);
    const stageNamesCookie = unescape(decodeURI(cookies[STAGE_NAMES_COOKIE]));
    const stageNamesObject = JSON.parse(stageNamesCookie);
    const { uuid } = stageNamesObject;
    if (!uuid) {
        throw new Error('No UUID found');
    } else {
        return uuid;
    }
};

export const putDataInS3 = async (uuid: string, text: string): Promise<void> => {
    if (!process.env.USER_DATA_BUCKET_NAME) {
        throw new Error('Bucket name environment variable not set.');
    }
    await putStringInS3(process.env.USER_DATA_BUCKET_NAME, `${uuid}.json`, text, 'application/json; charset=utf-8');
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        if (!priceInputIsValid(req)) {
            return;
        }
        const mappedData = faresTriangleDataMapper(req);
        const uuid = getUuidFromCookie(req);
        await putDataInS3(uuid, JSON.stringify(mappedData));
        redirectTo(res, '/matching');
    } catch (error) {
        console.error(`There was a problem generating the priceEntry JSON: ${error.stack}`);
        redirectToError(res);
    }
    res.end();
};
