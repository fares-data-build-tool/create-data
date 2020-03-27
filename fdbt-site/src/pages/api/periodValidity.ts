import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import {
    OPERATOR_COOKIE,
    PERIOD_PRODUCT,
    PERIOD_EXPIRY,
    MATCHING_DATA_BUCKET_NAME,
    CSV_ZONE_UPLOAD_COOKIE,
    VALIDITY_COOKIE,
    PERIOD_SINGLE_OPERATOR_SERVICES,
} from '../../constants';
import { getDomain, setCookieOnResponseObject, redirectToError, redirectTo } from './apiUtils';
import { batchGetStopsByAtcoCode, Stop } from '../../data/dynamodb';
import { getCsvZoneUploadData, putStringInS3 } from '../../data/s3';
import { isPeriodCookiesUUIDMatch } from './service/validator';

interface DecisionData {
    operatorName: string;
    type: string;
    productName: string;
    productPrice: string;
    daysValid: string;
    expiryRules: string;
    nocCode: string;
}

// eslint-disable-next-line @typescript-eslint/require-await
export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        if (!isPeriodCookiesUUIDMatch(req, res)) {
            throw new Error('Cookie UUIDs do not match');
        }

        const { periodValid } = req.body;

        if (!periodValid) {
            const error = { error: true };
            setCookieOnResponseObject(getDomain(req), PERIOD_EXPIRY, JSON.stringify(error), req, res);
            redirectTo(res, '/periodValidity');
            return;
        }

        const cookies = new Cookies(req, res);

        const periodProduct = unescape(decodeURI(cookies.get(PERIOD_PRODUCT) || ''));
        const daysValidCookie = unescape(decodeURI(cookies.get(VALIDITY_COOKIE) || ''));
        const operatorCookie = unescape(decodeURI(cookies.get(OPERATOR_COOKIE) || ''));
        const fareZoneCookie = unescape(decodeURI(cookies.get(CSV_ZONE_UPLOAD_COOKIE) || ''));
        const singleOperatorCookie = unescape(decodeURI(cookies.get(PERIOD_SINGLE_OPERATOR_SERVICES) || ''));

        if (
            periodProduct === '' ||
            daysValidCookie === '' ||
            (operatorCookie === '' && (fareZoneCookie === '' || singleOperatorCookie))
        ) {
            throw new Error('Necessary cookies not found for period validity page');
        }

        let props = {};
        const { productName, productPrice } = JSON.parse(periodProduct);
        const { daysValid } = JSON.parse(daysValidCookie);
        const { operator, uuid, nocCode } = JSON.parse(operatorCookie);

        if (fareZoneCookie) {
            const { fareZoneName } = JSON.parse(fareZoneCookie);
            const atcoCodes: string[] = await getCsvZoneUploadData(uuid);
            const zoneStops: Stop[] = await batchGetStopsByAtcoCode(atcoCodes);

            props = {
                zoneName: fareZoneName,
                stops: zoneStops,
            };
        }

        if (singleOperatorCookie) {
            const { selectedServices } = JSON.parse(singleOperatorCookie);
            props = {
                selectedServices,
            };
        }

        setCookieOnResponseObject(
            getDomain(req),
            PERIOD_EXPIRY,
            JSON.stringify({ periodValid, error: false }),
            req,
            res,
        );

        const period: DecisionData = {
            operatorName: operator,
            type: 'period',
            productName,
            productPrice,
            daysValid,
            expiryRules: periodValid,
            nocCode,
            ...props,
        };

        await putStringInS3(
            MATCHING_DATA_BUCKET_NAME,
            `${uuid}.json`,
            JSON.stringify(period),
            'application/json; charset=utf-8',
        );

        redirectTo(res, '/thankyou');
    } catch (error) {
        redirectToError(res);
    }
};
