import { NextApiResponse } from 'next';
import {
    CAPS_DEFINITION_ATTRIBUTE,
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
} from '../../constants/attributes';
import { getCapByNocAndId } from '../../data/auroradb';
import { getAndValidateNoc, redirectTo, redirectToError } from '../../utils/apiUtils/index';
import { Cap, NextApiRequestWithSession } from 'src/interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { putUserDataInProductsBucketWithFilePath } from '../../utils/apiUtils/userData';

const getCapContent = async (cap: number, noc: string): Promise<Cap & { id: number }> => {
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

        const noc = getAndValidateNoc(req, res);

        if (capChoice === 'yes' && !cap) {
            const errors = {
                errors: [{ errorMessage: 'Choose one of the premade caps', id: 'caps' }],
            };

            updateSessionAttribute(req, CAPS_DEFINITION_ATTRIBUTE, errors);
            redirectTo(res, '/selectCaps');
            return;
        }

        if (capChoice === 'yes' && !Number.isInteger(Number(cap))) {
            throw Error(`Received invalid cap id: ${cap}`);
        }

        const selectedCap = capChoice === 'yes' ? await getCapContent(Number(cap), noc) : undefined;
        const ticket = getSessionAttribute(req, MATCHING_JSON_ATTRIBUTE);
        const matchingJsonMetaData = getSessionAttribute(req, MATCHING_JSON_META_DATA_ATTRIBUTE);

        // if in edit mode
        if (ticket && matchingJsonMetaData) {
            const updatedTicket = {
                ...ticket,
                cap: capChoice === 'yes' && !!selectedCap ? { id: selectedCap.id } : undefined,
            };

            await putUserDataInProductsBucketWithFilePath(updatedTicket, matchingJsonMetaData.matchingJsonLink);
            updateSessionAttribute(req, CAPS_DEFINITION_ATTRIBUTE, undefined);

            redirectTo(
                res,
                `/products/productDetails?productId=${matchingJsonMetaData?.productId}${
                    matchingJsonMetaData.serviceId ? `&serviceId=${matchingJsonMetaData?.serviceId}` : ''
                }`,
            );
            return;
        }
        // end of edit mode

        updateSessionAttribute(
            req,
            CAPS_DEFINITION_ATTRIBUTE,
            capChoice === 'yes' && !!selectedCap ? { id: selectedCap.id } : undefined,
        );

        redirectTo(res, '/selectPurchaseMethods');
        return;
    } catch (error) {
        const message = 'There was a problem in the selectCaps API.';
        redirectToError(res, message, 'api.selectCaps', error);
    }
};
