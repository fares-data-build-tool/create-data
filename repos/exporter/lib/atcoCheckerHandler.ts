import { Handler } from 'aws-lambda';
import { S3Client } from '@aws-sdk/client-s3';
import { WithIds, ReturnTicket, SingleTicket, PointToPointPeriodTicket } from 'fdbt-types/matchingJsonTypes';
import {
    saveIdsOfServicesRequiringAttentionInTheDb,
    getServicesByLineIdAndNoc,
    getPointToPointProducts,
    removeAllServicesRequiringAttentionIds,
} from './database';
import { ExportLambdaBody } from 'fdbt-types/integrationTypes';
import { ServiceDetails } from 'fdbt-types/dbTypes';
import { getObject } from './s3';

const s3 =
    process.env.NODE_ENV === 'development'
        ? new S3Client({
              forcePathStyle: true,
              credentials: {
                  accessKeyId: 'S3RVER',
                  secretAccessKey: 'S3RVER',
              },
              endpoint: 'http://localhost:4572',
          })
        : new S3Client({ region: 'eu-west-2' });

const PRODUCTS_BUCKET = process.env.PRODUCTS_BUCKET;

export const handler: Handler<ExportLambdaBody> = async () => {
    console.log('triggered atco checker lambda...');

    if (!PRODUCTS_BUCKET) {
        throw new Error('Need to set PRODUCTS_BUCKET env variable');
    }

    await removeAllServicesRequiringAttentionIds();

    const pointToPointProducts: {
        id: number;
        lineId: string;
        matchingJsonLink: string;
        startDate: string;
        endDate: string;
    }[] = await getPointToPointProducts();

    for (let i = 0; i < pointToPointProducts.length; i++) {
        const pointToPointProduct = pointToPointProducts[i];
        const productId: number = pointToPointProduct.id;
        const path = pointToPointProduct.matchingJsonLink;

        const object = await getObject(s3, PRODUCTS_BUCKET, path, path);

        if (!object) {
            throw new Error(`body was not present [${path}]`);
        }

        const pointToPointTicket = JSON.parse(object.toString()) as
            | WithIds<SingleTicket>
            | WithIds<ReturnTicket>
            | WithIds<PointToPointPeriodTicket>;

        // check to see if single ticket
        if ('fareZones' in pointToPointTicket) {
            const idsOfServicesRequiringAttention: string[] = await getIdsOfServicesRequiringAttentionForSingles(
                pointToPointTicket,
                productId,
            );

            await saveIdsOfServicesRequiringAttentionInTheDb(productId, idsOfServicesRequiringAttention);
        } else if ('inboundFareZones' in pointToPointTicket && 'outboundFareZones' in pointToPointTicket) {
            // we have a return ticket
            const idsOfServicesRequiringAttention: string[] = await getIdsOfServicesRequiringAttentionForReturns(
                pointToPointTicket,
                productId,
            );

            await saveIdsOfServicesRequiringAttentionInTheDb(productId, idsOfServicesRequiringAttention);
        }
    }
};

/**
 * For single tickets; gets a list of ids for the serices that require
 * attention because of a change on the stops relating to the service.
 *
 * @param {singleTicket} the matching json for single ticket.
 *
 * @returns {Promise<string[]>} a string array containing the ids of the
 * services that require attention.
 */
const getIdsOfServicesRequiringAttentionForSingles = async (
    singleTicket: WithIds<SingleTicket>,
    productId: number,
): Promise<string[]> => {
    // all stops from the matching JSON
    let atcoCodesOfKnownStops: string[] = [];

    atcoCodesOfKnownStops = singleTicket.fareZones.flatMap((fareZone) =>
        fareZone.stops.flatMap((stop) => stop.atcoCode),
    );

    if (singleTicket.unassignedStops.singleUnassignedStops) {
        atcoCodesOfKnownStops.concat(
            singleTicket.unassignedStops.singleUnassignedStops.flatMap((stop) => stop.atcoCode),
        );
    }

    // by this point, atcoCodesOfKnownStops is populated.

    const { journeyDirection, lineId, nocCode } = singleTicket;

    const services = await getServicesByLineIdAndNoc(lineId, nocCode);

    const theStopsMatchingTheJourneyDirectionOnOurTicket = services.filter(
        (service) => service.direction === journeyDirection,
    );

    // split by service id and build a hashmap (dictionary) where the key is
    // the service id and the value is the array of stops
    const serviceAndStopsFromFeed = buildAHashmapSplitOnServiceId(theStopsMatchingTheJourneyDirectionOnOurTicket);

    // sort the stops and remove duplicates for each service
    const serviceAndSortedUniqueStopsFromFeed = sortAndRemoveDuplicateStops(serviceAndStopsFromFeed);

    // on our matching json stops, sort the stops and remove duplicates
    atcoCodesOfKnownStops = [...new Set(atcoCodesOfKnownStops)].sort();

    const servicesRequiringAttention = [];

    for (const key in serviceAndSortedUniqueStopsFromFeed) {
        const serviceId = key;
        const stops = serviceAndSortedUniqueStopsFromFeed[serviceId];

        if (JSON.stringify(stops) !== JSON.stringify(atcoCodesOfKnownStops)) {
            console.log('Stops require attention', { serviceId: serviceId, productId: productId });
            servicesRequiringAttention.push(serviceId);
        }
    }

    return servicesRequiringAttention;
};

/**
 * For return tickets; gets a list of ids for the serices that attention
 * because of a change on the stops relating to the service.
 *
 * @param {nonSingleTicket} the matching json for single ticket.
 *
 * @returns {Promise<string[]>} a string array containing the ids of the
 * services that require attention.
 */
