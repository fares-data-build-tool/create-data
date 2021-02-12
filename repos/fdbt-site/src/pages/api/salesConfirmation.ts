import moment from 'moment';
import { NextApiResponse } from 'next';
import { isPassengerType, isTicketRepresentation } from '../../interfaces/typeGuards';
import {
    PRODUCT_DATE_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    GROUP_SIZE_ATTRIBUTE,
    GROUP_PASSENGER_INFO_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
} from '../../constants/attributes';

import {
    redirectTo,
    redirectToError,
    getUuidFromSession,
    isSchemeOperator,
    getFareTypeFromFromAttributes,
} from './apiUtils';
import {
    getSingleTicketJson,
    getReturnTicketJson,
    getGeoZoneTicketJson,
    getMultipleServicesTicketJson,
    getFlatFareTicketJson,
    putUserDataInS3,
    getSchemeOperatorTicketJson,
} from './apiUtils/userData';
import { NextApiRequestWithSession, TicketPeriod } from '../../interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const fareType = getFareTypeFromFromAttributes(req);

        const productDating = getSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE) as TicketPeriod | undefined;

        updateSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE, {
            startDate: productDating && productDating.startDate ? productDating.startDate : moment().toISOString(),
            endDate:
                productDating && productDating.endDate
                    ? productDating.endDate
                    : moment()
                          .add(100, 'y')
                          .toISOString(),
        });

        const uuid = getUuidFromSession(req);

        let userDataJson;

        if (isSchemeOperator(req, res)) {
            userDataJson = await getSchemeOperatorTicketJson(req, res);
        } else if (fareType === 'single') {
            userDataJson = getSingleTicketJson(req, res);
        } else if (fareType === 'return') {
            userDataJson = getReturnTicketJson(req, res);
        } else if (fareType === 'period' || fareType === 'multiOperator') {
            const ticketRepresentation = getSessionAttribute(req, TICKET_REPRESENTATION_ATTRIBUTE);
            const ticketType = isTicketRepresentation(ticketRepresentation) ? ticketRepresentation.name : '';

            if (ticketType !== 'geoZone' && ticketType !== 'multipleServices') {
                throw new Error(
                    `Fare type of '${fareType}' and Ticket type of '${ticketType} not compatible. User data json cannot be created.`,
                );
            }

            if (ticketType === 'geoZone') {
                userDataJson = await getGeoZoneTicketJson(req, res);
            } else {
                userDataJson = getMultipleServicesTicketJson(req, res);
            }
        } else if (fareType === 'flatFare') {
            userDataJson = getFlatFareTicketJson(req, res);
        }

        if (userDataJson) {
            const sessionGroup = getSessionAttribute(req, GROUP_PASSENGER_INFO_ATTRIBUTE);
            const groupSize = getSessionAttribute(req, GROUP_SIZE_ATTRIBUTE);
            const passengerTypeAttribute = getSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE);

            const group =
                !!sessionGroup &&
                !!groupSize &&
                isPassengerType(passengerTypeAttribute) &&
                passengerTypeAttribute.passengerType === 'group';

            if (group) {
                const userDataWithGroupJson = {
                    ...userDataJson,
                    groupDefinition: {
                        maxPeople: groupSize?.maxGroupSize,
                        companions: sessionGroup,
                    },
                };

                await putUserDataInS3(userDataWithGroupJson, uuid);
            } else {
                await putUserDataInS3(userDataJson, uuid);
            }

            redirectTo(res, '/thankyou');
        }
        return;
    } catch (error) {
        const message = 'There was a problem processing the information needed for the user data to be put in s3:';
        redirectToError(res, message, 'api.salesConfirmation', error);
    }
};
