import AWS, { DynamoDB } from 'aws-sdk';
import connectDynamoDb from 'connect-dynamodb';
import { Express } from 'express';
import session, { SessionOptions, Store } from 'express-session';

interface DynamoDbOptions {
    table: string;
    AWSConfigJSON: {
        region: string;
    };
    client?: DynamoDB;
}

export default (server: Express): void => {
    const DynamoDbStore: new (options: object) => Store = connectDynamoDb(session);

    const dynamoDbOptions: DynamoDbOptions = {
        table: 'sessions',
        AWSConfigJSON: {
            region: 'eu-west-2',
        },
    };

    if (process.env.NODE_ENV === 'development') {
        dynamoDbOptions.client = new AWS.DynamoDB({
            endpoint: 'http://127.0.0.1:4566',
            region: 'eu-west-2',
            accessKeyId: 'DUMMY',
            secretAccessKey: 'DUMMY',
        });
    }

    const sessionOptions: SessionOptions = {
        cookie: {
            sameSite: true,
            secure: process.env.NODE_ENV !== 'development',
            httpOnly: true,
        },
        saveUninitialized: false,
        resave: false,
        secret: process.env.SESSION_SECRET || 'secret',
        store: new DynamoDbStore(dynamoDbOptions),
    };

    server.use(session(sessionOptions));
};
