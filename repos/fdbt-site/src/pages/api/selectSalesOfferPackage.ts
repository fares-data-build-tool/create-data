import { NextApiResponse } from 'next';
import Cookies from 'cookies';
import { redirectTo, redirectToError, getUuidFromCookie, unescapeAndDecodeCookie } from './apiUtils';
import {
    getSingleTicketJson,
    getReturnTicketJson,
    getPeriodGeoZoneTicketJson,
    getPeriodMultipleServicesTicketJson,
    getFlatFareTicketJson,
    putUserDataInS3,
} from './apiUtils/userData';
import { isSessionValid } from './apiUtils/validator';
import { SALES_OFFER_PACKAGES_ATTRIBUTE, FARE_TYPE_COOKIE, PERIOD_TYPE_COOKIE } from '../../constants';
import { NextApiRequestWithSession } from '../../interfaces';
import { updateSessionAttribute } from '../../utils/sessions';

export interface SelectSalesOfferPackageWithError {
    errorMessage: string;
}

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        const cookies = new Cookies(req, res);
        const fareTypeCookie = unescapeAndDecodeCookie(cookies, FARE_TYPE_COOKIE);
        if (!fareTypeCookie) {
            throw new Error('No fare type cookie found.');
        }
        const fareTypeObject = JSON.parse(fareTypeCookie);
        const { fareType } = fareTypeObject;

        if (fareType !== 'single' && fareType !== 'return' && fareType !== 'period' && fareType !== 'flatFare') {
            throw new Error('No fare type found to generate user data json.');
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            const salesOfferPackagesAttributeError: SelectSalesOfferPackageWithError = {
                errorMessage: 'Choose at least one service from the options',
            };
            updateSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE, salesOfferPackagesAttributeError);
            redirectTo(res, `/selectSalesOfferPackage`);
            return;
        }

        const uuid = getUuidFromCookie(req, res);

        let userDataJson;

        if (fareType === 'single') {
            userDataJson = getSingleTicketJson(req, res);
        } else if (fareType === 'return') {
            userDataJson = getReturnTicketJson(req, res);
        } else if (fareType === 'period') {
            const periodTypeCookie = unescapeAndDecodeCookie(cookies, PERIOD_TYPE_COOKIE);
            const periodTypeObject = JSON.parse(periodTypeCookie);
            const { periodTypeName } = periodTypeObject;

            if (periodTypeName !== 'periodGeoZone' && periodTypeName !== 'periodMultipleServices') {
                throw new Error('No fare type found to generate user data json.');
            }

            if (periodTypeName === 'periodGeoZone') {
                userDataJson = await getPeriodGeoZoneTicketJson(req, res);
            } else if (periodTypeName === 'periodMultipleServices') {
                userDataJson = getPeriodMultipleServicesTicketJson(req, res);
            }
        } else if (fareType === 'flatFare') {
            userDataJson = getFlatFareTicketJson(req, res);
        }

        if (userDataJson) {
            await putUserDataInS3(userDataJson, uuid);
            redirectTo(res, '/thankyou');
        }
        return;
    } catch (error) {
        const message =
            'There was a problem processing the selected sales offer packages from the salesOfferPackage page:';
        redirectToError(res, message, 'api.selectSalesOfferPackage', error);
    }
};
