import { NextApiResponse } from 'next';
import { getMatchingFareZonesAndUnassignedStopsFromForm } from '../../utils/apiUtils/matching';
import {
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
    EDIT_FARE_STAGE_MATCHING_ATTRIBUTE,
} from '../../constants/attributes';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { putUserDataInProductsBucketWithFilePath } from '../../utils/apiUtils/userData';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const ticket = getSessionAttribute(req, MATCHING_JSON_ATTRIBUTE);
        const ticketMetaData = getSessionAttribute(req, MATCHING_JSON_META_DATA_ATTRIBUTE);

        if (ticket && ticketMetaData) {
            // edit mode

            const parsedInputs = getMatchingFareZonesAndUnassignedStopsFromForm(req);

            const { matchingFareZones, unassignedStops } = parsedInputs;

            if (matchingFareZones !== {}) {
                const errors: ErrorInfo[] = [
                    {
                        errorMessage:
                            'One or more fare stages have not been assigned, assign each fare stage to a stop',
                        id: 'option-0',
                    },
                ];

                updateSessionAttribute(req, EDIT_FARE_STAGE_MATCHING_ATTRIBUTE, { errors });

                //redirectTo(res, '/editFareStageMatching');

                //return;
            }

            if (ticket.type === 'single') {
                const updatedTicket = {
                    ...ticket,
                    fareZones: Object.values(matchingFareZones),
                    unassignedStops: {
                        singleUnassignedStops: unassignedStops,
                    },
                };
                await putUserDataInProductsBucketWithFilePath(updatedTicket, ticketMetaData.matchingJsonLink);
            }

            updateSessionAttribute(req, EDIT_FARE_STAGE_MATCHING_ATTRIBUTE, undefined);

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
