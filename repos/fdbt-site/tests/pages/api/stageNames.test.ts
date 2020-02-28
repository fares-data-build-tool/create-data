import mockReqRes, { mockRequest, mockResponse } from 'mock-req-res';
import http from 'http';
import { setCookieOnResponseObject } from '../../../src/pages/api/apiUtils/index';
import {
    OPERATOR_COOKIE,
    FARE_STAGES_COOKIE,
    STAGE_NAMES_COOKIE,
    STAGE_NAME_VALIDATION_COOKIE,
} from '../../../src/constants';
import stageNames, { isStageNameValid } from '../../../src/pages/api/stageNames';

http.OutgoingMessage.prototype.setHeader = jest.fn();

describe('stageNames', () => {
    let res: mockReqRes.ResponseOutput;
    let writeHeadMock: jest.Mock;
    const mockCookie = `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22HCTY%22%2C%22uuid%22%3A%221e0459b3-082e-4e70-89db-96e8ae173e10%22%2C%22nocCode%22%3A%22HCTY%22%7D; ${FARE_STAGES_COOKIE}=%7B%22fareStages%22%3A%226%22%7D`;

    beforeEach(() => {
        jest.resetAllMocks();
        writeHeadMock = jest.fn();
        res = mockResponse({
            writeHead: writeHeadMock,
        });
    });

    describe('isStageNameValid', () => {
        it('should return an array of invalid input checks when the user enters no data', () => {
            const req = mockRequest({
                connection: {
                    encrypted: true,
                },
                body: { stageNameInput: ['', '', '', ''] },
                headers: {
                    host: 'localhost:5000',
                    cookie: mockCookie,
                },
            });
            const expectedArray = [
                { Error: 'Enter a name for this fare stage', Input: '' },
                { Error: 'Enter a name for this fare stage', Input: '' },
                { Error: 'Enter a name for this fare stage', Input: '' },
                { Error: 'Enter a name for this fare stage', Input: '' },
            ];
            const inputCheck = isStageNameValid(req);
            expect(inputCheck).toEqual(expectedArray);
        });
        it('should return an array of valid input checks when the user enters correct data', () => {
            const req = mockRequest({
                connection: {
                    encrypted: true,
                },
                body: { stageNameInput: ['abcd', 'efg', 'hijkl', 'mn'] },
                headers: {
                    host: 'localhost:5000',
                    cookie: mockCookie,
                },
            });
            const expectedArray = [
                { Error: '', Input: 'abcd' },
                { Error: '', Input: 'efg' },
                { Error: '', Input: 'hijkl' },
                { Error: '', Input: 'mn' },
            ];
            const inputCheck = isStageNameValid(req);
            expect(inputCheck).toEqual(expectedArray);
        });
        it('should return an array of invalid and valid input checks when the user enters incorrect data', () => {
            const req = mockRequest({
                connection: {
                    encrypted: true,
                },
                body: { stageNameInput: ['abcde', '   ', 'xyz', ''] },
                headers: {
                    host: 'localhost:5000',
                    cookie: mockCookie,
                },
            });
            const expectedArray = [
                { Error: '', Input: 'abcde' },
                { Error: 'Enter a name for this fare stage', Input: '   ' },
                { Error: '', Input: 'xyz' },
                { Error: 'Enter a name for this fare stage', Input: '' },
            ];
            const inputCheck = isStageNameValid(req);
            expect(inputCheck).toEqual(expectedArray);
        });
    });

    it('should return 302 redirect to /stageNames (i.e. itself) when the session is valid, but there is no request body', () => {
        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            body: { stageNameInput: ['', '', '', ''] },
            headers: {
                host: 'localhost:5000',
                cookie: mockCookie,
            },
        });
        stageNames(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/stageNames',
        });
    });

    it('should return 302 redirect to /priceEntry when session is valid and request body is present', () => {
        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            body: { stageNameInput: ['a', 'b', 'c', 'd'] },
            headers: {
                host: 'localhost:5000',
                cookie: mockCookie,
            },
        });
        stageNames(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/priceEntry',
        });
    });

    it('should return 302 redirect to /error when session is not valid', () => {
        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            body: {},
            headers: {
                host: 'localhost:5000',
            },
        });
        stageNames(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should set the STAGE_NAMES_COOKIE and STAGE_NAME_VALIDATION_COOKIE with values matching the valid data entered by the user ', () => {
        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            body: { stageNameInput: ['a', 'b', 'c', 'd'] },
            headers: {
                host: 'localhost:5000',
                cookie: mockCookie,
            },
        });
        const mockInputCheck =
            '[{"Input":"a","Error":""},{"Input":"b","Error":""},{"Input":"c","Error":""},{"Input":"d","Error":""}]';
        const mockStageNamesCookieValue = '["a","b","c","d"]';
        const mockSetCookies = jest.fn();
        (setCookieOnResponseObject as {}) = jest
            .fn()
            .mockImplementation((domain, cookieName, cookieValue, mockReq, mockRes) => {
                mockSetCookies(domain, cookieName, cookieValue, mockReq, mockRes);
            });
        stageNames(req, res);
        expect(mockSetCookies).toBeCalledTimes(2);
        expect(mockSetCookies).toHaveBeenNthCalledWith(1, '', STAGE_NAMES_COOKIE, mockStageNamesCookieValue, req, res);
        expect(mockSetCookies).toHaveBeenNthCalledWith(2, '', STAGE_NAME_VALIDATION_COOKIE, mockInputCheck, req, res);
    });

    it('should set the STAGE_NAME_VALIDATION_COOKIE with a value matching the invalid data entered by the user', () => {
        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            body: { stageNameInput: [' ', 'abcdefghijklmnopqrstuvwxyzabcdefgh', '   ', 'b'] },
            headers: {
                host: 'localhost:5000',
                cookie: mockCookie,
            },
        });
        const mockInputCheck =
            '[{"Input":" ","Error":"Enter a name for this fare stage"},{"Input":"abcdefghijklmnopqrstuvwxyzabcdefgh","Error":"The name for Fare Stage 2 needs to be less than 30 characters"},{"Input":"   ","Error":"Enter a name for this fare stage"},{"Input":"b","Error":""}]';
        const mockSetCookies = jest.fn();
        (setCookieOnResponseObject as {}) = jest
            .fn()
            .mockImplementation((domain, cookieName, cookieValue, mockReq, mockRes) => {
                mockSetCookies(domain, cookieName, cookieValue, mockReq, mockRes);
            });
        stageNames(req, res);
        expect(mockSetCookies).toBeCalledTimes(1);
        expect(mockSetCookies).toBeCalledWith('', STAGE_NAME_VALIDATION_COOKIE, mockInputCheck, req, res);
    });
});
