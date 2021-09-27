import { Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { WithIds, BaseTicket, TicketWithIds } from '../shared/matchingJsonTypes';
import { getPassengerTypeById } from './database';
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

            const productData = JSON.parse(object.Body.toString('utf-8')) as WithIds<BaseTicket>;

            const passengerType =
                'groupDefinition' in productData && productData.groupDefinition
                    ? { passengerType: 'group' }
                    : (await getPassengerTypeById(productData.passengerType.id, noc)).passengerType;

            const ticket: BaseTicket = { ...productData, ...passengerType };

            await s3.putObject({ Key: path, Bucket: MATCHING_DATA_BUCKET, Body: JSON.stringify(ticket) }).promise();
        }),
    );

    console.log(`done ${paths.toString()}`);
};
