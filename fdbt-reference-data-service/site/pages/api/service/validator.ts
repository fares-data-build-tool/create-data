import { NextApiRequest } from 'next';
import { OPERATOR_COOKIE, SERVICE_COOKIE } from '../../../constants/index';
import { getCookies } from '../apiUtils';

export function isSessionValid(req: NextApiRequest){
    const cookies = getCookies(req);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    if (operatorCookie){
        return true;
    } else {
        return false;
    }
}

export function isCookiesUUIDMatch(req: NextApiRequest){
    const cookies = getCookies(req);
    const operatorCookie = unescape(decodeURI(cookies[OPERATOR_COOKIE])); 
    const serviceCookie = unescape(decodeURI(cookies[SERVICE_COOKIE])); 
    const operatorObject = JSON.parse(operatorCookie);
    const serviceObject = JSON.parse(serviceCookie);
    if (operatorObject.uuid == serviceObject.uuid){
        return true;
    } else {
        return false;
    }
}

