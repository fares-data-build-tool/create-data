import { Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import {
    BaseTicket,
    FullTimeRestriction,
    TicketWithIds,
    Ticket,
    WithIds,
    BasePeriodTicket,
    ProductDetails,
    BaseSchemeOperatorTicket,
} from 'fdbt-types/matchingJsonTypes';
import {
    getFareDayEnd,
    getPassengerTypeById,
    getTimeRestrictionsByIdAndNoc,
    getGroupDefinition,
    getSalesOfferPackagesByNoc,
} from './database';
import { ExportLambdaBody } from 'fdbt-types/integrationTypes';
import 'source-map-support/register';
import { DbTimeRestriction } from 'fdbt-types/dbTypes';

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
const MATCHING_DATA_BUCKET = process.env.MATCHING_DATA_BUCKET;

export const handler: Handler<ExportLambdaBody> = async ({ paths, noc, exportPrefix }) => {
    // populate the values from global settings using the IDs and write to matching data bucket
    console.log(`triggered export lambda... ${paths.toString()} noc: ${noc}`);

    if (!PRODUCTS_BUCKET || !MATCHING_DATA_BUCKET) {
        throw new Error('Need to set MATCHING_DATA_BUCKET and PRODUCTS_BUCKET');
    }

    await Promise.all(
        paths.map(async (path) => {
            const object = await s3.getObject({ Key: path, Bucket: PRODUCTS_BUCKET }).promise();
            if (!object.Body) {
                throw new Error(`body was not present [${path}]`);
            }

            const ticketWithIds = JSON.parse(object.Body.toString('utf-8')) as TicketWithIds;
            const singleOrGroupPassengerType = await getPassengerTypeById(ticketWithIds.passengerType.id, noc);

            let passengerType, groupDefinition;
            if ('groupPassengerType' in singleOrGroupPassengerType) {
                passengerType = { passengerType: 'group' };
                groupDefinition = await getGroupDefinition(singleOrGroupPassengerType.groupPassengerType, noc);
            } else {
                passengerType = singleOrGroupPassengerType.passengerType;
            }

            const allSops = await getSalesOfferPackagesByNoc(noc);

            const fullProducts = ticketWithIds.products.map((product) => ({
                ...product,
                salesOfferPackages: product.salesOfferPackages.map((sopWithIds) => {
                    const sop = allSops.find((it) => it.id === sopWithIds.id);
                    if (!sop) {
                        throw new Error(`No sop found for id [${sopWithIds.id}]`);
                    }
                    return { ...sop, price: sopWithIds.price };
                }),
            }));

            const timeRestriction = ticketWithIds.timeRestriction
                ? await getTimeRestrictionsByIdAndNoc(ticketWithIds.timeRestriction.id, noc)
                : [];

            const fareDayEnd = await getFareDayEnd(noc);

            const timeRestrictionWithUpdatedFareDayEnds: FullTimeRestriction[] = timeRestriction.map(
                (timeRestriction: DbTimeRestriction) => ({
                    ...timeRestriction,
                    timeBands: timeRestriction.timeBands.map((timeBand) => {
                        let endTime: string;
                        if (typeof timeBand.endTime === 'string') {
                            endTime = timeBand.endTime;
                        } else {
                            if (!fareDayEnd) {
                                throw new Error('No fare day end set for time restriction');
                            }

                            endTime = fareDayEnd;
                        }

                        return {
                            ...timeBand,
                            endTime: endTime,
                        };
                    }),
                }),
            );

            const setFareDayEnd =
                isBasePeriodTicket(ticketWithIds) && ticketWithIds.products[0].productValidity === 'fareDayEnd';

            const baseTicket: BaseTicket | BaseSchemeOperatorTicket = {
                ...ticketWithIds,
                ...passengerType,
                groupDefinition,
                timeRestriction: timeRestrictionWithUpdatedFareDayEnds,
            };

            const fullTicket: Ticket = {
                ...baseTicket,
                products: fullProducts,
                fareDayEnd: setFareDayEnd ? fareDayEnd : undefined,
            } as Ticket;

            const sections = path.split('/');
            const destPath = exportPrefix ? `${noc}/exports/${exportPrefix}/${sections[sections.length - 1]}` : path;

            await s3
                .putObject({ Key: destPath, Bucket: MATCHING_DATA_BUCKET, Body: JSON.stringify(fullTicket) })
                .promise();
        }),
    );

    console.log(`done ${paths.toString()}`);
};

export const isBasePeriodTicket = (ticket: WithIds<Ticket>): ticket is WithIds<BasePeriodTicket> =>
    !!(ticket.products[0] as ProductDetails)?.productValidity;
