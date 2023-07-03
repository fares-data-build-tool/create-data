import { Handler } from 'aws-lambda';
import { ZipperLambdaBody } from 'fdbt-types/integrationTypes';
import 'source-map-support/register';
import { getConnection, checkReferenceDataImportHasCompleted, deleteAndRenameTables } from './tableRenamer';
import { getSsmValue, putParameter } from '../ssm';

export const handler: Handler<ZipperLambdaBody> = async () => {
    try {
        console.log('triggered reference data tables rename lambda... ');

        const connection = await getConnection();

        let disableRenamer: string | undefined = 'true';
        try {
            disableRenamer = await getSsmValue('/scheduled/disable-table-renamer');
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to get parameter from ssm: ${error.stack || ''}`);
            }

            throw error;
        }

        if (disableRenamer === 'false') {
            await checkReferenceDataImportHasCompleted('txcOperatorLine', connection);
            await checkReferenceDataImportHasCompleted('nocTable', connection);
            await checkReferenceDataImportHasCompleted('naptanStop', connection);

            await deleteAndRenameTables(connection);

            await connection.end();
        } else {
            throw new Error(
                'The SSM Parameter used to check for errors in the scheduled job has returned TRUE indicating an issue',
            );
        }
        await putParameter('/scheduled/disable-table-renamer', 'false', 'String', true);
    } catch (e) {
        if (e instanceof Error) {
            console.log(e);
            await putParameter('/scheduled/disable-table-renamer', 'false', 'String', true);
        }
    }
};
