import express, { Request, Response, Express } from 'express';
import nextjs from 'next';
import helmet from 'helmet';
import nocache from 'nocache';
import { v4 as uuidv4 } from 'uuid';
import { getUuidFromCookie } from '../src/pages/api/apiUtils';

const dev = process.env.NODE_ENV !== 'production';
const app = nextjs({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 5555;

const setHeaders = (server: Express): void => {
    server.use((req, res, next) => {
        if (!req.url.startsWith('/_next/') && !req.url.startsWith('/assets/')) {
            const uuid = getUuidFromCookie(req, res);
            console.info(`Call: ${req.url}`, { uuid });
        }

        res.locals.nonce = Buffer.from(uuidv4()).toString('base64');
        next();
    });

    const nonce = (_req: Request, res: Response): string => `'nonce-${res.locals.nonce}'`;
    const scriptSrc = [nonce, "'strict-dynamic'", "'unsafe-inline'"];

    if (process.env.NODE_ENV !== 'production') {
        scriptSrc.push("'unsafe-eval'");
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
                    scriptSrc,
                    baseUri: ["'none'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", 'data:', 'https:'],
                    defaultSrc: ["'self'", 'https:'],
                },
            },
            hidePoweredBy: true,
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

    server.use(nocache());
};

(async (): Promise<void> => {
    try {
        await app.prepare();

        const server = express();

        setHeaders(server);

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
