import { mockRequest, mockResponse } from 'mock-req-res';
import { setCookieOnResponseObject } from '../../../src/pages/api/apiUtils/index';
import chooseValidity from '../../../src/pages/api/chooseValidity';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('chooseValidity', () => {
    let { res } = getMockRequestAndResponse();
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
        [{ validityInput: 'abcdefghijk' }, { Location: '/chooseValidity' }],
        [{ validityInput: '1.2' }, { Location: '/chooseValidity' }],
        [{ validityInput: 1.2 }, { Location: '/chooseValidity' }],
        [{ validityInput: '367' }, { Location: '/chooseValidity' }],
        [{ validityInput: 367 }, { Location: '/chooseValidity' }],
        [{ validityInput: '0' }, { Location: '/chooseValidity' }],
        [{ validityInput: 0 }, { Location: '/chooseValidity' }],
        [{ validityInput: "[]'l..33" }, { Location: '/chooseValidity' }],
        [{ validityInput: '-1' }, { Location: '/chooseValidity' }],
    ];

    test.each(cases)('given %p as request, redirects to %p', (testData, expectedLocation) => {
        (setCookieOnResponseObject as {}) = jest.fn();
        chooseValidity(mockRequest({ body: testData }), res);
        expect(writeHeadMock).toBeCalledWith(302, expectedLocation);
    });

    it('should set the validity stages cookie according to the specified number of fare stages', () => {
        const { req } = getMockRequestAndResponse({}, { validityInput: '6' });

        const mockSetCookies = jest.fn();

        (setCookieOnResponseObject as {}) = jest.fn().mockImplementation(() => {
            mockSetCookies();
        });

        chooseValidity(req, res);

        expect(mockSetCookies).toBeCalledTimes(1);
    });
});
