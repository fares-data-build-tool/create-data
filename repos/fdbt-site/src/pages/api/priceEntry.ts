import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { FARE_STAGES_COOKIE } from '../../constants/index';
import { getUuidFromCookie, redirectToError, redirectTo } from './apiUtils';
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

export const priceInputIsValid = (req: NextApiRequest, res: NextApiResponse): boolean => {
    const cookies = new Cookies(req, res);
    const fareStagesCookie = unescape(decodeURI(cookies.get(FARE_STAGES_COOKIE) || ''));
    const fareStagesObject = JSON.parse(fareStagesCookie);
    const numberOfFareStages = fareStagesObject.fareStages;
    const expectedNumberOfPriceInputs = (numberOfFareStages * (numberOfFareStages - 1)) / 2;
    const numberofInputInApiRequest = Object.entries(req.body).length;
    console.log(Object.entries(req.body));
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

export const putDataInS3 = async (uuid: string, text: string): Promise<void> => {
    if (!process.env.USER_DATA_BUCKET_NAME) {
        throw new Error('Bucket name environment variable not set.');
    }
    await putStringInS3(process.env.USER_DATA_BUCKET_NAME, `${uuid}.json`, text, 'application/json; charset=utf-8');
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        if (!priceInputIsValid(req, res)) {
            redirectTo(res, '/priceEntry');
            return;
        }
        const mappedData = faresTriangleDataMapper(req);
        const uuid = getUuidFromCookie(req, res);
        await putDataInS3(uuid, JSON.stringify(mappedData));
        redirectTo(res, '/matching');
    } catch (error) {
        console.error(`There was a problem generating the priceEntry JSON: ${error.stack}`);
        redirectToError(res);
    }
    res.end();
};
