import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import AWS from 'aws-sdk';
import { STAGE } from '../../../constants/index';
import { Feedback } from '../../../interfaces';

export const buildFeedbackContent = (feedbackQuestions: Feedback[]): string => {
    const questionsAndAnswers = feedbackQuestions.map(question => {
        return `Question: ${question.question}\nAnswer: ${question.answer}`;
    });

    return questionsAndAnswers.join('\n');
};

export const setFeedbackMailOptions = (nocCodeOfSender: string, feedback: Feedback[]): Mail.Options => {
    return {
        from: 'fdbt@transportforthenorth.com',
        to: 'fdbt-support@infinityworks.com',
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
