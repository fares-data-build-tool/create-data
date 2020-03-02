import { mockRequest, mockResponse } from 'mock-req-res';
import http from 'http';
import service from '../../../src/pages/api/service';
import { OPERATOR_COOKIE } from '../../../src/constants';

http.OutgoingMessage.prototype.setHeader = jest.fn();

describe('service', () => {
    const mockOperatorCookie = `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D`;
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /inputMethod when the session is valid, there is no service cookie BUT one can be set', () => {
        const writeHeadMock = jest.fn();
        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            body: { service: 'test_service' },
            headers: {
                host: 'localhost:5000',
                cookie: mockOperatorCookie,
            },
        });
        const res = mockResponse({
            writeHead: writeHeadMock,
        });
        service(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/direction',
        });
    });

    it('should return 302 redirect to /service when session is valid but there is neither a service cookie nor can one be set', () => {
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
        service(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/service',
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
        service(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
