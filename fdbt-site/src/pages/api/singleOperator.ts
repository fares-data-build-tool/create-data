import { NextApiRequest, NextApiResponse } from 'next';
import { getDomain, getUuidFromCookie, redirectTo, redirectToError, setCookieOnResponseObject } from './apiUtils';
import { isSessionValid } from './service/validator';
import { PERIOD_SINGLE_OPERATOR_SERVICES } from '../../constants';
import { ServiceLists } from '../../interfaces';

const redirectUrl = '/singleOperator';
const serviceListObject: ServiceLists = { error: false, selectedServices: [] };

const setSingleOperatorCookie = (
    req: NextApiRequest,
    res: NextApiResponse,
    error?: boolean,
    checkServiceList?: any[],
) => {
    const uuid = getUuidFromCookie(req, res);

    setCookieOnResponseObject(
        getDomain(req),
        PERIOD_SINGLE_OPERATOR_SERVICES,
        JSON.stringify({ ...serviceListObject, selectedServices: checkServiceList, error: !!error, uuid }),
        req,
        res,
    );
};

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid');
        }

        const refererUrl = req?.headers?.referer;
        const queryString = refererUrl?.substring(refererUrl?.indexOf('?') + 1);
        const { selectAll } = req.body;

        if (selectAll && queryString) {
            setSingleOperatorCookie(req, res);
            redirectTo(res, `${redirectUrl}?selectAll=true`);
            return;
        }

        if ((!req.body || Object.keys(req.body).length === 0) && !selectAll) {
            setSingleOperatorCookie(req, res, true);
            redirectTo(res, `${redirectUrl}?selectAll=false`);
            return;
        }

        const checkedServiceList: any[] = [];

        Object.entries(req.body).forEach(entry => {
            checkedServiceList.push({ lineNumber: entry[0], startDate: entry[1] });
        });

        setSingleOperatorCookie(req, res, false, checkedServiceList);
        redirectTo(res, '/periodProduct');
        return;
    } catch (error) {
        redirectToError(res);
    }
};
