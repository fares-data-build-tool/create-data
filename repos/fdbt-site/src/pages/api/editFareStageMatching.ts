import { NextApiResponse } from 'next';
import {
    getFareZonesEditTicket,
    getMatchingFareZonesAndUnassignedStopsFromForm,
    isFareStageUnassignedEditTicket,
} from '../../utils/apiUtils/matching';
import {
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
    EDIT_FARE_STAGE_MATCHING_ATTRIBUTE,
    DIRECTION_ATTRIBUTE,
} from '../../constants/attributes';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { putUserDataInProductsBucketWithFilePath } from '../../utils/apiUtils/userData';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { getFareStagesFromTicket } from '../editFareStageMatching';
import { ReturnTicket, SingleTicket, WithIds } from '../../interfaces/matchingJsonTypes';
import { isReturnTicket } from '../../utils';
import { MatchingFareZonesData } from '../../interfaces/matchingInterface';

const getSelectedFareStages = (matchingFareZones: MatchingFareZonesData[]): { [key: string]: string } => {
    const obj: { [key: string]: string } = {};

    matchingFareZones.forEach((fareZone) => {
        fareZone.stops.forEach((stop) => {
            obj[stop.atcoCode] = fareZone.name;
        });
    });
    return obj;
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const ticket = getSessionAttribute(req, MATCHING_JSON_ATTRIBUTE) as
            | WithIds<SingleTicket>
            | WithIds<ReturnTicket>
            | undefined;
        const ticketMetaData = getSessionAttribute(req, MATCHING_JSON_META_DATA_ATTRIBUTE);
        const { overrideWarning } = req.body;

        // edit mode
        if (!ticket || !ticketMetaData) {
            throw new Error('Ticket details not found');
        }

        const parsedInputs = getMatchingFareZonesAndUnassignedStopsFromForm(req);

        const { matchingFareZones, unassignedStops } = parsedInputs;
        const userFareStages = getFareStagesFromTicket(ticket);

        if (isFareStageUnassignedEditTicket(userFareStages, matchingFareZones) && matchingFareZones !== {}) {
            const errors: ErrorInfo[] = [
                {
                    errorMessage: 'One or more fare stages have not been assigned, assign each fare stage to a stop',
                    id: 'option-0',
                },
            ];

            const selectedFareStages = getSelectedFareStages(Object.values(matchingFareZones));
            if (ticket && isReturnTicket(ticket)) {
                if (!overrideWarning) {
                    updateSessionAttribute(req, EDIT_FARE_STAGE_MATCHING_ATTRIBUTE, {
                        selectedFareStages,
                        warning: true,
                    });
                    redirectTo(res, '/editFareStageMatching');
                    return;
                }
            } else {
                updateSessionAttribute(req, EDIT_FARE_STAGE_MATCHING_ATTRIBUTE, { selectedFareStages, errors });
                redirectTo(res, '/editFareStageMatching');
                return;
            }
        }

        if (ticket.type === 'single') {
            const formatMatchingFareZones = getFareZonesEditTicket(userFareStages, matchingFareZones, ticket.fareZones);

            const updatedTicket = {
                ...ticket,
                fareZones: formatMatchingFareZones,
                unassignedStops: {
                    singleUnassignedStops: unassignedStops,
                },
            };
            await putUserDataInProductsBucketWithFilePath(updatedTicket, ticketMetaData.matchingJsonLink);
        } else {
            const directionAttribute = getSessionAttribute(req, DIRECTION_ATTRIBUTE);
            const formatMatchingFareZones = getFareZonesEditTicket(
                userFareStages,
                matchingFareZones,
                ticket.outboundFareZones,
            );

            if (directionAttribute && 'direction' in directionAttribute && directionAttribute.direction === 'inbound') {
                const updatedTicket = {
                    ...ticket,
                    inboundFareZones: formatMatchingFareZones,
                    unassignedStops: {
                        inboundUnassignedStops: unassignedStops,
                    },
                };
                await putUserDataInProductsBucketWithFilePath(updatedTicket, ticketMetaData.matchingJsonLink);
            } else {
                const updatedTicket = {
                    ...ticket,
                    outboundFareZones: formatMatchingFareZones,
                    unassignedStops: {
                        outboundUnassignedStops: unassignedStops,
                    },
                };
                await putUserDataInProductsBucketWithFilePath(updatedTicket, ticketMetaData.matchingJsonLink);
                updateSessionAttribute(req, DIRECTION_ATTRIBUTE, { direction: 'inbound' });

                redirectTo(res, '/editFareStageMatching');
                return;
            }
        }

        updateSessionAttribute(req, EDIT_FARE_STAGE_MATCHING_ATTRIBUTE, undefined);
        updateSessionAttribute(req, DIRECTION_ATTRIBUTE, undefined);

        redirectTo(
            res,
            `/products/productDetails?productId=${ticketMetaData?.productId}${
                ticketMetaData.serviceId ? `&serviceId=${ticketMetaData?.serviceId}` : ''
            }`,
        );
        return;
    } catch (error) {
        const message = 'There was a problem mapping the fare stage for edit ticket';
        redirectToError(res, message, 'api.editFareStageMatching', error);
    }
};
