import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import {
    OPERATOR_COOKIE,
    PERIOD_PRODUCT_COOKIE,
    PERIOD_EXPIRY_COOKIE,
    MATCHING_DATA_BUCKET_NAME,
    CSV_ZONE_UPLOAD_COOKIE,
    DAYS_VALID_COOKIE,
    PERIOD_SINGLE_OPERATOR_SERVICES_COOKIE,
    PERIOD_TYPE_COOKIE,
} from '../../constants';
import { getDomain, setCookieOnResponseObject, redirectToError, redirectTo, unescapeAndDecodeCookie } from './apiUtils';
import { batchGetStopsByAtcoCode, Stop } from '../../data/auroradb';
import { getCsvZoneUploadData, putStringInS3 } from '../../data/s3';
import { isPeriodCookiesUUIDMatch, isSessionValid } from './service/validator';

interface DecisionData {
    operatorName: string;
    type: string;
    productName: string;
    productPrice: string;
    daysValid: string;
    expiryRules: string;
    nocCode: string;
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        if (!isPeriodCookiesUUIDMatch(req, res)) {
            throw new Error('Cookie UUIDs do not match');
        }

        if (req.body.periodValid) {
            const { periodValid } = req.body;

            const cookies = new Cookies(req, res);

            const periodProductCookie = unescapeAndDecodeCookie(cookies, PERIOD_PRODUCT_COOKIE);
            const daysValidCookie = unescapeAndDecodeCookie(cookies, DAYS_VALID_COOKIE);
            const operatorCookie = unescapeAndDecodeCookie(cookies, OPERATOR_COOKIE);
            const fareZoneCookie = unescapeAndDecodeCookie(cookies, CSV_ZONE_UPLOAD_COOKIE);
            const singleOperatorCookie = unescapeAndDecodeCookie(cookies, PERIOD_SINGLE_OPERATOR_SERVICES_COOKIE);
            const periodTypeCookie = unescapeAndDecodeCookie(cookies, PERIOD_TYPE_COOKIE);

            if (
                periodProductCookie === '' ||
                daysValidCookie === '' ||
                (operatorCookie === '' && (fareZoneCookie === '' || singleOperatorCookie))
            ) {
                throw new Error('Necessary cookies not found for period validity page');
            }

            let props = {};
            const { productName, productPrice } = JSON.parse(periodProductCookie);
            const { daysValid } = JSON.parse(daysValidCookie);
            const { operator, uuid, nocCode } = JSON.parse(operatorCookie);
            const { periodTypeName } = JSON.parse(periodTypeCookie);

            if (fareZoneCookie) {
                const { fareZoneName } = JSON.parse(fareZoneCookie);
                const atcoCodes: string[] = await getCsvZoneUploadData(uuid);
                const zoneStops: Stop[] = await batchGetStopsByAtcoCode(atcoCodes);

                if (zoneStops.length === 0) {
                    throw new Error(`No stops found for atcoCodes: ${atcoCodes}`);
                }

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
                PERIOD_EXPIRY_COOKIE,
                JSON.stringify({ periodValid, error: false }),
                req,
                res,
            );

            const period: DecisionData = {
                operatorName: operator,
                type: periodTypeName,
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
        } else {
            const cookieValue = JSON.stringify({
                errorMessage: 'Choose an option regarding your period ticket validity',
            });
            setCookieOnResponseObject(getDomain(req), PERIOD_EXPIRY_COOKIE, cookieValue, req, res);
            redirectTo(res, '/periodValidity');
        }
    } catch (error) {
        const message = 'There was a problem selecting the period validity:';
        redirectToError(res, message, error);
    }
};
