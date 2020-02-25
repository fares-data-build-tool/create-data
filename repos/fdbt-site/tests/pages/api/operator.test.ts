import mockReqRes, { mockRequest, mockResponse } from 'mock-req-res';
import http from 'http';
import operator from '../../../src/pages/api/operator';

http.OutgoingMessage.prototype.setHeader = jest.fn();

describe('operator', () => {
    let res: mockReqRes.ResponseOutput;
    let writeHeadMock: jest.Mock;
    beforeEach(() => {
        jest.resetAllMocks();
        writeHeadMock = jest.fn();
        res = mockResponse({
            writeHead: writeHeadMock,
        });
    });

    it('should return 302 redirect to /faretype when session operator cookie does not exist but req has operator', () => {
        const req = mockRequest({
            connection: {
                encrypted: false,
            },
            body: { operator: '{"operatorName":"Connexions Buses","nocCode":"HCTY"}' },
            headers: {
                host: 'localhost:5000',
            },
        });
        operator(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/faretype',
        });
    });

    it('should return 302 redirect to /operator when session operator cookie and operator body do not exist', () => {
        const req = mockRequest({
            connection: {
                encrypted: false,
            },
            body: {},
            headers: {
                host: 'localhost:5000',
            },
        });
        operator(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/operator',
        });
        expect(writeHeadMock).toBeCalledTimes(1);
    });
});
