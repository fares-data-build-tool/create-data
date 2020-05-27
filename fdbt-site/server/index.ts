import express, { Request, Response, Express } from 'express';
import morgan from 'morgan';
import nextjs from 'next';
import helmet from 'helmet';
import nocache from 'nocache';
import { v4 as uuidv4 } from 'uuid';

const dev = process.env.NODE_ENV !== 'production';
const app = nextjs({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 5555;

const setStaticRoutes = (server: Express): void => {
    server.use(
        '/assets',
        express.static(`${__dirname}/../node_modules/govuk-frontend/govuk/assets`, {
            maxAge: '365d',
            immutable: true,
        }),
    );

    server.use(
        '/_next/static',
        express.static(`${__dirname}/../.next/static`, {
            maxAge: '365d',
            immutable: true,
        }),
    );
};

const setHeaders = (server: Express): void => {
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
};

(async (): Promise<void> => {
    try {
        await app.prepare();

        const server = express();

        server.use(
            morgan('short', {
                skip: req => req.originalUrl.startsWith('/_next') || req.originalUrl.startsWith('/assets'),
            }),
        );

        setHeaders(server);

        setStaticRoutes(server);

        server.use(nocache());

        server.all('*', (req: Request, res: Response) => {
            return handle(req, res);
        });

        server.listen(port, (err?: Error) => {
            if (err) {
                throw err;
            }
            console.info(`> Ready on http://localhost:${port} - env ${process.env.NODE_ENV}`);
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
