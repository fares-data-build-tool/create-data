import { NextApiResponse } from 'next';
import { TYPE_OF_CAP_ATTRIBUTE } from '../../constants/attributes';
import { NextApiRequestWithSession } from '../../interfaces/index';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { updateSessionAttribute } from '../../utils/sessions';

const typeOfCapIsValid = (typeOfCap: string): boolean => {
    const validTypesOfCap = ['byDistance', 'byTaps', 'byProducts'];

    return validTypesOfCap.includes(typeOfCap);
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const { typeOfCap } = req.body;

        if (!typeOfCap || !typeOfCapIsValid(typeOfCap)) {
            updateSessionAttribute(req, TYPE_OF_CAP_ATTRIBUTE, {
                errorMessage: 'Choose a type of cap',
                id: 'radio-option-byDistance',
            });
            redirectTo(res, '/typeOfCap');
            return;
        }

        if (typeOfCap === 'byProducts') {
            redirectTo(res, '/selectCappedProductGroup');
        } else {
            redirectTo(res, '/typeOfCap');
            return;
        }
    } catch (error) {
        const message = 'There was a problem in the type of cap API:';
        redirectToError(res, message, 'api.typeOfCap', error);
    }
};
