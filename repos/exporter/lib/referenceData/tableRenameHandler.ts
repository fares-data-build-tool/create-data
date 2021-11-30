import { Handler } from 'aws-lambda';
import { ZipperLambdaBody } from '../../../../shared/integrationTypes';
import 'source-map-support/register';
import { getConnection, checkReferenceDataImportHasCompleted, deleteAndRenameTables } from './tableRenamer';

export const handler: Handler<ZipperLambdaBody> = async () => {
    console.log('triggered reference data tables rename lambda... ');

    const connection = await getConnection();

    await checkReferenceDataImportHasCompleted('txcOperatorLine', connection);
    await checkReferenceDataImportHasCompleted('nocTable', connection);
    await checkReferenceDataImportHasCompleted('naptanStop', connection);

    await deleteAndRenameTables(connection);

    await connection.end();
};
