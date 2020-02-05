import mockReqRes, { mockRequest, mockResponse } from 'mock-req-res';
import inputMethod from '../../../src/pages/api/inputMethod';

describe('inputMethod', () => {
    let res: mockReqRes.ResponseOutput;
    let writeHeadMock: jest.Mock<any>;

    beforeEach(() => {
        jest.resetAllMocks();
        writeHeadMock = jest.fn();
        res = mockResponse({
            writeHead: writeHeadMock,
        });
    });

    it('should return 302 redirect to /inputMethod when no input method is selected', () => {
        const req = mockRequest({
            connection: {
                encrypted: false,
            },
            body: {},
            headers: {
                host: 'localhost:5000',
                cookie: '',
            },
        });
        inputMethod(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/inputMethod',
        });
    });

    it('should return 302 redirect to /error when an input method value we dont expect is passed', () => {
        const req = mockRequest({
            connection: {
                encrypted: false,
            },
            body: { uploadType: 'pdf' },
            headers: {
                host: 'localhost:5000',
                cookie: '',
            },
        });

        inputMethod(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should return 302 redirect to /csvUpload when csv is the passed input method', () => {
        const req = mockRequest({
            connection: {
                encrypted: false,
            },
            body: { uploadType: 'csv' },
            headers: {
                host: 'localhost:5000',
                cookie: '',
            },
        });

        inputMethod(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
    });
});
