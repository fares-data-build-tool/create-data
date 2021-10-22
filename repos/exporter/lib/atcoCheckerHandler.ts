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
} from '../shared/matchingJsonTypes';
import {
    getFareDayEnd,
    getPassengerTypeById,
    getTimeRestrictionsByIdAndNoc,
    getGroupDefinition,
    getSalesOfferPackagesByNoc,
} from './database';
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

export const handler: Handler<ExportLambdaBody> = async () => {
    console.log('triggered atco checker lambda...');

};

export const isBasePeriodTicket = (ticket: WithIds<Ticket>): ticket is WithIds<BasePeriodTicket> =>
    !!(ticket.products[0] as ProductDetails)?.productValidity;
