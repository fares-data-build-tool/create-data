import { Express } from 'express';
import AWS, { DynamoDB } from 'aws-sdk';
import session, { SessionOptions } from 'express-session';
import connectDynamoDb from 'connect-dynamodb';

interface DynamoDbOptions {
    table: string;
    AWSConfigJSON: {
        region: string;
    };
    client?: DynamoDB;
}

export default (server: Express): void => {
    const DynamoDbStore = connectDynamoDb(session);

    const dynamoDbOptions: DynamoDbOptions = {
        table: 'sessions',
        AWSConfigJSON: {
            region: 'eu-west-2',
        },
    };

    if (process.env.NODE_ENV === 'development') {
        dynamoDbOptions.client = new AWS.DynamoDB({ endpoint: 'http://localhost:4569', region: 'eu-west-2' });
    }

    const sessionOptions: SessionOptions = {
        cookie: {
            sameSite: true,
        },
        saveUninitialized: false,
        resave: false,
        secret: process.env.SESSION_SECRET || 'secret',
        store: new DynamoDbStore(dynamoDbOptions),
    };

    server.use(session(sessionOptions));
};
