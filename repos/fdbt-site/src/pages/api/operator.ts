import { NextApiRequest, NextApiResponse } from 'next';
import v1 from 'uuid';
import { OPERATOR_COOKIE } from '../../constants/index';
import { operatorBusinessLogic } from './service/businessLogic';
import { getDomain, setCookieOnResponseObject, getCookies } from './apiUtils';

export default (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const cookies = getCookies(req);
        const operatorCookie = cookies[OPERATOR_COOKIE];

        if (operatorCookie) {
            res.writeHead(302, {
                Location: '/faretype',
            });
        } else {
            const { operator } = req.body;
            operatorBusinessLogic(operator);
            const uuid = v1();
            const cookieValue = JSON.stringify({ operator, uuid });
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
