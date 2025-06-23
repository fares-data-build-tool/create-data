import { Express } from 'express';
import session, { SessionOptions } from 'express-session';
import memorystore from 'memorystore';

export default (server: Express): void => {
    const MemoryStore = memorystore(session);

    const sessionOptions: SessionOptions = {
        cookie: {
            sameSite: true,
            secure: process.env.NODE_ENV !== 'development',
            httpOnly: true,
        },
        saveUninitialized: false,
        resave: false,
        secret: process.env.SESSION_SECRET || 'secret',
        store: new MemoryStore({
            checkPeriod: 86400000,
        }),
    };

    server.use(session(sessionOptions));
};
