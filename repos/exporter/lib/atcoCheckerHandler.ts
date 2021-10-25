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
    ReturnTicket,
    SingleTicket,
    PointToPointPeriodTicket,
} from '../shared/matchingJsonTypes';
import { getBodsServiceIdByNocAndId, getPointToPointProducts, getServiceByIdAndDataSource } from './database';
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
    pointToPointProducts.map(async (ptpp) => {
        const path = ptpp.matchingJsonLink;
        const object = await s3.getObject({ Key: path, Bucket: PRODUCTS_BUCKET }).promise();
        if (!object.Body) {
            throw new Error(`body was not present [${path}]`);
        }
        const pointToPointTicket = JSON.parse(object.Body.toString('utf-8')) as
            | WithIds<SingleTicket>
            | WithIds<ReturnTicket>
            | WithIds<PointToPointPeriodTicket>;
        const { nocCode, lineId } = pointToPointTicket;
        const serviceId = await getBodsServiceIdByNocAndId(nocCode, lineId);
        const service = await getServiceByIdAndDataSource(pointToPointTicket.nocCode, Number(serviceId.id), 'bods');
    });
};
