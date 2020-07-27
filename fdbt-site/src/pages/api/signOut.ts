import { NextApiRequest, NextApiResponse } from 'next';
import { redirectToError, redirectTo, signOutUser, getAttributeFromIdToken } from './apiUtils';
import logger from '../../utils/logger';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const username = getAttributeFromIdToken(req, res, 'cognito:username');

        try {
            await signOutUser(username, req, res);
            redirectTo(res, '/');
        } catch (error) {
            logger.error(error, {
                context: 'api.signOut',
                message: 'failed to sign out user',
            });
            redirectTo(res, '/');
        }
    } catch (error) {
        const message = 'There was a problem signing out of your account';
        redirectToError(res, message, 'api.signOut', error);
    }
};
