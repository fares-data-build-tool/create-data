import { NextApiResponse } from 'next';
import { setFeedbackMailOptions, createMailTransporter } from './apiUtils/feedbackEmailer';
import { removeExcessWhiteSpace } from './apiUtils/validator';
import { redirectToError, redirectTo, getAndValidateNoc, getAndValidateSchemeOpRegion } from './apiUtils/index';
import { NextApiRequestWithSession, Feedback } from '../../interfaces';
import {
    contactFeedbackQuestion,
    solveFeedbackQuestion,
    hearAboutUsFeedbackQuestion,
    generalFeedbackQuestion,
} from '../../constants';
import logger from '../../utils/logger';

export const buildFeedbackForEmail = (req: NextApiRequestWithSession): Feedback[] => {
    const { body } = req;
    const feedback: Feedback[] = [];
    const refinedHearAboutServiceInput = removeExcessWhiteSpace(body.hearAboutServiceQuestion);
    const refinedGeneralFeedbackInput = removeExcessWhiteSpace(body.generalFeedbackQuestion);
    if (refinedHearAboutServiceInput && refinedHearAboutServiceInput !== '') {
        feedback.push({
            question: hearAboutUsFeedbackQuestion,
            answer: refinedHearAboutServiceInput,
        });
    }
    if (refinedGeneralFeedbackInput && refinedGeneralFeedbackInput !== '') {
        feedback.push({
            question: generalFeedbackQuestion,
            answer: refinedGeneralFeedbackInput,
        });
    }
    if (body.contactQuestion) {
        feedback.push({
            question: contactFeedbackQuestion,
            answer: body.contactQuestion,
        });
    }
    if (body.problemQuestion) {
        feedback.push({
            question: solveFeedbackQuestion,
            answer: body.problemQuestion,
        });
    }

    return feedback;
};

export const requestIsEmpty = (req: NextApiRequestWithSession): boolean => {
    const { body } = req;
    const refinedHearAboutServiceInput = removeExcessWhiteSpace(body.hearAboutServiceQuestion);
    const refinedGeneralFeedbackInput = removeExcessWhiteSpace(body.generalFeedbackQuestion);
    if (
        !body.contactQuestion &&
        !body.problemQuestion &&
        refinedHearAboutServiceInput === '' &&
        refinedGeneralFeedbackInput === ''
    ) {
        return true;
    }

    return false;
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        if (requestIsEmpty(req)) {
            redirectTo(res, '/feedback?feedbackSubmitted=false');
            return;
        }

        const feedback: Feedback[] = buildFeedbackForEmail(req);
        const noc: string = getAndValidateSchemeOpRegion(req, res) || getAndValidateNoc(req, res);
        const mailOptions = setFeedbackMailOptions(noc, feedback);

        if (process.env.NODE_ENV !== 'production') {
            logger.info('mailOptions', {
                context: 'api.feedback',
                message: mailOptions,
            });
        } else {
            const mailTransporter = createMailTransporter();
            await mailTransporter.sendMail(mailOptions);
            logger.info('', {
                context: 'api.feedback',
                message: 'Email sent.',
            });
        }

        redirectTo(res, '/feedback?feedbackSubmitted=true');
        return;
    } catch (error) {
        const message = 'There was a problem receiving the user feedback.';
        redirectToError(res, message, 'api.feedback', error);
    }
};
