import mockReqRes, { mockRequest, mockResponse } from 'mock-req-res';
import { setCookieOnResponseObject } from '../../../src/pages/api/apiUtils/index';
import chooseValidity from '../../../src/pages/api/chooseValidity';

describe('chooseValidity', () => {
    let res: mockReqRes.ResponseOutput;
    let writeHeadMock: jest.Mock;

    beforeEach(() => {
        jest.resetAllMocks();
        writeHeadMock = jest.fn();
        res = mockResponse({
            writeHead: writeHeadMock,
        });
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cases: any[] = [
        [{}, { Location: '/chooseValidity' }],
        [{ validityInput: 'abcdefghijk' }, { Location: '/error' }],
        [{ validityInput: '1.2' }, { Location: '/error' }],
        [{ validityInput: 1.2 }, { Location: '/error' }],
        [{ validityInput: '367' }, { Location: '/error' }],
        [{ validityInput: 367 }, { Location: '/error' }],
        [{ validityInput: '0' }, { Location: '/error' }],
        [{ validityInput: 0 }, { Location: '/error' }],
        [{ validityInput: '1' }, { Location: '/periodValidity' }],
        [{ validityInput: "[]'l..33" }, { Location: '/error' }],
        [{ validityInput: '366' }, { Location: '/periodValidity' }],
        [{ validityInput: 6 }, { Location: '/periodValidity' }],
        [{ validityInput: '-1' }, { Location: '/error' }],
    ];

    test.each(cases)('given %p as request, redirects to %p', (testData, expectedLocation) => {
        (setCookieOnResponseObject as {}) = jest.fn();
        chooseValidity(mockRequest({ body: testData }), res);
        expect(writeHeadMock).toBeCalledWith(302, expectedLocation);
    });

    it('should set the validity stages cookie according to the specified number of fare stages', () => {
        const req = mockRequest({
            body: { validityInput: '6' },
            headers: { origin: 'test' },
        });

        const mockSetCookies = jest.fn();

        (setCookieOnResponseObject as {}) = jest.fn().mockImplementation(() => {
            mockSetCookies();
        });

        chooseValidity(req, res);

        expect(mockSetCookies).toBeCalledTimes(1);
    });
});
