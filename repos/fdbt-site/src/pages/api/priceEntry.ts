import { NextApiRequest, NextApiResponse } from 'next';
// import { STAGE_NAMES_COOKIE } from '../../constants/index';
// import { getCookies, redirectToError, redirectTo } from './apiUtils';
import { redirectToError, redirectTo } from './apiUtils';
// import { putStringInS3 } from '../../data/s3';

// interface FaresTriangleItem {
//     key: string;
//     value: number;
// }

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        // const items: FaresTriangleItem [] = Object.entries(req.body).map((k, v) => ({k, v}));
        // if (!items) {
        //     redirectTo(res, '/priceEntry');
        //     return;
        // }
        // const stringifiedBodyValues = JSON.stringify(items);

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

        redirectTo(res, '/matching');
    } catch (error) {
        redirectToError(res);
    }

    res.end();
};
