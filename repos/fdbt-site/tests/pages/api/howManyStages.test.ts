import mockReqRes, { mockRequest, mockResponse } from 'mock-req-res';
import howManyFareStages from '../../../src/pages/api/howManyStages';

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
                encrypted: false,
            },
            body: {},
            headers: {
                host: 'localhost:5000',
                cookie: '',
            },
        });
        howManyFareStages(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/howManyStages',
        });
    });

    // it('should return 302 redirect to /error when an number of fare stages value we dont expect is passed', () => {
    //     const req = mockRequest({
    //         connection: {
    //             encrypted: false,
    //         },
    //         body: { inputMethod: 'pdf' },
    //         headers: {
    //             host: 'localhost:5000',
    //             cookie: '',
    //         },
    //     });

    //     inputMethod(req, res);

    //     expect(writeHeadMock).toBeCalledWith(302, {
    //         Location: '/error',
    //     });
    // });

    // it('should return 302 redirect to /csvUpload when more then 20 fare stages is selected', () => {
    //     const req = mockRequest({
    //         connection: {
    //             encrypted: false,
    //         },
    //         body: { howmanyfareStages: 'more than 20 fare stages' },
    //         headers: {
    //             host: 'localhost:5000',
    //             cookie: '',
    //         },
    //     });

    //     inputMethod(req, res);

    //     expect(writeHeadMock).toBeCalledWith(302, {
    //         Location: '/csvUpload',
    //     });
    // });
});
