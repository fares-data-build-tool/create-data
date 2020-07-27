import { NextApiRequest, NextApiResponse } from 'next';
import { setCookieOnResponseObject, redirectTo, redirectToError } from './apiUtils/index';
import { isSessionValid } from './apiUtils/validator';
import { INPUT_METHOD_COOKIE } from '../../constants';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        if (req.body.inputMethod) {
            switch (req.body.inputMethod) {
                case 'csv':
                    redirectTo(res, '/csvUpload');
                    return;
                case 'manual':
                    redirectTo(res, '/howManyStages');
                    return;
                case 'interactiveMap':
                    // redirect to map page
                    return;
                default:
                    throw new Error('Input method we expect was not received.');
            }
        } else {
            const cookieValue = JSON.stringify({ errorMessage: 'Choose an input method from the options' });
            setCookieOnResponseObject(INPUT_METHOD_COOKIE, cookieValue, req, res);
            redirectTo(res, '/inputMethod');
        }
    } catch (error) {
        const message = 'There was a problem selecting the input method for the triangle:';
        redirectToError(res, message, 'api.inputMethod', error);
    }
};
