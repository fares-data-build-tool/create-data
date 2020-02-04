import { NextApiRequest, NextApiResponse } from 'next';
import { FARETYPE_COOKIE, OPERATOR_COOKIE } from '../../constants/index';
import { getDomain, setCookieOnResponseObject, getCookies } from './apiUtils';

export default (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const cookies = getCookies(req);
        const faretypeCookie = cookies[FARETYPE_COOKIE];

        if (faretypeCookie) {
            res.writeHead(302, {
                Location: '/service',
            });
        } else {
            const { faretype } = req.body;

            if(!faretype){
                res.writeHead(302,{
                    Location: '/faretype'
                })
            }

            const operatorCookie = unescape(decodeURI(cookies[OPERATOR_COOKIE]));
            const operatorObject = JSON.parse(operatorCookie);
            const { uuid } = operatorObject;

            const cookieValue = JSON.stringify({ faretype, uuid });
            const domain = getDomain(req);
            setCookieOnResponseObject(domain, FARETYPE_COOKIE, cookieValue, res);
            res.writeHead(302, {
                Location: '/service',
            });
        }
    } catch (error) {
        res.writeHead(302, {
            Location: '/error',
        });
    }
    res.end();
};
