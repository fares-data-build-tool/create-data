import { setCookieOnResponseObject } from '../../../src/pages/api/apiUtils/index';
import chooseValidity from '../../../src/pages/api/chooseValidity';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('chooseValidity', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    const cases: {}[] = [
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
        const writeHeadMock = jest.fn();
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
