import { Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { WithIds, BaseTicket, FullTimeRestriction, WithBaseIds, TicketWithIds, BasePeriodTicket } from '../shared/matchingJsonTypes';
import { getFareDayEnd, getPassengerTypeById, getTimeRestrictionsByIdAndNoc, getGroupDefinition } from './database';
import { ExportLambdaBody } from '../shared/integrationTypes';
import 'source-map-support/register';
import { DbTimeRestriction } from '../shared/dbTypes';

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

export const handler: Handler<ExportLambdaBody> = async ({ paths, noc }) => {
    // populate the values from global settings using the IDs and write to matching data bucket
    console.log(`triggered export lambda... ${paths.toString()}`);

    if (!PRODUCTS_BUCKET || !MATCHING_DATA_BUCKET) {
        throw new Error('Need to set MATCHING_DATA_BUCKET and PRODUCTS_BUCKET');
    }

    await Promise.all(
        paths.map(async (path) => {
            const object = await s3.getObject({ Key: path, Bucket: PRODUCTS_BUCKET }).promise();
            if (!object.Body) {
                throw new Error(`body was not present [${path}]`);
            }

            const baseTicket = JSON.parse(object.Body.toString('utf-8')) as TicketWithIds;
            const singleOrGroupPassengerType = await getPassengerTypeById(baseTicket.passengerType.id, noc);

            let passengerType, groupDefinition;
            if ('groupPassengerType' in singleOrGroupPassengerType) {
                passengerType = { passengerType: 'group' };
                groupDefinition = await getGroupDefinition(singleOrGroupPassengerType.groupPassengerType, noc);
            } else {
                passengerType = singleOrGroupPassengerType.passengerType;
            }
            const purchaseMethodIds = baseTicket.products.flatMap((product) =>
                product.salesOfferPackages.map((sop) => sop.id),);

            const timeRestriction = baseTicket.timeRestriction
                ? await getTimeRestrictionsByIdAndNoc(baseTicket.timeRestriction.id, noc)
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

            if (isBasePeriodTicket(baseTicket)) {
                if (baseTicket.products[0].productValidity === 'fareDayEnd') {
                    baseTicket.fareDayEnd = fareDayEnd;
                }
            }

            const ticket: BaseTicket = {
                ...baseTicket,
                ...passengerType,
                groupDefinition,
                timeRestriction: timeRestrictionWithUpdatedFareDayEnds,
            };

            await s3.putObject({ Key: path, Bucket: MATCHING_DATA_BUCKET, Body: JSON.stringify(ticket) }).promise();
        }),
    );

    console.log(`done ${paths.toString()}`);
};

export const isBasePeriodTicket = (ticket: WithIds<BaseTicket>): ticket is WithIds<BasePeriodTicket> =>
    !!(ticket as WithIds<BasePeriodTicket>)?.products?.[0]?.productValidity;
