import { SERVICE_COOKIE, OPERATOR_COOKIE } from '../../constants/index';
import { NextApiRequest, NextApiResponse } from 'next';
import { isSessionValid } from './service/validator';
import { getDomain, setCookieOnResponseObject, getCookies } from './apiUtils';
import { serviceBusinessLogic } from './service/businessLogic';

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (isSessionValid(req)) {
        try {
            const cookies = getCookies(req);
            const serviceCookie = cookies[SERVICE_COOKIE];
            if (serviceCookie) {
                res.writeHead(302, {
                    Location: '/stages'
                });
            } else {
                const service = req.body.service;
                serviceBusinessLogic(service);
                const cookies = getCookies(req);
                const operatorCookie = unescape(decodeURI(cookies[OPERATOR_COOKIE]));
                const operatorObject = JSON.parse(operatorCookie);
                const uuid = operatorObject.uuid;

                const cookieValue = JSON.stringify({ service, uuid })
                const domain = getDomain(req);
                setCookieOnResponseObject(domain, SERVICE_COOKIE, cookieValue, res);
                res.writeHead(302, {
                    Location: '/stages'
                });
            }
        } catch (error) {
            res.writeHead(302, {
                Location: '/error'
            });
        }
    } else {
        res.writeHead(302, {
            Location: '/error'
        });
    }
    res.end();
}