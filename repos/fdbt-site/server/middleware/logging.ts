import { Express } from 'express';
import expressWinston from 'express-winston';
import winston, { format } from 'winston';

export default (server: Express): void => {
    server.use(
        expressWinston.logger({
            transports: [new winston.transports.Console()],
            format:
                process.env.NODE_ENV === 'production'
                    ? format.combine(format.json(), format.prettyPrint())
                    : format.simple(),
            meta: false,
            colorize: false,
            metaField: 'null',
            msg:
                '{{req.ip}} - {{req.method}} {{req.url}} HTTP/{{req.httpVersion}} {{res.statusCode}} - - {{res.responseTime}}ms',
            ignoreRoute: req => req.originalUrl.startsWith('/_next') || req.originalUrl.startsWith('/assets'),
        }),
    );
};
