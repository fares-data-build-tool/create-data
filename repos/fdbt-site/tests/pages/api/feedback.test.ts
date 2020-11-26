import { getMockRequestAndResponse } from '../../testData/mockData';
import feedback, { requestIsEmpty } from '../../../src/pages/api/feedback';

describe('feedback', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should redirect to the feedback page with query string true if feedback was submitted properly', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                contactQuestion: 'Yes',
                problemQuestion: 'No',
                hearAboutServiceQuestion: 'Heard about it from colleague',
                generalFeedbackQuestion: 'Should be easier to use',
            },
            mockWriteHeadFn: writeHeadMock,
        });
        feedback(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/feedback?feedbackSubmitted=true',
        });
    });

    it('should redirect to the feedback page with query string false if feedback was empty', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                hearAboutServiceQuestion: '',
                generalFeedbackQuestion: '',
            },
            mockWriteHeadFn: writeHeadMock,
        });
        feedback(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/feedback?feedbackSubmitted=false',
        });
    });

    describe('requestIsEmpty', () => {
        it('should return true if req.body is empty', () => {
            const { req } = getMockRequestAndResponse({
                body: {
                    hearAboutServiceQuestion: '',
                    generalFeedbackQuestion: '',
                },
            });
            expect(requestIsEmpty(req)).toBeTruthy();
        });

        it('should return false if req.body is not empty', () => {
            const { req } = getMockRequestAndResponse({
                body: {
                    hearAboutServiceQuestion: 'From a friend',
                    generalFeedbackQuestion: '          ',
                },
            });
            expect(requestIsEmpty(req)).toBeFalsy();
        });
    });
});
