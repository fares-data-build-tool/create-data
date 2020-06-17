import { NextApiRequest, NextApiResponse } from 'next';
import { redirectToError, redirectTo, signOutUser, getAttributeFromIdToken } from './apiUtils';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const username = getAttributeFromIdToken(req, res, 'cognito:username');

        try {
            await signOutUser(username, req, res);
            redirectTo(res, '/');
        } catch (error) {
            console.error(`failed to sign out user: ${error.stack}`);
            redirectTo(res, '/');
        }
    } catch (error) {
        const message = 'There was a problem signing out of your account';
        redirectToError(res, message, error);
    }
};
