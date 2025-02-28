import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { NextApiResponse } from 'next';
import { getAttributeFromIdToken, redirectTo } from '../../utils/apiUtils';
import { updateUserAttributes } from '../../data/cognito';
import logger from '../../utils/logger';
import { updateSessionAttribute } from '../../utils/sessions';
import { ACCOUNT_PAGE_ERROR } from '../../constants/attributes';

const setAttributeAndRedirect = (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    const errors: ErrorInfo[] = [
        { id: 'radio-multi-op-email-pref', errorMessage: 'There was a problem updating email preference' },
    ];
    updateSessionAttribute(req, ACCOUNT_PAGE_ERROR, errors);
    redirectTo(res, '/account');
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const isLocal = req.headers?.host?.startsWith('localhost');

        if (isLocal) {
            redirectTo(res, '/home');
            return;
        }

        const multiOpEmailPreference = req.body?.multiOpEmailPref;

        if (multiOpEmailPreference === 'true' || multiOpEmailPreference === 'false') {
            const email: string | null = getAttributeFromIdToken(req, res, 'email');

            if (!email) {
                logger.error('email not found in ID token', {
                    context: 'api.updateEmailPreference',
                    message: 'update for user email preference failed',
                });
                setAttributeAndRedirect(req, res);
                return;
            }

            await updateUserAttributes(email, [{ Name: 'custom:multiOpEmailEnabled', Value: multiOpEmailPreference }]);
            updateSessionAttribute(req, ACCOUNT_PAGE_ERROR, undefined);
            redirectTo(res, '/home');

            logger.info('', {
                context: 'api.updateEmailPreference',
                message: 'update for user email preference successful',
            });
            return;
        } else {
            setAttributeAndRedirect(req, res);
            return;
        }
    } catch (error) {
        logger.error(error, {
            context: 'api.updateEmailPreference',
            message: 'update for user email preference failed',
        });
        setAttributeAndRedirect(req, res);
        return;
    }
};
