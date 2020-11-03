import { NextApiRequest, NextApiResponse } from 'next';
import { redirectTo, redirectToError, setCookieOnResponseObject, checkEmailValid, validatePassword } from './apiUtils';
import { USER_COOKIE } from '../../constants';
import { ErrorInfo } from '../../interfaces';
import { initiateAuth, globalSignOut, updateUserAttributes, respondToNewPasswordChallenge } from '../../data/cognito';
import logger from '../../utils/logger';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const setErrorsCookie = (inputChecks: ErrorInfo[], regKey: string): void => {
        const cookieContent = JSON.stringify({ inputChecks });
        setCookieOnResponseObject(USER_COOKIE, cookieContent, req, res);
        redirectTo(res, `/register?key=${regKey}`);
    };

    try {
        const { email, password, confirmPassword, regKey } = req.body;

        let { contactable } = req.body;

        if (!contactable) {
            contactable = 'no';
        }

        const inputChecks: ErrorInfo[] = [];

        const emailValid = checkEmailValid(email);

        inputChecks.push({
            userInput: !emailValid ? '' : email,
            id: 'email',
            errorMessage: !emailValid ? 'Enter an email address in the correct format, like name@example.com' : '',
        });

        const passwordValidityError = validatePassword(password, confirmPassword, 'password');

        if (passwordValidityError) {
            inputChecks.push({ userInput: '', ...passwordValidityError });
        }

        if (inputChecks.some(el => el.errorMessage !== '')) {
            setErrorsCookie(inputChecks, regKey);
            return;
        }

        try {
            const { ChallengeName, ChallengeParameters, Session } = await initiateAuth(email, regKey);

            if (ChallengeName === 'NEW_PASSWORD_REQUIRED' && ChallengeParameters?.userAttributes && Session) {
                await respondToNewPasswordChallenge(ChallengeParameters.USER_ID_FOR_SRP, password, Session);
                await updateUserAttributes(email, [{ Name: 'custom:contactable', Value: contactable }]);
                await globalSignOut(email);

                logger.info('', {
                    context: 'api.register',
                    message: 'registration successful',
                });

                redirectTo(res, '/confirmRegistration');
            } else {
                throw new Error(`unexpected challenge: ${ChallengeName}`);
            }
        } catch (error) {
            logger.error(error, {
                context: 'api.register',
                message: 'registration failed',
            });

            inputChecks.push({
                userInput: '',
                id: 'email',
                errorMessage: 'There was a problem creating your account',
            });

            setErrorsCookie(inputChecks, regKey);
        }
    } catch (error) {
        const message = 'There was a problem with the creation of the account';
        redirectToError(res, message, 'api.register', error);
    }
};
