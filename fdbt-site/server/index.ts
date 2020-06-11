import express, { Request, Response, Express } from 'express';
import morgan from 'morgan';
import nextjs from 'next';
import nocache from 'nocache';
import requireAuth from './middleware/authentication';
import setupCsrf from './middleware/csrf';
import setSecurityHeaders from './middleware/security';

const dev = process.env.NODE_ENV !== 'production';
const app = nextjs({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 5555;

const unauthenticatedGetRoutes = [
    '/',
    '/login',
    '/register',
    '/confirmRegistration',
    '/forgotPassword',
    '/resetConfirmation',
    '/resetPassword',
    '/_next/*',
    '/assets/*',
    '/scripts/*',
    '/error',
];

const unauthenticatedPostRoutes = ['/api/login', '/api/register', '/api/forgotPassword'];

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

    server.use(
        '/scripts',
        express.static(`${__dirname}/../node_modules/govuk-frontend/govuk`, {
            maxAge: '365d',
            immutable: true,
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

        setStaticRoutes(server);
        setSecurityHeaders(server);

        server.use(nocache());

        setupCsrf(server);

        unauthenticatedGetRoutes.forEach(route => {
            server.get(route, (req: Request, res: Response) => {
                res.locals.csrfToken = req.csrfToken();
                return handle(req, res);
            });
        });

        unauthenticatedPostRoutes.forEach(route => {
            server.post(route, (req: Request, res: Response) => {
                return handle(req, res);
            });
        });

        server.get('*', requireAuth, (req: Request, res: Response) => {
            res.locals.csrfToken = req.csrfToken();
            return handle(req, res);
        });

        server.all('*', requireAuth, (req: Request, res: Response) => {
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
