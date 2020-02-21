import { NextApiRequest, NextApiResponse } from 'next';
import { STAGENAMES_COOKIE } from '../../constants/index';
import { getCookies, redirectToError, redirectTo } from './apiUtils';
import { putStringInS3 } from '../../data/s3';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        const cookies = getCookies(req);

        const { priceEntry } = req.body;

        if (!priceEntry) {
            redirectTo(res, '/priceEntry');
            return;
        }

        const stageNamesCookie = unescape(decodeURI(cookies[STAGENAMES_COOKIE]));
        const stageNamesObject = JSON.parse(stageNamesCookie);
        const { uuid } = stageNamesObject;

        if (!uuid) {
            throw new Error('No UUID found');
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const bucketName: string = process.env.USER_DATA_BUCKET_NAME!;
        const key = `${uuid}.json`;
        const contentType = 'application/json; charset=utf-8';
        putStringInS3(bucketName, key, priceEntry, contentType);

        redirectTo(res, '/matching');
    } catch (error) {
        redirectToError(res);
    }
    res.end();
};
