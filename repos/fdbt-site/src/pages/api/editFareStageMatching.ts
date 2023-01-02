import { NextApiResponse } from 'next';
import {
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
    MATCHING_ATTRIBUTE,
} from '../../constants/attributes';
import { NextApiRequestWithSession } from '../../interfaces';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { putUserDataInProductsBucketWithFilePath } from '../../utils/apiUtils/userData';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const ticket = getSessionAttribute(req, MATCHING_JSON_ATTRIBUTE);
        const ticketMetaData = getSessionAttribute(req, MATCHING_JSON_META_DATA_ATTRIBUTE);

        if (ticket && ticketMetaData) {
            // edit mode

            // ticket to be updated will be based upon the type
            const updatedTicket = {
                ...ticket,
                fareZones: Object.values([]),
                unassignedStops: {
                    singleUnassignedStops: [],
                },
            };

            await putUserDataInProductsBucketWithFilePath(updatedTicket, ticketMetaData.matchingJsonLink);
            updateSessionAttribute(req, MATCHING_ATTRIBUTE, undefined);

            redirectTo(
                res,
                `/products/productDetails?productId=${ticketMetaData?.productId}${
                    ticketMetaData.serviceId ? `&serviceId=${ticketMetaData?.serviceId}` : ''
                }`,
            );
            return;
        }
    } catch (error) {
        const message = 'There was a problem selecting the direction:';
        redirectToError(res, message, 'api.direction', error);
    }
};
