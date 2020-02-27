import { mockRequest, mockResponse } from 'mock-req-res';
import http from 'http';
import { OPERATOR_COOKIE } from '../../../src/constants';
import faretype from '../../../src/pages/api/faretype';

http.OutgoingMessage.prototype.setHeader = jest.fn();

describe('faretype', () => {
    const mockOperatorCookie = `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D`;
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /service when the session is valid, there is no faretype cookie BUT one can be set', () => {
        const writeHeadMock = jest.fn();
        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            body: { faretype: 'single' },
            headers: {
                host: 'localhost:5000',
                cookie: mockOperatorCookie,
            },
        });
        const res = mockResponse({
            writeHead: writeHeadMock,
        });
        faretype(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/service',
        });
    });

    it('should return 302 redirect to /faretype when session is valid but there is neither a service cookie nor has one been set', () => {
        const writeHeadMock = jest.fn();
        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            body: {},
            headers: {
                host: 'localhost:5000',
                cookie: mockOperatorCookie,
            },
        });
        const res = mockResponse({
            writeHead: writeHeadMock,
        });
        faretype(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/faretype',
        });
    });

    it('should return 302 redirect to /error when session is not valid', () => {
        const writeHeadMock = jest.fn();
        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            body: {},
            headers: {
                host: 'localhost:5000',
            },
        });
        const res = mockResponse({
            writeHead: writeHeadMock,
        });
        faretype(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
