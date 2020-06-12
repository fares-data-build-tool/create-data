import { Express, ErrorRequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';

export default (server: Express): void => {
    server.use(cookieParser());

    server.use(
        csurf({
            cookie: {
                secure: process.env.NODE_ENV !== 'development',
                httpOnly: true,
                sameSite: 'strict',
            },
        }),
    );

    const csrfErrorHandler: ErrorRequestHandler = (error, _req, res, next) => {
        if (error.code !== 'EBADCSRFTOKEN') {
            next(error);
            return;
        }

        console.warn(`invalid csrf: ${error.stack}`);
        res.redirect('/error');
    };

    server.use(csrfErrorHandler);
};
