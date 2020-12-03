import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import AWS from 'aws-sdk';
import { SERVICE_EMAIL_ADDRESS, STAGE, SUPPORT_EMAIL_ADDRESS } from '../../../constants/index';
import { Feedback } from '../../../interfaces';

export const buildFeedbackContent = (feedbackQuestions: Feedback[]): string => {
    const questionsAndAnswers = feedbackQuestions.map(question => {
        return `Question: ${question.question}\nAnswer: ${question.answer}`;
    });

    return questionsAndAnswers.join('\n');
};

export const setFeedbackMailOptions = (nocCodeOfSender: string, feedback: Feedback[]): Mail.Options => {
    return {
        from: SERVICE_EMAIL_ADDRESS,
        to: SUPPORT_EMAIL_ADDRESS,
        subject: `${STAGE} - Feedback received from ${nocCodeOfSender}`,
        text: buildFeedbackContent(feedback),
    };
};

export const createMailTransporter = (): Mail => {
    return nodemailer.createTransport({
        SES: new AWS.SES({
            apiVersion: '2010-12-01',
            region: 'eu-west-1',
        }),
    });
};
