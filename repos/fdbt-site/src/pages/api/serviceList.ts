import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { isArray } from 'util';
import { getDomain, redirectTo, redirectToError, setCookieOnResponseObject, unescapeAndDecodeCookie } from './apiUtils';
import { isSessionValid } from './service/validator';
import { SERVICE_LIST_COOKIE, FARE_TYPE_COOKIE } from '../../constants';

interface ServiceList {
    selectedServices: string[];
    error: boolean;
}

const setServiceListCookie = (
    req: NextApiRequest,
    res: NextApiResponse,
    error?: boolean,
    checkedServiceList?: string[],
): void => {
    const serviceListObject: ServiceList = { error: false, selectedServices: [] };

    setCookieOnResponseObject(
        getDomain(req),
        SERVICE_LIST_COOKIE,
        JSON.stringify({ ...serviceListObject, selectedServices: checkedServiceList, error: !!error }),
        req,
        res,
    );
};

export default (req: NextApiRequest, res: NextApiResponse): void => {
    const redirectUrl = '/serviceList';
    const selectAllText = 'Select All';

    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        const cookies = new Cookies(req, res);
        const fareTypeCookie = unescapeAndDecodeCookie(cookies, FARE_TYPE_COOKIE);
        const fareTypeObject = JSON.parse(fareTypeCookie);

        if (!fareTypeObject || !fareTypeObject.fareType) {
            throw new Error('Failed to retrieve FARE_TYPE_COOKIE info for serviceList API');
        }

        const refererUrl = req?.headers?.referer;
        const queryString = refererUrl?.substring(refererUrl?.indexOf('?') + 1);
        const { selectAll } = req.body;

        const isSelected = selectAll === selectAllText;

        if (selectAll && queryString) {
            setServiceListCookie(req, res);
            redirectTo(res, `${redirectUrl}?selectAll=${isSelected}`);
            return;
        }

        if ((!req.body || Object.keys(req.body).length === 0) && !selectAll) {
            setServiceListCookie(req, res, true);
            redirectTo(res, `${redirectUrl}?selectAll=false`);
            return;
        }

        const checkedServiceList: string[] = [];

        const requestBody: { [key: string]: string | string[] } = req.body;

        Object.entries(requestBody).forEach(entry => {
            const lineNameStartDate = entry[0];
            const description = entry[1];
            let serviceDescription: string;
            if (isArray(description)) {
                [serviceDescription] = description;
            } else {
                serviceDescription = description;
            }
            const data = `${lineNameStartDate}#${serviceDescription}`;
            checkedServiceList.push(data);
        });

        setServiceListCookie(req, res, false, checkedServiceList);

        if (fareTypeObject.fareType === 'flatFare') {
            redirectTo(res, '/productDetails');
            return;
        }

        redirectTo(res, '/howManyProducts');
        return;
    } catch (error) {
        const message = 'There was a problem processing the selected services from the servicesList page:';
        redirectToError(res, message, error);
    }
};
