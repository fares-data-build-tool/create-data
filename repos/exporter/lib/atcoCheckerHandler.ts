import { Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { WithIds, ReturnTicket, SingleTicket, PointToPointPeriodTicket } from '../shared/matchingJsonTypes';
import { getDirectionAndStopsByLineIdAndNoc, getPointToPointProducts } from './database';
import { ExportLambdaBody } from '../shared/integrationTypes';
import 'source-map-support/register';

const s3: S3 = new S3(
    process.env.NODE_ENV === 'development'
        ? {
              s3ForcePathStyle: true,
              accessKeyId: 'S3RVER',
              secretAccessKey: 'S3RVER',
              endpoint: 'http://localhost:4572',
          }
        : {
              region: 'eu-west-2',
          },
);

const PRODUCTS_BUCKET = process.env.PRODUCTS_BUCKET;

export const handler: Handler<ExportLambdaBody> = async () => {
    console.log('triggered atco checker lambda...');

    if (!PRODUCTS_BUCKET) {
        throw new Error('Need to set PRODUCTS_BUCKET env variable');
    }

    const pointToPointProducts = await getPointToPointProducts();

    // change loop to OG for loop
    // for a single, make sure comparison is only done between fareZones + unassigned against whichever direction from service
    // for a non-single, make sure multiple comparisons are done between their stuff
    // combine DB calls into one which gets

    pointToPointProducts.forEach(async (ptpp) => {
        const path = ptpp.matchingJsonLink;
        const object = await s3.getObject({ Key: path, Bucket: PRODUCTS_BUCKET }).promise();
        if (!object.Body) {
            throw new Error(`body was not present [${path}]`);
        }

        const pointToPointTicket = JSON.parse(object.Body.toString('utf-8')) as
            | WithIds<SingleTicket>
            | WithIds<ReturnTicket>
            | WithIds<PointToPointPeriodTicket>;

        const { nocCode, lineId, unassignedStops } = pointToPointTicket;

        const atcoCodesOfKnownStops: string[] = [];

        // check to see if single ticket
        if ('fareZones' in pointToPointTicket) {
            const mismatchedServiceIds = getSingleTicketsMismatchedServiceIds(
                pointToPointTicket,
                ptpp.startDate,
                ptpp.endDate,
            );
            pointToPointTicket.fareZones.forEach((fareZone) => {
                fareZone.stops.forEach((stop) => {
                    atcoCodesOfKnownStops.push(stop.atcoCode);
                });
            });
        } else if ('inboundFareZones' in pointToPointTicket && 'outboundFareZones' in pointToPointTicket) {
            pointToPointTicket.inboundFareZones.forEach((fareZone) => {
                fareZone.stops.forEach((stop) => {
                    atcoCodesOfKnownStops.push(stop.atcoCode);
                });
            });
            pointToPointTicket.outboundFareZones.forEach((fareZone) => {
                fareZone.stops.forEach((stop) => {
                    atcoCodesOfKnownStops.push(stop.atcoCode);
                });
            });
        }

        if (unassignedStops.inboundUnassignedStops) {
            unassignedStops.inboundUnassignedStops.forEach((stop) => {
                atcoCodesOfKnownStops.push(stop.atcoCode);
            });
        }

        if (unassignedStops.outboundUnassignedStops) {
            unassignedStops.outboundUnassignedStops.forEach((stop) => {
                atcoCodesOfKnownStops.push(stop.atcoCode);
            });
        }

        if (unassignedStops.singleUnassignedStops) {
            unassignedStops.singleUnassignedStops.forEach((stop) => {
                atcoCodesOfKnownStops.push(stop.atcoCode);
            });
        }

        let journeyDirection = '';

        if ('journeyDirection' in pointToPointTicket) {
            journeyDirection = pointToPointTicket.journeyDirection;
        }

        const atcoMismatch = false;

        // const journeyPatterns = service.journeyPatterns.filter((it) => it.direction === journeyDirection);
    });
};

const getSingleTicketsMismatchedServiceIds = async (pointToPointTicket: WithIds<SingleTicket>): Promise<number[]> => {
    const atcoCodesOfKnownStops: string[] = [];

    pointToPointTicket.fareZones.forEach((fareZone) => {
        fareZone.stops.forEach((stop) => {
            atcoCodesOfKnownStops.push(stop.atcoCode);
        });
    });

    if (pointToPointTicket.unassignedStops.singleUnassignedStops) {
        pointToPointTicket.unassignedStops.singleUnassignedStops.forEach((stop) => {
            atcoCodesOfKnownStops.push(stop.atcoCode);
        });
    }

    const { journeyDirection, lineId, nocCode } = pointToPointTicket;

    const directionsAndStops = await getDirectionAndStopsByLineIdAndNoc(lineId, nocCode);

    directionsAndStops.forEach(oneDirectionsAndStops => {
        const allthestops = [oneDirectionsAndStops.fromAtcoCode, oneDirectionsAndStops.toAtcoCode];
        oneDirectionsAndStops.serviceId
    })

    // product id 7 service 4
    // service 4 v1
    // service 4 v2
    // v3

};
