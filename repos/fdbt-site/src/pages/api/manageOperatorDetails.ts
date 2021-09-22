import { NextApiResponse } from 'next';
import { redirectTo, redirectToError, getAndValidateNoc, checkEmailValid } from '../../utils/apiUtils';
import { updateSessionAttribute } from '../../utils/sessions';
import { NextApiRequestWithSession } from '../../interfaces';
import { GS_OPERATOR_DETAILS_ATTRIBUTE } from '../../constants/attributes';
import { removeExcessWhiteSpace } from '../../utils/apiUtils/validator';
import { upsertOperatorDetails } from '../../data/auroradb';
import { OperatorDetails } from 'shared/matchingJsonTypes';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const operatorName = req.body.operatorName;
        const contactNumber = req.body.contactNumber;
        const email = req.body.email;
        const url = req.body.url;
        const street = req.body.street;
        const town = req.body.town;
        const county = req.body.county;
        const postcode = req.body.postcode;

        if (
            typeof operatorName !== 'string' ||
            typeof contactNumber !== 'string' ||
            typeof email !== 'string' ||
            typeof url !== 'string' ||
            typeof street !== 'string' ||
            typeof town !== 'string' ||
            typeof county !== 'string' ||
            typeof postcode !== 'string'
        ) {
            throw Error('one of the parameters is not a string!');
        }

        const trimmedOperatorDetails: OperatorDetails = {
            operatorName: removeExcessWhiteSpace(operatorName),
            contactNumber: removeExcessWhiteSpace(contactNumber),
            email: removeExcessWhiteSpace(email),
            url: removeExcessWhiteSpace(url),
            street: removeExcessWhiteSpace(street),
            town: removeExcessWhiteSpace(town),
            county: removeExcessWhiteSpace(county),
            postcode: removeExcessWhiteSpace(postcode),
        };

        const errors = Object.entries(trimmedOperatorDetails)
            .filter((entry) => entry[1].length < 1)
            .map((entry) => ({ id: entry[0], errorMessage: 'All fields are mandatory' }));

        if (!/^[0-9+() ]+$/.exec(contactNumber)) {
            errors.push({ id: 'contactNumber', errorMessage: 'Provide a valid phone number' });
        }

        if (!checkEmailValid(email)) {
            errors.push({ id: 'email', errorMessage: 'Provide a valid email' });
        }

        if (!/^[^ ]+$/.exec(url)) {
            errors.push({ id: 'url', errorMessage: 'Provide a valid URL' });
        }

        if (!/^[a-zA-Z0-9]+ [a-zA-Z0-9]+$/.exec(postcode)) {
            errors.push({ id: 'postcode', errorMessage: 'Provide a valid postcode' });
        }

        if (errors.length > 0) {
            updateSessionAttribute(req, GS_OPERATOR_DETAILS_ATTRIBUTE, {
                input: trimmedOperatorDetails,
                errors: errors,
            });
        } else {
            const noc = getAndValidateNoc(req, res);
            await upsertOperatorDetails(noc, trimmedOperatorDetails);

            updateSessionAttribute(req, GS_OPERATOR_DETAILS_ATTRIBUTE, { saved: true });
        }

        redirectTo(res, `/manageOperatorDetails`);
    } catch (err) {
        const message = 'There was a problem in the manage operator details API.';
        redirectToError(res, message, 'api.manageOperatorDetails', err);
    }
};
