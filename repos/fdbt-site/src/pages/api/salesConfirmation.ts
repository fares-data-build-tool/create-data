import { saveProductsEnabled, myFaresEnabled, exportEnabled } from '../../constants/featureFlag';
import moment from 'moment';
import { NextApiResponse } from 'next';
import { insertProducts } from '../../data/auroradb';
import {
    CARNET_FARE_TYPE_ATTRIBUTE,
    PRODUCT_DATE_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
} from '../../constants/attributes';
import { NextApiRequestWithSession, TicketPeriodWithInput } from '../../interfaces';
import { isTicketRepresentation } from '../../interfaces/typeGuards';
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
    putUserDataInProductsBucket,
} from '../../utils/apiUtils/userData';
import { TicketWithIds } from '../../../shared/matchingJsonTypes';
import { triggerExport } from '../../utils/apiUtils/export';

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

        let userDataJson: TicketWithIds | undefined;

        const ticketRepresentation = getSessionAttribute(req, TICKET_REPRESENTATION_ATTRIBUTE);
        const ticketType = isTicketRepresentation(ticketRepresentation) ? ticketRepresentation.name : '';

        if (isSchemeOperator(req, res)) {
            const baseSchemeOperatorJson = getSchemeOperatorTicketJson(req, res);
            userDataJson = await adjustSchemeOperatorJson(req, res, baseSchemeOperatorJson);
        } else if (fareType === 'single') {
            userDataJson = getSingleTicketJson(req, res);
        } else if (fareType === 'return') {
            userDataJson = getReturnTicketJson(req, res);
        } else if (fareType === 'period' || fareType === 'multiOperator' || fareType === 'flatFare') {
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
            const carnetAttribute = getSessionAttribute(req, CARNET_FARE_TYPE_ATTRIBUTE);
            const dataFormat = getSessionAttribute(req, TXC_SOURCE_ATTRIBUTE)?.source;

            userDataJson.carnet = carnetAttribute;
            const noc = getAndValidateNoc(req, res);
            const filePath = await putUserDataInProductsBucket(userDataJson, uuid, noc);
            if (saveProductsEnabled && (ticketType === 'geoZone' || dataFormat !== 'tnds')) {
                const { startDate, endDate } = userDataJson.ticketPeriod;
                if (!startDate || !endDate) {
                    throw new Error('Start or end date could not be found.');
                }
                const dateTime = moment().toDate();
                const lineId = 'lineId' in userDataJson ? userDataJson.lineId : undefined;
                await insertProducts(noc, filePath, dateTime, userDataJson.type, lineId, startDate, endDate);
            }

            if (!myFaresEnabled || !exportEnabled) {
                // if my fares or export isn't enabled we want to trigger the export lambda for a single
                await triggerExport({ noc, paths: [filePath] });
            }

            redirectTo(res, '/thankyou');
        }
        return;
    } catch (error) {
        const message = 'There was a problem processing the information needed for the user data to be put in s3:';
        redirectToError(res, message, 'api.salesConfirmation', error);
    }
};
