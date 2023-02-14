import { NextApiResponse } from 'next';
import { CAPS_DEFINITION_ATTRIBUTE } from '../../constants/attributes';
import { getCapByNocAndId } from '../../data/auroradb';
import { getAndValidateNoc, redirectTo, redirectToError } from '../../utils/apiUtils/index';
import { CapInfo, NextApiRequestWithSession } from 'src/interfaces';
import { updateSessionAttribute } from '../../utils/sessions';

const getCapContent = async (cap: number, noc: string): Promise<CapInfo & { id: number }> => {
    const result = await getCapByNocAndId(noc, cap);

    if (!result) {
        throw new Error('No premade caps saved under the provided name');
    }

    return result;
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { capChoice, cap } = req.body;

        if (!capChoice) {
            const errors = {
                errors: [{ errorMessage: 'Choose one of the options below', id: 'no-caps' }],
            };

            updateSessionAttribute(req, CAPS_DEFINITION_ATTRIBUTE, errors);
            redirectTo(res, '/selectCaps');
            return;
        }

        if (capChoice === 'no') {
            updateSessionAttribute(req, CAPS_DEFINITION_ATTRIBUTE, undefined);
            redirectTo(res, '/selectPurchaseMethods');
            return;
        }

        const noc = getAndValidateNoc(req, res);

        if (capChoice === 'yes' && !cap) {
            const errors = {
                errors: [{ errorMessage: 'Choose one of the premade caps', id: 'caps' }],
            };

            updateSessionAttribute(req, CAPS_DEFINITION_ATTRIBUTE, errors);
            redirectTo(res, '/selectCaps');
            return;
        }

        if (!Number.isInteger(cap)) {
            throw Error(`Received invalid cap id ${req.body.id}`);
        }

        const selectedCap = await getCapContent(cap, noc);

        if (capChoice === 'yes' && !!selectedCap) {
            updateSessionAttribute(req, CAPS_DEFINITION_ATTRIBUTE, {
                id: selectedCap.id,
            });
            redirectTo(res, '/selectPurchaseMethods');
            return;
        }
    } catch (error) {
        const message = 'There was a problem in the defineCaps API.';
        redirectToError(res, message, 'api.defineCaps', error);
    }
};
