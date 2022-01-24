import { Express } from 'express';
import expressWinston from 'express-winston';
import winston, { format } from 'winston';

export default (server: Express): void => {
    server.use(
        expressWinston.logger({
            transports: [new winston.transports.Console()],
            format: process.env.NODE_ENV === 'production' ? format.json() : format.simple(),
            colorize: false,
            metaField: 'null',
            ignoreRoute: (req) => req.originalUrl.startsWith('/_next') || req.originalUrl.startsWith('/assets'),
            requestWhitelist: ['url', 'method', 'httpVersion'],
            meta: true,
            dynamicMeta: (_req, res) => {
                return { noc: res?.req?.session?.['fdbt-operator']?.nocCode };
            },
        }),
    );
};
