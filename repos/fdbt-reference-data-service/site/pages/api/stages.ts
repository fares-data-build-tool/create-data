import { NextApiRequest, NextApiResponse } from 'next';
import { isSessionValid, isCookiesUUIDMatch } from './service/validator';
import { stagesBusinessLogic } from './service/businessLogic';

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (isSessionValid(req) && isCookiesUUIDMatch(req)){
        try {
            const stages = req.body.stages;
            stagesBusinessLogic(stages);

            res.writeHead(302, {
                Location: '/confirmation'
            });
        }catch (error) {
            res.writeHead(302, {
                Location: '/error'
            });
        }
    }else{
        res.writeHead(302, {
            Location: '/error'
        });
    }
    res.end();
}