import { Handler } from 'aws-lambda';
import { AWSError, S3 } from 'aws-sdk';
import {
    BaseTicket,
    FullTimeRestriction,
    TicketWithIds,
    Ticket,
    BaseSchemeOperatorTicket,
    SelectedService,
    Stop,
    SecondaryOperatorServices,
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
import { DbCap, DbTimeRestriction } from 'fdbt-types/dbTypes';

const s3: S3 = new S3(
    process.env.NODE_ENV === 'development'
        ? {
              s3ForcePathStyle: true,
              accessKeyId: 'S3RVER',
              secretAccessKey: 'S3RVER',
              endpoint: 'http://127.0.0.1:4566',
              region: 'eu-west-2',
          }
        : {
              region: 'eu-west-2',
          },
);

const PRODUCTS_BUCKET = process.env.PRODUCTS_BUCKET;
const MATCHING_DATA_BUCKET = process.env.MATCHING_DATA_BUCKET;
const EXPORT_METADATA_BUCKET = process.env.EXPORT_METADATA_BUCKET;

const removeDuplicates = <T, K extends keyof T>(arrayToRemoveDuplicates: T[], key: K): T[] =>
    arrayToRemoveDuplicates.filter(
        (value, index, self) => index === self.findIndex((item) => item[key] === value[key]),
    );

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
            const object = await s3.getObject({ Key: path, Bucket: PRODUCTS_BUCKET }).promise();
            if (!object.Body) {
                throw new Error(`body was not present [${path}]`);
            }

            const ticketWithIds = JSON.parse(object.Body.toString('utf-8')) as TicketWithIds;

            if (
                path.includes('multiOperatorExt') &&
                ('additionalOperators' in ticketWithIds || 'additionalNocs' in ticketWithIds)
            ) {
                // add secondary operator product information for service type tickets
                if ('additionalOperators' in ticketWithIds) {
                    for await (const operator of ticketWithIds.additionalOperators) {
                        const additionalPath = `${path.substring(0, path.lastIndexOf('.json'))}_${
                            operator.nocCode
                        }.json`;

                        try {
                            const additionalServicesObject = await s3
                                .getObject({ Key: additionalPath, Bucket: PRODUCTS_BUCKET })
                                .promise();

                            if (additionalServicesObject.Body) {
                                const additionalServices = JSON.parse(
                                    additionalServicesObject.Body.toString('utf-8'),
                                ) as SecondaryOperatorServices;

                                operator.selectedServices = additionalServices.selectedServices;

                                if (additionalServices.exemptStops && additionalServices.exemptStops.length > 0) {
                                    ticketWithIds.exemptStops = ticketWithIds.exemptStops
                                        ? ticketWithIds.exemptStops.concat(additionalServices.exemptStops)
                                        : additionalServices.exemptStops;
                                }
                            }
                        } catch (error) {
                            if ((error as AWSError).code === 'NoSuchKey') {
                                console.log(`No additional services found for ${operator.nocCode}`);
                            }
                        }
                    }

                    ticketWithIds.exemptStops = removeDuplicates(ticketWithIds.exemptStops ?? [], 'atcoCode');
                }

                // add secondary operator product information for fareZone type tickets
                if ('additionalNocs' in ticketWithIds) {
                    for await (const nocCode of ticketWithIds.additionalNocs) {
                        const additionalPath = `${path.substring(0, path.lastIndexOf('.json'))}_${nocCode}.json`;

                        try {
                            const additionalStopsObject = await s3
                                .getObject({ Key: additionalPath, Bucket: PRODUCTS_BUCKET })
                                .promise();

                            if (additionalStopsObject.Body) {
                                const additionalStops = JSON.parse(additionalStopsObject.Body.toString('utf-8')) as {
                                    zoneName: string;
                                    stops: Stop[];
                                    exemptedServices?: SelectedService[];
                                };
                                console.log('additionalStops', additionalStops);
                                console.log('ticketWithIds', ticketWithIds);

                                ticketWithIds.stops = ticketWithIds.stops.concat(additionalStops.stops);

                                console.log('ticketWithIdsAfterConcat', ticketWithIds);

                                if (additionalStops.exemptedServices && additionalStops.exemptedServices.length > 0) {
                                    ticketWithIds.exemptedServices = (ticketWithIds.exemptedServices || []).concat(
                                        additionalStops.exemptedServices,
                                    );
                                }
                            }
                        } catch (error) {
                            if ((error as AWSError).code === 'NoSuchKey') {
                                console.log(`No additional services found for ${nocCode}`);
                            }
                        }
                    }

                    ticketWithIds.stops = removeDuplicates(ticketWithIds.stops, 'atcoCode');

                    console.log('afterRemoveDuplictaes', ticketWithIds.stops);
                }
            }

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

            const caps = ticketWithIds.caps
                ? await Promise.all(
                      (ticketWithIds.caps as { id: number }[]).map(({ id }) =>
                          getCapByNocAndId(noc, id).then((cap) => cap || null),
                      ),
                  ).then((results) => results.filter((cap): cap is DbCap => cap !== null))
                : undefined;

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
                ...(!!caps && caps.length > 0 ? { caps: caps } : {}),
            };
            /* eslint-enable */

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

    const date = new Date();
    const numberOfExpectedNetexFiles = paths.length;
    const metadata = { date, numberOfExpectedNetexFiles };

    console.log(
        `putting metadata: date - ${metadata.date.toDateString()} numberOfExpectedNetexFiles - ${
            metadata.numberOfExpectedNetexFiles
        } in metadata bucket: ${EXPORT_METADATA_BUCKET} key: ${noc}/exports/${exportPrefix}.json`,
    );

    await s3
        .putObject({
            Key: `${noc}/exports/${exportPrefix}.json`,
            Bucket: EXPORT_METADATA_BUCKET,
            Body: JSON.stringify(metadata),
        })
        .promise();

    console.log(`completed ${paths.length} files.`);
};
