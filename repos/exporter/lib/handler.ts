import { Handler } from 'aws-lambda';
import { S3Client } from '@aws-sdk/client-s3';
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
    getCapByNocAndId,
} from './database';
import { ExportLambdaBody } from 'fdbt-types/integrationTypes';
import 'source-map-support/register';
import { DbTimeRestriction } from 'fdbt-types/dbTypes';
import { getObject, putObject } from './s3';

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
const MATCHING_DATA_BUCKET = process.env.MATCHING_DATA_BUCKET;
const EXPORT_METADATA_BUCKET = process.env.EXPORT_METADATA_BUCKET;

export const handler: Handler<ExportLambdaBody> = async ({ paths, noc, exportPrefix }) => {
    // populate the values from global settings using the IDs and write to matching data bucket

    console.log(`${noc} - Exporting ${paths.length} files for netex creation for export ${exportPrefix}`);

    if (!PRODUCTS_BUCKET || !MATCHING_DATA_BUCKET || !EXPORT_METADATA_BUCKET) {
        throw new Error(
            `Bucket details missing. Products bucket: ${PRODUCTS_BUCKET || '<missing>'}, Matching data bucket: ${
                MATCHING_DATA_BUCKET || '<missing>'
            }, Export metadata bucket: ${EXPORT_METADATA_BUCKET || '<missing>'}`,
        );
    }

    await Promise.all(
        paths.map(async (path) => {
            const object = await getObject(s3, PRODUCTS_BUCKET, path, path);
            if (!object) {
                throw new Error(`body was not present [${path}]`);
            }

            const ticketWithIds = JSON.parse(object.toString()) as TicketWithIds;
            const singleOrGroupPassengerType = await getPassengerTypeById(ticketWithIds.passengerType.id, noc);
            const passengerTypeValue = singleOrGroupPassengerType.name;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let passengerType: any, groupDefinition;
            if ('groupPassengerType' in singleOrGroupPassengerType) {
                passengerType = { passengerType: 'group' };
                groupDefinition = await getGroupDefinition(singleOrGroupPassengerType.groupPassengerType, noc);
            } else {
                passengerType = singleOrGroupPassengerType.passengerType;
            }

            const allSops = await getSalesOfferPackagesByNoc(noc);

            const fullProducts = ticketWithIds.products.map((product) => ({
                ...product,
                productName: product.productName ? product.productName : `${passengerTypeValue} ${ticketWithIds.type}`,
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

            const cap = !!ticketWithIds.cap ? await getCapByNocAndId(noc, ticketWithIds.cap.id) : undefined;

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

            let setFareDayEnd = false;
            const product = fullProducts[0];

            if ('productValidity' in product) {
                setFareDayEnd = true;
            }

            /* eslint-disable */
            const baseTicket: BaseTicket | BaseSchemeOperatorTicket = {
                ...ticketWithIds,
                ...passengerType,
                groupDefinition,
                timeRestriction: timeRestrictionWithUpdatedFareDayEnds,
                ...(!!cap && cap),
            };
            /* eslint-enable */

            const fullTicket: Ticket = {
                ...baseTicket,
                products: fullProducts,
                fareDayEnd: setFareDayEnd ? fareDayEnd : undefined,
            } as Ticket;

            const sections = path.split('/');
            const destPath = exportPrefix ? `${noc}/exports/${exportPrefix}/${sections[sections.length - 1]}` : path;

            await putObject(s3, MATCHING_DATA_BUCKET, destPath, JSON.stringify(fullTicket));
        }),
    );

    const date = new Date();
    const numberOfExpectedNetexFiles = paths.length;
    const metadata = { date, numberOfExpectedNetexFiles };

    console.log(
        `putting metadata: date - ${metadata.date.toDateString()} numberOfExpectedNetexFiles - ${
            metadata.numberOfExpectedNetexFiles
        } in metadata bucket: ${EXPORT_METADATA_BUCKET} key: ${noc}/exports/${exportPrefix}.json`,
    );

    await putObject(s3, EXPORT_METADATA_BUCKET, `${noc}/exports/${exportPrefix}.json`, JSON.stringify(metadata));

    console.log(`completed ${paths.length} files.`);
};

export const isBasePeriodTicket = (ticket: WithIds<Ticket>): ticket is WithIds<BasePeriodTicket> =>
    !!(ticket.products[0] as ProductDetails)?.productValidity;
