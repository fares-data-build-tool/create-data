import express, { Request, Response, Express } from 'express';
import nextjs from 'next';
import requireAuth, { setDisableAuthCookies } from './middleware/authentication';
import setupCsrfProtection from './middleware/csrf';
import setSecurityHeaders from './middleware/security';
import setupLogging from './middleware/logging';
import setupSessions from './middleware/sessions';
import logger from '../src/utils/logger';

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
    '/passwordUpdated',
    '/resetLinkExpired',
    '/_next/*',
    '/assets/*',
    '/scripts/*',
    '/error',
    '/contact',
    '/requestAccess',
];

const unauthenticatedPostRoutes = ['/api/login', '/api/register', '/api/forgotPassword', '/api/resetPassword'];

const setStaticRoutes = (server: Express): void => {
    const rootPath = process.env.NODE_ENV === 'development' ? `${__dirname}/..` : `${__dirname}/../..`;

    server.use(
        '/assets',
        express.static(`${rootPath}/node_modules/govuk-frontend/govuk/assets`, {
            maxAge: '365d',
            immutable: true,
        }),
    );

    server.use(
        '/_next/static',
        express.static(`${rootPath}/.next/static`, {
            maxAge: '365d',
            immutable: true,
        }),
    );

    server.use(
        '/scripts',
        express.static(`${rootPath}/node_modules/govuk-frontend/govuk`, {
            maxAge: '365d',
            immutable: true,
        }),
    );
};

(async (): Promise<void> => {
    try {
        await app.prepare();
        const server = express();

        server.enable('trust proxy');

        setupLogging(server);
        setStaticRoutes(server);
        setSecurityHeaders(server);
        setDisableAuthCookies(server);
        setupCsrfProtection(server);
        setupSessions(server);

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
            logger.info('', {
                context: 'server.index',
                message: `> Ready on http://localhost:${port} - env ${process.env.NODE_ENV}`,
            });
        });
    } catch (error) {
        logger.error(error, { context: 'server.index' });
        process.exit(1);
    }
})();
