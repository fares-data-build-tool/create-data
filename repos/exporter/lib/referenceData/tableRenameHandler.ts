import { Handler } from 'aws-lambda';
import { ZipperLambdaBody } from 'fdbt-types/integrationTypes';
import 'source-map-support/register';
import { getConnection, checkReferenceDataImportHasCompleted, deleteAndRenameTables } from './tableRenamer';
import { getParameter, putParameter } from '../ssm';

export const handler: Handler<ZipperLambdaBody> = async () => {
    try {
        console.log('triggered reference data tables rename lambda... ');

        const connection = await getConnection();

        const disableRenamer = await getParameter('/scheduled/disable-table-renamer');

        if (disableRenamer === 'false') {
            await checkReferenceDataImportHasCompleted('txcOperatorLine', connection);
            await checkReferenceDataImportHasCompleted('nocTable', connection);
            await checkReferenceDataImportHasCompleted('naptanStop', connection);

            await deleteAndRenameTables(connection);

            await connection.end();
        } else {
            await putParameter('/scheduled/disable-table-renamer', 'false', 'String', true);
            throw new Error(
                'The SSM Parameter used to check for errors in the scheduled job has returned TRUE indicating an issue',
            );
        }
    } catch (e) {
        if (e instanceof Error) {
            console.log(e);
            await putParameter('/scheduled/disable-table-renamer', 'false', 'String', true);
        }
    }
};
