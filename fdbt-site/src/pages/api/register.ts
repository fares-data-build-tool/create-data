import { NextApiRequest, NextApiResponse } from 'next';
import { redirectTo, redirectToError, setCookieOnResponseObject, checkEmailValid, validatePassword } from './apiUtils';
import { USER_COOKIE, INTERNAL_NOC } from '../../constants';
import { ErrorInfo } from '../../interfaces';
import { getServicesByNocCode } from '../../data/auroradb';
import { initiateAuth, globalSignOut, updateUserAttributes, respondToNewPasswordChallenge } from '../../data/cognito';
import logger from '../../utils/logger';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const setErrorsCookie = (inputChecks: ErrorInfo[], regKey: string): void => {
        const cookieContent = JSON.stringify({ inputChecks });
        setCookieOnResponseObject(USER_COOKIE, cookieContent, req, res);
        redirectTo(res, `/register?key=${regKey}`);
    };

    try {
        const { email, password, confirmPassword, nocCode, regKey } = req.body;

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

        inputChecks.push({
            userInput: nocCode,
            id: 'noc-code',
            errorMessage: nocCode === '' ? 'National Operator Code cannot be empty' : '',
        });

        if (nocCode !== '' && nocCode !== INTERNAL_NOC) {
            const servicesForNoc = await getServicesByNocCode(nocCode);

            if (servicesForNoc.length === 0) {
                logger.warn('', {
                    context: 'api.register',
                    message: 'NOC not found in database',
                    nocCode,
                });

                inputChecks.push({
                    userInput: '',
                    id: 'email',
                    errorMessage: 'There was a problem creating your account',
                });
            }
        }

        if (inputChecks.some(el => el.errorMessage !== '')) {
            setErrorsCookie(inputChecks, regKey);
            return;
        }

        try {
            const { ChallengeName, ChallengeParameters, Session } = await initiateAuth(email, regKey);

            if (ChallengeName === 'NEW_PASSWORD_REQUIRED' && ChallengeParameters?.userAttributes && Session) {
                const parameters = JSON.parse(ChallengeParameters.userAttributes);

                const cognitoNocs = (parameters['custom:noc'] as string | undefined)?.split('|');

                if (!cognitoNocs || !cognitoNocs.includes(nocCode)) {
                    logger.warn('', {
                        context: 'api.register',
                        message: 'NOC does not match',
                        inputtedNoc: nocCode,
                        requiredNoc: parameters['custom:noc'] || '',
                    });

                    throw new Error('NOC does not match');
                }

                await respondToNewPasswordChallenge(ChallengeParameters.USER_ID_FOR_SRP, password, Session);
                await updateUserAttributes(email, [{ Name: 'custom:contactable', Value: contactable }]);
                await globalSignOut(email);

                logger.info('', {
                    context: 'api.register',
                    message: 'registration successful',
                    noc: nocCode,
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
