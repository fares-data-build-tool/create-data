import { mockRequest, mockResponse } from 'mock-req-res';
import http from 'http';
import stageNames, { isStageNameValid } from '../../../src/pages/api/stageNames';
import { OPERATOR_COOKIE, FARE_STAGES_COOKIE } from '../../../src/constants';

http.OutgoingMessage.prototype.setHeader = jest.fn();

describe('stageNames', () => {
    const mockCookie = `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22HCTY%22%2C%22uuid%22%3A%221e0459b3-082e-4e70-89db-96e8ae173e10%22%2C%22nocCode%22%3A%22HCTY%22%7D; ${FARE_STAGES_COOKIE}=%7B%22fareStages%22%3A%226%22%7D`;

    describe('isStageNameValid', () => {
        it('should return an array of invalid input checks when the user enters no data', () => {
            const req = mockRequest({
                connection: {
                    encrypted: false,
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
                    encrypted: false,
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
                    encrypted: false,
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

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /stageNames (i.e. itself) when the session is valid, but there is no request body', () => {
        const writeHeadMock = jest.fn();
        const req = mockRequest({
            connection: {
                encrypted: false,
            },
            body: { stageNameInput: ['', '', '', ''] },
            headers: {
                host: 'localhost:5000',
                cookie: mockCookie,
            },
        });
        const res = mockResponse({
            writeHead: writeHeadMock,
        });
        stageNames(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/stageNames',
        });
    });

    it('should return 302 redirect to /priceEntry when session is valid and request body is present', () => {
        const writeHeadMock = jest.fn();
        const req = mockRequest({
            connection: {
                encrypted: false,
            },
            body: { stageNameInput: ['a', 'b', 'c', 'd'] },
            headers: {
                host: 'localhost:5000',
                cookie: mockCookie,
            },
        });
        const res = mockResponse({
            writeHead: writeHeadMock,
        });
        stageNames(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/priceEntry',
        });
    });

    it('should return 302 redirect to /error when session is not valid', () => {
        const writeHeadMock = jest.fn();
        const req = mockRequest({
            connection: {
                encrypted: false,
            },
            body: {},
            headers: {
                host: 'localhost:5000',
            },
        });
        const res = mockResponse({
            writeHead: writeHeadMock,
        });
        stageNames(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
