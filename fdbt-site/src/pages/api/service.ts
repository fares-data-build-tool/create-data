import { NextApiRequest, NextApiResponse } from 'next';
import { getUuidFromCookie, getDomain, setCookieOnResponseObject, redirectToError, redirectTo } from './apiUtils/index';
import { SERVICE_COOKIE } from '../../constants/index';
import { isSessionValid } from './service/validator';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }
        const { service } = req.body;

        if (!service) {
            redirectTo(res, '/service');
            return;
        }

        const uuid = getUuidFromCookie(req, res);

        if (!uuid) {
            throw new Error('No UUID found');
        }

        const cookieValue = JSON.stringify({ service, uuid });
        setCookieOnResponseObject(getDomain(req), SERVICE_COOKIE, cookieValue, req, res);
        redirectTo(res, '/direction');
    } catch (error) {
        const message = 'There was a problem selecting the service:';
        redirectToError(res, message, error);
    }
};
