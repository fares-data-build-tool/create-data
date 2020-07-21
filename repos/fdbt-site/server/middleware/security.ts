import { Express, Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import helmet from 'helmet';
import nocache from 'nocache';

export default (server: Express): void => {
    server.use((_req, res, next) => {
        res.locals.nonce = Buffer.from(uuidv4()).toString('base64');
        next();
    });

    server.disable('x-powered-by');

    const nonce = (_req: Request, res: Response): string => `'nonce-${res.locals.nonce}'`;
    const scriptSrc = [nonce, "'strict-dynamic'"];
    const styleSrc = ["'self'"];

    if (process.env.NODE_ENV !== 'production') {
        scriptSrc.push("'unsafe-eval'");
        scriptSrc.push("'unsafe-inline'");
        styleSrc.push("'unsafe-inline'");
    }

    server.use(
        helmet({
            frameguard: {
                action: 'deny',
            },
            noSniff: true,
            contentSecurityPolicy: {
                directives: {
                    objectSrc: ["'none'"],
                    frameAncestors: ["'none'"],
                    scriptSrc,
                    baseUri: ["'none'"],
                    styleSrc,
                    imgSrc: ["'self'", 'data:', 'https:'],
                    defaultSrc: ["'self'"],
                },
            },
            hsts: {
                includeSubDomains: true,
                preload: true,
                maxAge: 31536000,
            },
            expectCt: {
                maxAge: 86400,
                enforce: true,
            },
            referrerPolicy: {
                policy: 'same-origin',
            },
        }),
    );

    server.use(nocache());
};
