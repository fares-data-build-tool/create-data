import { saveProductsEnabled } from './../../constants/featureFlag';
import moment from 'moment';
import { NextApiResponse } from 'next';
import { insertProducts } from '../../data/auroradb';
import {
    CARNET_FARE_TYPE_ATTRIBUTE,
    GROUP_PASSENGER_INFO_ATTRIBUTE,
    GROUP_SIZE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    PRODUCT_DATE_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
} from '../../constants/attributes';
import { NextApiRequestWithSession, Ticket, TicketPeriodWithInput } from '../../interfaces';
import { isPassengerType, isTicketRepresentation } from '../../interfaces/typeGuards';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';

import {
    getAndValidateNoc,
    getFareTypeFromFromAttributes,
    getUuidFromSession,
    isSchemeOperator,
    redirectTo,
    redirectToError,
} from '../../utils/apiUtils';
import {
    adjustSchemeOperatorJson,
    getGeoZoneTicketJson,
    getHybridTicketJson,
    getMultipleServicesTicketJson,
    getReturnTicketJson,
    getPointToPointPeriodJson,
    getSchemeOperatorTicketJson,
    getSingleTicketJson,
    putUserDataInS3,
} from '../../utils/apiUtils/userData';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const fareType = getFareTypeFromFromAttributes(req);

        const productDating = getSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE) as TicketPeriodWithInput | undefined;

        updateSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE, {
            startDate: productDating && productDating.startDate ? productDating.startDate : moment().toISOString(),
            endDate:
                productDating && productDating.endDate ? productDating.endDate : moment().add(100, 'y').toISOString(),
            dateInput: productDating
                ? productDating.dateInput
                : {
                      startDateDay: '',
                      startDateMonth: '',
                      startDateYear: '',
                      endDateDay: '',
                      endDateMonth: '',
                      endDateYear: '',
                  },
        });

        const uuid = getUuidFromSession(req);

        let userDataJson: Ticket | undefined;

        if (isSchemeOperator(req, res)) {
            const baseSchemeOperatorJson = getSchemeOperatorTicketJson(req, res);
            userDataJson = await adjustSchemeOperatorJson(req, res, baseSchemeOperatorJson);
        } else if (fareType === 'single') {
            userDataJson = getSingleTicketJson(req, res);
        } else if (fareType === 'return') {
            userDataJson = getReturnTicketJson(req, res);
        } else if (fareType === 'period' || fareType === 'multiOperator' || fareType === 'flatFare') {
            const ticketRepresentation = getSessionAttribute(req, TICKET_REPRESENTATION_ATTRIBUTE);
            const ticketType = isTicketRepresentation(ticketRepresentation) ? ticketRepresentation.name : '';

            switch (ticketType) {
                case 'geoZone':
                    userDataJson = await getGeoZoneTicketJson(req, res);
                    break;
                case 'multipleServices':
                    userDataJson = getMultipleServicesTicketJson(req, res);
                    break;
                case 'hybrid':
                    userDataJson = await getHybridTicketJson(req, res);
                    break;
                case 'pointToPointPeriod':
                    userDataJson = getPointToPointPeriodJson(req, res);
                    break;
                default:
                    throw new Error(
                        `Fare type of '${fareType}' and Ticket type of '${ticketType} not compatible. User data json cannot be created.`,
                    );
            }
        }

        if (userDataJson) {
            const sessionGroup = getSessionAttribute(req, GROUP_PASSENGER_INFO_ATTRIBUTE);
            const groupSize = getSessionAttribute(req, GROUP_SIZE_ATTRIBUTE);
            const passengerTypeAttribute = getSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE);
            const carnetAttribute = getSessionAttribute(req, CARNET_FARE_TYPE_ATTRIBUTE);
            const dataFormat = getSessionAttribute(req, TXC_SOURCE_ATTRIBUTE)?.source;

            if (
                sessionGroup &&
                groupSize &&
                isPassengerType(passengerTypeAttribute) &&
                passengerTypeAttribute.passengerType === 'group'
            ) {
                userDataJson.groupDefinition = {
                    maxPeople: groupSize.maxGroupSize,
                    companions: sessionGroup,
                };
            }

            userDataJson.carnet = carnetAttribute;
            const noc = getAndValidateNoc(req, res);
            const filePath = await putUserDataInS3(userDataJson, uuid, noc);
            if (saveProductsEnabled && dataFormat !== 'tnds') {
                const { startDate, endDate } = userDataJson.ticketPeriod;
                if (!startDate || !endDate) {
                    throw new Error('Start or end date could not be found.');
                }
                const dateTime = moment().toDate();
                const lineId: string | undefined = 'lineId' in userDataJson ? userDataJson.lineId : undefined;
                await insertProducts(noc, filePath, dateTime, userDataJson.type, lineId, startDate, endDate);
            }

            redirectTo(res, '/thankyou');
        }
        return;
    } catch (error) {
        const message = 'There was a problem processing the information needed for the user data to be put in s3:';
        redirectToError(res, message, 'api.salesConfirmation', error);
    }
};
