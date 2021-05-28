import { NextApiResponse } from 'next';
import { redirectTo, redirectToError, checkEmailValid, validatePassword } from './apiUtils';
import { USER_ATTRIBUTE } from '../../constants/attributes';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { initiateAuth, globalSignOut, updateUserAttributes, respondToNewPasswordChallenge } from '../../data/cognito';
import logger from '../../utils/logger';
import { getAllServicesByNocCode } from '../../data/auroradb';
import { updateSessionAttribute } from '../../utils/sessions';

export const nocsWithNoServices = async (nocs: string[]): Promise<string[]> => {
    const servicesFoundPromise = nocs.map((noc: string) => getAllServicesByNocCode(noc));

    const servicesFound = await Promise.all(servicesFoundPromise);

    const nocsWithNoTnds = nocs
        .map((noc, index) => {
            if (servicesFound[index].length === 0) {
                return noc;
            }
            return '';
        })
        .filter(noc => noc);

    return nocsWithNoTnds;
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    const setErrorsAttributeAndRedirect = (inputChecks: ErrorInfo[], regKey: string): void => {
        updateSessionAttribute(req, USER_ATTRIBUTE, {
            errors: inputChecks,
        });
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
            setErrorsAttributeAndRedirect(inputChecks, regKey);
            return;
        }

        try {
            const { ChallengeName, ChallengeParameters, Session } = await initiateAuth(email, regKey);

            if (ChallengeName === 'NEW_PASSWORD_REQUIRED' && ChallengeParameters?.userAttributes && Session) {
                const parameters = JSON.parse(ChallengeParameters.userAttributes);
                const cognitoNocs = (parameters['custom:noc'] as string | undefined)?.split('|');

                if (!cognitoNocs) {
                    throw new Error('No NOCs returned from cognito');
                }

                const isSchemeOperator = !!parameters['custom:schemeOperator'];
                const nocsWithNoTnds = await nocsWithNoServices(cognitoNocs);

                if (!isSchemeOperator && !(nocsWithNoTnds.length < cognitoNocs.length)) {
                    logger.warn('', {
                        context: 'api.register',
                        message: 'registration aborted, no TNDS data',
                    });

                    redirectTo(res, '/noServices');
                    return;
                }

                await respondToNewPasswordChallenge(ChallengeParameters.USER_ID_FOR_SRP, password, Session);
                await updateUserAttributes(email, [{ Name: 'custom:contactable', Value: contactable }]);
                await globalSignOut(email);

                logger.info('', {
                    context: 'api.register',
                    message: 'registration successful',
                });

                if (!isSchemeOperator && nocsWithNoTnds.length > 0) {
                    redirectTo(res, `/confirmRegistration?nocs=${nocsWithNoTnds.join('|')}`);
                    return;
                }

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

            setErrorsAttributeAndRedirect(inputChecks, regKey);
        }
    } catch (error) {
        const message = 'There was a problem with the creation of the account';
        redirectToError(res, message, 'api.register', error);
    }
};
