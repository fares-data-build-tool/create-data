import { NextApiRequest, NextApiResponse } from 'next';
import v1 from 'uuid';
import { OPERATOR_COOKIE } from '../../constants/index';
import { getDomain, setCookieOnResponseObject, getCookies } from './apiUtils';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        const cookies = getCookies(req);
        const operatorCookie = cookies[OPERATOR_COOKIE];

        if (operatorCookie) {
            res.writeHead(302, {
                Location: '/faretype',
            });
        } else {
            if (!req.body.operator) {
                res.writeHead(302, {
                    Location: '/operator',
                });
                res.end();
                return;
            }

            const { operatorName, nocCode } = JSON.parse(req.body.operator);
            const uuid = v1();
            const cookieValue = JSON.stringify({ operator: operatorName, uuid, nocCode });
            const domain = getDomain(req);
            setCookieOnResponseObject(domain, OPERATOR_COOKIE, cookieValue, res);
            res.writeHead(302, {
                Location: '/faretype',
            });
        }
    } catch (error) {
        res.writeHead(302, {
            Location: '/error',
        });
    }
    res.end();
};
