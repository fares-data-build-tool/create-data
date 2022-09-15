import { ReturnTicket, SingleTicket, WithIds } from 'fdbt-types/matchingJsonTypes';
import moment from 'moment';
import { NextApiResponse } from 'next';
import {
    getPointToPointProductsByLineId,
    getProductById,
    getProductIdByMatchingJsonLink,
    getServiceByIdAndDataSource,
} from '../../data/auroradb';
import { getProductsMatchingJson } from '../../data/s3';
import { NextApiRequestWithSession } from '../../interfaces';
import { isPointToPointTicket } from '../../interfaces/typeGuards';
import { getAndValidateNoc, redirectTo, redirectToError } from '../../utils/apiUtils';
import { insertDataToProductsBucketAndProductsTable } from '../../utils/apiUtils/userData';
import { buildUuid } from '../fareType';

const findTicketsToMakeReturn = async (
    noc: string,
    lineId: string,
    passengerTypeId: number,
    outboundDirection: string,
    inboundDirection: string,
    productId: string,
): Promise<WithIds<SingleTicket>[]> => {
    const originalProduct = await getProductById(noc, productId);
    const originalTicket = await getProductsMatchingJson(originalProduct.matchingJsonLink);

    const products = await getPointToPointProductsByLineId(noc, lineId);
    const matchingJsonLinks = products.map((product) => product.matchingJsonLink);
    const tickets = await Promise.all(
        matchingJsonLinks.map(async (link) => {
            return await getProductsMatchingJson(link);
        }),
    );

    const chosenTickets: WithIds<SingleTicket>[] = [];

    tickets.forEach((ticket) => {
        let chosenOutboundSingleTicket;
        let chosenInboundSingleTicket;

        if ((originalTicket as WithIds<SingleTicket>).journeyDirection === outboundDirection) {
            chosenOutboundSingleTicket = originalTicket;
        } else {
            chosenInboundSingleTicket = originalTicket;
        }
        let expired = false;

        if (ticket.ticketPeriod.endDate) {
            const today = moment.utc().startOf('day').valueOf();
            const endDateAsUnixTime = moment.utc(ticket.ticketPeriod.endDate, 'DD/MM/YYYY').valueOf();
            if (endDateAsUnixTime < today) {
                expired = true;
            }
        }

        if (!expired) {
            if (isPointToPointTicket(ticket) && ticket.type === 'single') {
                if ('journeyDirection' in ticket && ticket.passengerType.id === passengerTypeId) {
                    if (ticket.journeyDirection === outboundDirection && !chosenOutboundSingleTicket) {
                        chosenOutboundSingleTicket = ticket;
                        chosenTickets.push(chosenOutboundSingleTicket);
                    } else if (ticket.journeyDirection === inboundDirection && !chosenInboundSingleTicket) {
                        chosenInboundSingleTicket = ticket;
                        chosenTickets.push(chosenInboundSingleTicket);
                    }
                }
            }
        }
    });

    if (chosenTickets.length === 2) {
        return chosenTickets;
    }

    return [];
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { lineId, productId, serviceId, passengerTypeId } = req.query;

        if (
            typeof lineId !== 'string' ||
            typeof productId !== 'string' ||
            typeof serviceId !== 'string' ||
            typeof passengerTypeId !== 'string'
        ) {
            throw new Error('Generate return API called with incorrect parameters.');
        }
        const noc = getAndValidateNoc(req, res);

        const service = await getServiceByIdAndDataSource(noc, Number(serviceId), 'bods');
        const directions = Array.from(
            service.journeyPatterns.reduce((set, pattern) => {
                set.add(pattern.direction);
                return set;
            }, new Set<string>()),
        );

        const outboundDirection = directions.find((it) => ['outbound', 'clockwise'].includes(it));
        const inboundDirection = directions.find((it) => ['inbound', 'antiClockwise'].includes(it));

        if (!outboundDirection || !inboundDirection) {
            redirectTo(
                res,
                `/products/productDetails?productId=${productId}&serviceId=${serviceId}&generateReturn=false`,
            );
            return;
        }

        const result = await findTicketsToMakeReturn(
            noc,
            lineId,
            Number(passengerTypeId),
            outboundDirection,
            inboundDirection,
            productId,
        );

        if (result.length !== 2) {
            redirectTo(
                res,
                `/products/productDetails?productId=${productId}&serviceId=${serviceId}&generateReturn=false`,
            );
            return;
        } else {
            // create return

            const outboundTicket = result.find(
                (ticket) => ticket.journeyDirection === outboundDirection,
            ) as WithIds<SingleTicket>;
            const inboundTicket = result.find(
                (ticket) => ticket.journeyDirection === inboundDirection,
            ) as WithIds<SingleTicket>;

            const uuid = buildUuid(noc);
            const returnTicket: WithIds<ReturnTicket> = {
                type: 'return',
                passengerType: outboundTicket.passengerType,
                lineName: outboundTicket.lineName,
                lineId: outboundTicket.lineId,
                nocCode: outboundTicket.nocCode,
                operatorName: outboundTicket.operatorName,
                serviceDescription: outboundTicket.serviceDescription,
                email: outboundTicket.email,
                uuid,
                timeRestriction: outboundTicket.timeRestriction,
                ticketPeriod: outboundTicket.ticketPeriod,
                products: outboundTicket.products,
                inboundFareZones: inboundTicket.fareZones,
                outboundFareZones: outboundTicket.fareZones,
                returnPeriodValidity: {
                    amount: '1',
                    typeOfDuration: 'day',
                },
                unassignedStops: {
                    inboundUnassignedStops: [],
                    outboundUnassignedStops: [],
                },
            };

            const newJsonLink = await insertDataToProductsBucketAndProductsTable(returnTicket, noc, uuid, '', 'bods', {
                req,
                res,
            });

            const newProductId = await getProductIdByMatchingJsonLink(noc, newJsonLink);

            redirectTo(res, `/products/productDetails?productId=${newProductId}&serviceId=${serviceId}`);
            return;
        }
    } catch (error) {
        const message = 'There was a problem generating a return.';
        redirectToError(res, message, 'api.generateReturn.', error);
    }
};
