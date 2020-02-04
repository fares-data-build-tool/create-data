import { mockRequest, mockResponse } from 'mock-req-res';
import operator from '../../../src/pages/api/operator';
import { OPERATOR_COOKIE } from '../../../src/constants';

describe('operator', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /faretype when session operator cookie exists', () => {
        const writeHeadMock = jest.fn();
        const req = mockRequest({
            connection: {
                encrypted: false,
            },
            body: {},
            headers: {
                host: 'localhost:5000',
                cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D`,
            },
        });
        const res = mockResponse({
            writeHead: writeHeadMock,
        });
        operator(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/faretype',
        });
    });

    it('should return 302 redirect to /faretype when session operator cookie does not exist but req has operator', () => {
        const writeHeadMock = jest.fn();
        const req = mockRequest({
            connection: {
                encrypted: false,
            },
            body: { operator: 'test_operator' },
            headers: {
                host: 'localhost:5000',
            },
        });
        const res = mockResponse({
            writeHead: writeHeadMock,
        });
        operator(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/faretype',
        });
    });

    it('should return 302 redirect to /error when session operator cookie and operator body do not exist', () => {
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
        operator(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