const getIdsOfServicesRequiringAttentionForReturns = async (
    nonSingleTicket: WithIds<ReturnTicket> | WithIds<PointToPointPeriodTicket>,
    productId: number,
): Promise<string[]> => {
    let knownOutboundStops: string[] = [];
    let knownInboundStops: string[] = [];

    const outboundFareZones = nonSingleTicket.outboundFareZones;

    const inboundFareZones = nonSingleTicket.inboundFareZones;

    outboundFareZones.forEach((fareZone) => {
        fareZone.stops.forEach((stop) => {
            knownOutboundStops.push(stop.atcoCode);
        });
    });

    inboundFareZones.forEach((fareZone) => {
        fareZone.stops.forEach((stop) => {
            knownInboundStops.push(stop.atcoCode);
        });
    });

    if (nonSingleTicket.unassignedStops.outboundUnassignedStops) {
        nonSingleTicket.unassignedStops.outboundUnassignedStops.forEach((stop) => {
            knownOutboundStops.push(stop.atcoCode);
        });
    }

    if (nonSingleTicket.unassignedStops.inboundUnassignedStops) {
        nonSingleTicket.unassignedStops.inboundUnassignedStops.forEach((stop) => {
            knownInboundStops.push(stop.atcoCode);
        });
    }

    // by this point, we have all the inbound and outbound stops on our matching json

    const { lineId, nocCode } = nonSingleTicket;

    const services = await getServicesByLineIdAndNoc(lineId, nocCode);

    const outboundStopsFromFeed = services.filter((service) => service.direction === 'outbound');

    const inboundStopsFromFeed = services.filter((service) => service.direction === 'inbound');

    // for outbound stops, split by service id and build a hashmap (dictionary) where the key is
    // the service id and the value is the array of stops
    const outboundServiceAndStopsFromFeed = buildAHashmapSplitOnServiceId(outboundStopsFromFeed);

    // for inbound stops, split by service id and build a hashmap (dictionary) where the key is
    // the service id and the value is the array of stops
    const inboundServiceAndStopsFromFeed = buildAHashmapSplitOnServiceId(inboundStopsFromFeed);

    // sort the stops and remove duplicates for each service
    const outboundServiceAndSortedUniqueStopsFromFeed = sortAndRemoveDuplicateStops(outboundServiceAndStopsFromFeed);

    // sort the stops and remove duplicates for each service
    const inboundServiceAndSortedUniqueStopsFromFeed = sortAndRemoveDuplicateStops(inboundServiceAndStopsFromFeed);

    // our outbound matching json stops, sort the stops and remove duplicates
    knownOutboundStops = [...new Set(knownOutboundStops)].sort();

    // our inbound matching json stops, sort the stops and remove duplicates
    knownInboundStops = [...new Set(knownInboundStops)].sort();

    const outboundServicesRequiringAttention = [];
    const inboundServicesRequiringAttention = [];

    for (const key in outboundServiceAndSortedUniqueStopsFromFeed) {
        const serviceId = key;
        const stops = outboundServiceAndSortedUniqueStopsFromFeed[serviceId];

        if (JSON.stringify(stops) !== JSON.stringify(knownOutboundStops)) {
            console.log('Stops require attention', {
                serviceId: serviceId,
                productId: productId,
            });
            outboundServicesRequiringAttention.push(serviceId);
        }
    }

    for (const key in inboundServiceAndSortedUniqueStopsFromFeed) {
        const serviceId = key;
        const stops = inboundServiceAndSortedUniqueStopsFromFeed[serviceId];

        if (JSON.stringify(stops) !== JSON.stringify(knownInboundStops)) {
            console.log('Stops require attention', {
                serviceId: serviceId,
                productId: productId,
            });
            inboundServicesRequiringAttention.push(serviceId);
        }
    }

    const uniqueServicesRequiringAttention = new Set(
        outboundServicesRequiringAttention.concat(inboundServicesRequiringAttention),
    );

    return Array.from(uniqueServicesRequiringAttention);
};

/**
 * Builds and returns a hasmap (dictionary) where the service id is the key
 * and the stops array is the value.
 *
 * @param {ServiceDetails[]} directionsAndStopsArray
 *
 * @returns {{ [key: string]: string[] }} a hashmap (dictionary) with service id
 * as the key and the stops array as the value
 */
const buildAHashmapSplitOnServiceId = (directionsAndStopsArray: ServiceDetails[]): { [key: string]: string[] } => {
    const dictionary: { [key: string]: string[] } = {};

    directionsAndStopsArray.forEach((directionsAndStopsItem: ServiceDetails) => {
        const key = directionsAndStopsItem.serviceId;

        const value: string[] | undefined = dictionary[key];

        if (value !== undefined) {
            // we already have that serviceId as key
            value.push(directionsAndStopsItem.fromAtcoCode);
            value.push(directionsAndStopsItem.toAtcoCode);
        } else {
            dictionary[key] = [directionsAndStopsItem.fromAtcoCode, directionsAndStopsItem.toAtcoCode];
        }
    });

    return dictionary;
};

/**
 * Sorts and remove duplicates stops from the stops array for each service id
 *
 * @param {serviceAndStopsDictionary} a hashmap (dictionary) with service id
 *
 * @returns {{ [key: string]: string[] }} a hashmap (dictionary) with service id
 * as the key and unique and sorted stops array as the value
 */
const sortAndRemoveDuplicateStops = (serviceAndStopsDictionary: {
    [key: string]: string[];
}): { [key: string]: string[] } => {
    for (const key in serviceAndStopsDictionary) {
        const stopsArray = serviceAndStopsDictionary[key];

        const sortedStopsArray = stopsArray.sort();

        serviceAndStopsDictionary[key] = [...new Set(sortedStopsArray)];
    }

    return serviceAndStopsDictionary;
};
