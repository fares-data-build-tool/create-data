import { getMockRequestAndResponse } from '../../testData/mockData';
import multipleOperators from '../../../src/pages/api/multipleOperators';
import { setCookieOnResponseObject } from '../../../src/pages/api/apiUtils';

describe('multipleOperators', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /fareType when an operator is provided, and sets operator cookie', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { operator: 'Infinity Line' },
            uuid: {},
        });
        const mockSetCookies = jest.fn();

        (setCookieOnResponseObject as {}) = jest.fn().mockImplementation(() => {
            mockSetCookies();
        });

        multipleOperators(req, res);

        expect(mockSetCookies).toBeCalledTimes(1);
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/fareType',
        });
    });

    it('should return 302 redirect to /multipleOperators when operator not provided', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
        });
        const mockSetCookies = jest.fn();

        (setCookieOnResponseObject as {}) = jest.fn().mockImplementation(() => {
            mockSetCookies();
        });

        multipleOperators(req, res);

        expect(mockSetCookies).toBeCalledTimes(1);
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/multipleOperators',
        });
    });
});
