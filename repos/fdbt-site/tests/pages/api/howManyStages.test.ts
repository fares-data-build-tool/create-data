import mockReqRes, { mockRequest, mockResponse } from 'mock-req-res';
import howManyStages from '../../../src/pages/api/howManyStages';

describe('howManyStages', () => {
    let res: mockReqRes.ResponseOutput;
    let writeHeadMock: jest.Mock;

    beforeEach(() => {
        jest.resetAllMocks();
        writeHeadMock = jest.fn();
        res = mockResponse({
            writeHead: writeHeadMock,
        });
    });

    it('should return 302 redirect to /howManyStages when a number of fare stages is not selected', () => {
        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            body: {},
            headers: {
                host: 'localhost:5000',
                cookie: '',
            },
        });
        howManyStages(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/howManyStages',
        });
    });

    it('should return 302 redirect to /error when an number of fare stages value we dont expect is passed', () => {
        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            body: { howManyStages: '100' },
            headers: {
                host: 'localhost:5000',
                cookie: '',
            },
        });

        expect(() => howManyStages(req, res)).toThrow();

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should return 302 redirect to /csvUpload when more then 20 fare stages is selected', () => {
        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            body: { howManyStages: 'moreThan20' },
            headers: {
                host: 'localhost:5000',
                cookie: '',
            },
        });

        howManyStages(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
    });

    it('should return 302 redirect to /chooseStages when less than 20 fare stages is selected', () => {
        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            body: { howManyStages: 'lessThan20' },
            headers: {
                host: 'localhost:5000',
                cookie: '',
            },
        });

        howManyStages(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/chooseStages',
        });
    });
});
