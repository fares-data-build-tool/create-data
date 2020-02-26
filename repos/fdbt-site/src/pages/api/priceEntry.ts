import { NextApiRequest, NextApiResponse } from 'next';
// import { STAGE_NAMES_COOKIE } from '../../constants/index';
// import { getCookies, redirectToError, redirectTo } from './apiUtils';
import { redirectToError, redirectTo } from './apiUtils';
// import { putStringInS3 } from '../../data/s3';

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

// export const getUuidFromCookie = (req: NextApiRequest): string => {
//     const cookies = getCookies(req);
//     const stageNamesCookie = unescape(decodeURI(cookies[STAGE_NAMES_COOKIE]));
//     const stageNamesObject = JSON.parse(stageNamesCookie);
//     const { uuid } = stageNamesObject;
//     if (!uuid) {
//         throw new Error('No UUID found');
//     } else {
//         return uuid;
//     }
// };

// export const putDataInS3 = ( uuid: string, text: string ) => {
//     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//     const bucketName: string = process.env.USER_DATA_BUCKET_NAME!;
//     const key = `${uuid}.json`;
//     const contentType = 'application/json; charset=utf-8';
//     putStringInS3(bucketName, key, text, contentType);
// };

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        const arrayOfFareItemArrays: string[][] = Object.entries(req.body);

        // TO DO: validate all input rows have prices

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
        console.log(mappedFareTriangle);

        // const uuid = getUuidFromCookie(req);
        // putStringInS3(uuid, text);
        redirectTo(res, '/matching');
    } catch (error) {
        console.error(`There was a problem generating the priceEntry JSON: ${error.stack}`);
        redirectToError(res);
    }
    res.end();
};
