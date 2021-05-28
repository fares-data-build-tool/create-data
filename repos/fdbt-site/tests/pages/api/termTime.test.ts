import termTime from '../../../src/pages/api/termTime';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as sessions from '../../../src/utils/sessions';
import { TERM_TIME_ATTRIBUTE } from '../../../src/constants/attributes';
import { ErrorInfo } from '../../../src/interfaces';

describe('termTime', () => {
    const writeHeadMock = jest.fn();
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should successfully redirect to /schoolFareType when No radio button is selected', () => {
        const { req, res } = getMockRequestAndResponse({
            body: { termTime: 'No' },
            mockWriteHeadFn: writeHeadMock,
        });
        termTime(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, TERM_TIME_ATTRIBUTE, { termTime: false });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/schoolFareType',
        });
    });

    it('should successfully redirect to /schoolFareType when Yes radio button is selected', () => {
        const { req, res } = getMockRequestAndResponse({
            body: { termTime: 'Yes' },
            mockWriteHeadFn: writeHeadMock,
        });
        termTime(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, TERM_TIME_ATTRIBUTE, { termTime: true });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/schoolFareType',
        });
    });

    it('should successfully redirect to itself (i.e. /termTime) with errors when no radio button is selected', () => {
        const mockError: ErrorInfo[] = [
            {
                id: 'term-time-yes',
                errorMessage: 'Choose an option below',
            },
        ];
        const { req, res } = getMockRequestAndResponse({
            body: {},
            mockWriteHeadFn: writeHeadMock,
        });
        termTime(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, TERM_TIME_ATTRIBUTE, {
            termTime: false,
            errors: mockError,
        });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/termTime',
        });
    });
});
