import { Handler } from 'aws-lambda';
import { ZipperLambdaBody } from '../shared/integrationTypes';
import { checkReferenceDataImportHasCompleted, deleteAndRenameTables } from '../lib/database';

export const handler: Handler<ZipperLambdaBody> = async () => {
    console.log('triggered reference data tables rename lambda... ');

    await checkReferenceDataImportHasCompleted('txcOperatorLine');
    await checkReferenceDataImportHasCompleted('nocTable');
    await checkReferenceDataImportHasCompleted('naptanStop');

    await deleteAndRenameTables();

};
