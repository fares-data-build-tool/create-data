import { createConnection, Connection } from 'mysql2/promise';
import { getSsmValue } from '../ssm';

export const getConnection = async (): Promise<Connection> =>
    await createConnection({
        host: process.env.RDS_HOST,
        user: await getSsmValue('fdbt-rds-reference-data-username'),
        password: await getSsmValue('fdbt-rds-reference-data-password'),
        database: 'fdbt',
        waitForConnections: true,
    });

export const checkReferenceDataImportHasCompleted = async (
    tableName: string,
    connection: Connection,
): Promise<void> => {
    const queryInputForNewTable = `SELECT COUNT(1) as count FROM ${tableName}New`;

    const [[newCount]] = (await connection.execute(queryInputForNewTable)) as [[{ count: number }], unknown];

    if (newCount.count === 0) {
        throw new Error(`Reference data import has failed with zero rows in ${tableName}`);
    }

    const queryInputForOldTable = `SELECT COUNT(1) as count FROM ${tableName}`;

    const [[currentCount]] = (await connection.execute(queryInputForOldTable)) as [[{ count: number }], unknown];

    const percentageResult = (newCount.count / currentCount.count) * 100;

    if (percentageResult < 75) {
        throw new Error(
            `Reference data import has not completed, as only ${percentageResult}% of yesterday's data has been imported for table: ${tableName}`,
        );
    }
};

const tables = [
    'nocPublicName',
    'nocTable',
    'nocLine',
    'naptanStop',
    'txcJourneyPatternLink',
    'txcJourneyPattern',
    'txcOperatorLine',
];

export const deleteAndRenameTables = async (connection: Connection): Promise<void> => {
    try {
        await connection.beginTransaction();
        await connection.query(`DROP TABLE IF EXISTS ${tables.map((table) => `${table}Old`).join(', ')};`);

        for (const table of tables) {
            await connection.query(`ALTER TABLE ${table} RENAME TO ${table}Old;`);
            await connection.query(`ALTER TABLE ${table}New RENAME TO ${table};`);
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    }
};
