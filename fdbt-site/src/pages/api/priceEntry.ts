import { NextApiRequest, NextApiResponse } from 'next';
// import { STAGE_NAMES_COOKIE } from '../../constants/index';
// import { getCookies, redirectToError, redirectTo } from './apiUtils';
import { redirectToError, redirectTo } from './apiUtils';
// import { putStringInS3 } from '../../data/s3';

// interface UserFareStages {
//     fareStages: {
//         stageName: string;
//         prices: {
//             price: string;
//             fareZones: string[];
//         }[];
//     }[];
// }

interface FareTriangleData {
    fareStages: {
        stageName: string | unknown;
        prices: {
            [key: string]: {
                price: string;
                fareZones: string | unknown[];
            };
        };
    }[];
}

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        const items: [string, unknown][] = Object.entries(req.body);

        for (let itemNum = 0; itemNum < items.length; itemNum += 1) {
            const reorganisedItemArrays = [];
            const fareTriangle: FareTriangleData = {
                fareStages: [],
            };

            const item = items[itemNum];
            const cellRef = item[0];
            const splitCellRefAsArray = cellRef.split('-');
            const originFareStageName = splitCellRefAsArray[0];
            const destinationFareStageName = splitCellRefAsArray[1];
            reorganisedItemArrays.push(originFareStageName, destinationFareStageName, item[1]);

            const stageName = reorganisedItemArrays[0];

            fareTriangle.fareStages[itemNum] = {
                stageName,
                prices: {},
            };

            // const priceZoneName = reorganisedItemArrays[1];
            // const price = reorganisedItemArrays[2];

            // if (price) {
            //     // Check explicitly for number to account for invalid fare data
            //     if (!Number.isNaN(Number(price))) {
            //         if (fareTriangle.fareStages?.[itemNum].prices?.[price]?.fareZones)
            //             fareTriangle.fareStages[itemNum].prices[price].fareZones.push(priceZoneName);
            //     } else {
            //         fareTriangle.fareStages[itemNum].prices[price] = {
            //             price: (parseFloat(price) / 100).toFixed(2),
            //             fareZones: [priceZoneName],
            //         };
            //     }

            console.log(fareTriangle);

            // const cookies = getCookies(req);
            // const stageNamesCookie = unescape(decodeURI(cookies[STAGE_NAMES_COOKIE]));
            // const stageNamesObject = JSON.parse(stageNamesCookie);
            // const { uuid } = stageNamesObject;
            // if (!uuid) {
            //     throw new Error('No UUID found');
            // }

            // const uuid = "gd1234";

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            // const bucketName: string = process.env.USER_DATA_BUCKET_NAME!;
            // const key = `${uuid}.json`;
            // const contentType = 'application/json; charset=utf-8';
            // putStringInS3(bucketName, key, stringifiedBodyValues, contentType);
        }

        redirectTo(res, '/matching');
    } catch (error) {
        redirectToError(res);
    }

    res.end();
};
