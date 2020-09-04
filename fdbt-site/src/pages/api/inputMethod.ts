import { NextApiResponse } from 'next';
import { redirectTo, redirectToError } from './apiUtils/index';
import { isSessionValid } from './apiUtils/validator';
import { INPUT_METHOD_ATTRIBUTE } from '../../constants';
import { updateSessionAttribute } from '../../utils/sessions';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
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
            const sessionContent: ErrorInfo = { errorMessage: 'Choose an input method from the options', id: '' };
            updateSessionAttribute(req, INPUT_METHOD_ATTRIBUTE, sessionContent);
            redirectTo(res, '/inputMethod');
        }
    } catch (error) {
        const message = 'There was a problem selecting the input method for the triangle:';
        redirectToError(res, message, 'api.inputMethod', error);
    }
};
