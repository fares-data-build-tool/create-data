import { NextApiResponse } from 'next';
import {
    CARNET_FARE_TYPE_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
} from '../../constants/attributes';
import { NextApiRequestWithSession } from '../../interfaces';
import { isTicketRepresentation } from '../../interfaces/typeGuards';
import { getSessionAttribute } from '../../utils/sessions';
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
    splitUserDataJsonByProducts,
    insertDataToProductsBucketAndProductsTable,
    getCappedTicketJson,
    getMultipleServicesByDistanceTicketJson,
} from '../../utils/apiUtils/userData';
import { TicketWithIds } from '../../interfaces/matchingJsonTypes';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const fareType = getFareTypeFromFromAttributes(req);

        if (fareType === 'capped') {
            redirectTo(res, '/productCreated');
            return;
        }

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
        } else if (fareType === 'capped') {
            if (
                !ticketType ||
                ticketType === 'hybrid' ||
                ticketType === 'pointToPointPeriod' ||
                ticketType === 'multipleServicesPricedByDistance'
            ) {
                throw new Error('Capped ticket required a type of ticket representation of geoZone or multiService.');
            }
            userDataJson = await getCappedTicketJson(req, res, ticketType);
        } else if (['period', 'multiOperator', 'flatFare'].includes(fareType)) {
            switch (ticketType) {
                case 'geoZone':
                    userDataJson = await getGeoZoneTicketJson(req, res);
                    break;
                case 'multipleServices':
                    userDataJson = getMultipleServicesTicketJson(req, res);
                    break;
                case 'multipleServicesPricedByDistance':
                    userDataJson = getMultipleServicesByDistanceTicketJson(req, res);
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
            console.log(JSON.stringify(userDataJson));
            //{"products":[{"salesOfferPackages":{"id":1},"pricingByDistance":{"maximumPrice":"5","minimumPrice":"2","capPricing":[{"distanceFrom":"0","distanceTo":"Max","pricePerKm":"4"}],"productName":"flat fare fake"}}],"selectedServices":[{"lineName":"1","lineId":"4YyoI0","serviceCode":"NW_05_BLAC_1_1","serviceDescription":"FLEETWOOD - BLACKPOOL via Promenade"},{"lineName":"2C","lineId":"vySmfewe0","serviceCode":"NW_05_BLAC_2C_1","serviceDescription":"KNOTT END - POULTON - BLACKPOOL"}],"termTime":false}
            const carnetAttribute = getSessionAttribute(req, CARNET_FARE_TYPE_ATTRIBUTE);
            const dataFormat = getSessionAttribute(req, TXC_SOURCE_ATTRIBUTE)?.source;

            userDataJson.carnet = carnetAttribute;
            const noc = getAndValidateNoc(req, res);

            if (userDataJson.products.length > 1) {
                const splitUserDataJson = splitUserDataJsonByProducts(userDataJson);

                splitUserDataJson.map(async (splitJson, index) => {
                    await insertDataToProductsBucketAndProductsTable(splitJson, noc, `${uuid}_${index}`, { req, res });
                });

                await putUserDataInProductsBucket(userDataJson, uuid, noc);
            } else {
                await insertDataToProductsBucketAndProductsTable(userDataJson, noc, uuid, {
                    req,
                    res,
                });
            }

            if (ticketType === 'geoZone' || dataFormat !== 'tnds') {
                redirectTo(res, '/productCreated');
                return;
            }

            redirectTo(res, '/thankyou');
            return;
        }

        return;
    } catch (error) {
        const message = 'There was a problem processing the information needed for the user data to be put in s3:';
        redirectToError(res, message, 'api.salesConfirmation', error);
    }
};
