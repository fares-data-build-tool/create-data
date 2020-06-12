import { Express } from 'express';
import morgan from 'morgan';

export default (server: Express): void => {
    server.use(
        morgan('short', {
            skip: req => req.originalUrl.startsWith('/_next') || req.originalUrl.startsWith('/assets'),
        }),
    );
};
