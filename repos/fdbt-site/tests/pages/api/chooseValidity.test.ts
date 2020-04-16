import { setCookieOnResponseObject } from '../../../src/pages/api/apiUtils/index';
import chooseValidity from '../../../src/pages/api/chooseValidity';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('chooseValidity', () => {
    let writeHeadMock: jest.Mock;

    beforeEach(() => {
        writeHeadMock = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
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
        [{ validityInput: '2' }, { Location: '/periodValidity' }],
    ];

    test.each(cases)('given %p as request, redirects to %p', (testData, expectedLocation) => {
        const { req, res } = getMockRequestAndResponse({}, testData, {}, writeHeadMock);

        (setCookieOnResponseObject as {}) = jest.fn();
        chooseValidity(req, res);
        expect(writeHeadMock).toBeCalledWith(302, expectedLocation);
    });

    it('should set the validity stages cookie according to the specified number of fare stages', () => {
        const { req, res } = getMockRequestAndResponse({}, { validityInput: '6' });

        const mockSetCookies = jest.fn();

        (setCookieOnResponseObject as {}) = jest.fn().mockImplementation(() => {
            mockSetCookies();
        });

        chooseValidity(req, res);

        expect(mockSetCookies).toBeCalledTimes(1);
    });
});
