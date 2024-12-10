import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import connectDynamoDb from 'connect-dynamodb';
import { Express } from 'express';
import session, { SessionOptions, Store } from 'express-session';

export default (server: Express): void => {
    const DynamoDbStore: new (options: object) => Store = connectDynamoDb(session);

    const options = {
        table: 'sessions',
        client: new DynamoDBClient({ region: 'eu-west-2' }),
    };

    const sessionOptions: SessionOptions = {
        cookie: {
            sameSite: true,
            secure: process.env.NODE_ENV !== 'development',
            httpOnly: true,
        },
        saveUninitialized: false,
        resave: false,
        secret: process.env.SESSION_SECRET || 'secret',
        store: new DynamoDbStore(options),
    };

    server.use(session(sessionOptions));
};
