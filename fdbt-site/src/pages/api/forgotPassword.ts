import { NextApiResponse } from 'next';
import { FORGOT_PASSWORD_ATTRIBUTE } from '../../constants/attributes';
import { redirectTo, redirectToError, checkEmailValid } from './apiUtils';
import { forgotPassword } from '../../data/cognito';
import { updateSessionAttribute } from '../../utils/sessions';
import { NextApiRequestWithSession } from '../../interfaces';

const errorId = 'email';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email || !email.trim().length) {
            updateSessionAttribute(req, FORGOT_PASSWORD_ATTRIBUTE, {
                email,
                errors: [
                    {
                        errorMessage: 'Enter your email address',
                        id: errorId,
                    },
                ],
            });
            redirectTo(res, '/forgotPassword');
            return;
        }

        if (checkEmailValid(email)) {
            await forgotPassword(email);

            updateSessionAttribute(req, FORGOT_PASSWORD_ATTRIBUTE, {
                email,
            });
            redirectTo(res, '/resetConfirmation');
        } else {
            updateSessionAttribute(req, FORGOT_PASSWORD_ATTRIBUTE, {
                email,
                errors: [
                    {
                        errorMessage: 'Invalid email format - Enter a valid email address',
                        id: errorId,
                    },
                ],
            });
            redirectTo(res, '/forgotPassword');
        }
    } catch (error) {
        const message = 'There was a problem with requesting a password reset.';
        redirectToError(res, message, 'api.forgotPassword', error);
    }
};
