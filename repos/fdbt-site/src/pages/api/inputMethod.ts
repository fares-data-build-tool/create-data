import { NextApiResponse } from 'next';
import { redirectTo, redirectToError } from '../../utils/apiUtils/index';
import { INPUT_METHOD_ATTRIBUTE } from '../../constants/attributes';
import { updateSessionAttribute } from '../../utils/sessions';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
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
            const sessionContent: ErrorInfo = {
                errorMessage: 'Choose an input method from the options',
                id: 'csv-upload',
            };
            updateSessionAttribute(req, INPUT_METHOD_ATTRIBUTE, sessionContent);
            redirectTo(res, '/inputMethod');
        }
    } catch (error) {
        const message = 'There was a problem selecting the input method for the triangle:';
        redirectToError(res, message, 'api.inputMethod', error);
    }
};
