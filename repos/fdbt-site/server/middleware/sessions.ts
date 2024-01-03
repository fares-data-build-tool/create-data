import { Express } from 'express';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import session, { SessionOptions, Store } from 'express-session';
import connectDynamoDb from 'connect-dynamodb';

export default (server: Express): void => {
    const DynamoDbStore: new (options: object) => Store = connectDynamoDb(session);

    const options = {
        // Optional DynamoDB table name, defaults to 'sessions'
        table: 'sessions',
        // Optional client for alternate endpoint, such as DynamoDB Local
        client: new DynamoDBClient({
            region: 'eu-west-2',
            ...(process.env.NODE_ENV === 'development' ? { endpoint: 'http://localhost:4569' } : {}),
        }),
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
