import { isSessionValid } from '../../../src/pages/api/apiUtils/validator';
import { setCookieOnResponseObject, getUuidFromCookie } from '../../../src/pages/api/apiUtils/index';
import direction from '../../../src/pages/api/singleDirection';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('direction', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /singleDirection (i.e. itself) when the session is valid, but there is no request body', () => {
        const mockFareTypeCookie = { 'fdbt-fareType': '{"fareType": "single"}' };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: mockFareTypeCookie,
            body: null,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        (setCookieOnResponseObject as {}) = jest.fn();
        direction(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/singleDirection',
        });
    });

    it('should return 302 redirect to /inputMethod when session is valid, request body is present and fareType is single', () => {
        (isSessionValid as {}) = jest.fn().mockReturnValue(true);
        (getUuidFromCookie as {}) = jest.fn().mockReturnValue({ uuid: 'testUuid' });
        const mockFareTypeCookie = { 'fdbt-fareType': '{"fareType": "single"}' };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: mockFareTypeCookie,
            body: { directionJourneyPattern: 'test_journey' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        (setCookieOnResponseObject as {}) = jest.fn();
        direction(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/inputMethod',
        });
    });

    it('should return 302 redirect to /error when session is not valid', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { operator: null },
            body: null,
            mockWriteHeadFn: writeHeadMock,
        });
        direction(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
