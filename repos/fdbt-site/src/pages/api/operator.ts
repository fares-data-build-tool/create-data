import { NextApiRequest, NextApiResponse } from 'next';
import v1 from 'uuid';
import { OPERATOR_COOKIE } from '../../constants/index';
import { operatorBusinessLogic } from './service/businessLogic';
import { getDomain, setCookieOnResponseObject, getCookies } from './apiUtils';

export default (req: NextApiRequest, res: NextApiResponse) => {

    console.log(req.body.operator)

    try {
        const cookies = getCookies(req);
        const operatorCookie = cookies[OPERATOR_COOKIE];

        if (operatorCookie) {
            res.writeHead(302, {
                Location: '/faretype',
            });
        } else {

            if(!req.body.operator){
                res.writeHead(302,{
                    Location: '/operator'
                })
            }
            
            const { OperatorName, NOCCode } = JSON.parse(req.body.operator);
            operatorBusinessLogic(OperatorName);
            const uuid = v1();
            console.log(OperatorName);
            console.log(NOCCode);
            const cookieValue = JSON.stringify({ operator:OperatorName, uuid , NOCCode});
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
