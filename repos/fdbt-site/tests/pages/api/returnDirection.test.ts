import { getUuidFromCookie, setCookieOnResponseObject } from '../../../src/pages/api/apiUtils/index';
import returnDirection from '../../../src/pages/api/returnDirection';
import { getMockRequestAndResponse } from '../../testData/mockData';
import { isSessionValid } from '../../../src/pages/api/apiUtils/validator';

describe('returnDirection', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /returnDirection when the session is valid, but there is no request body', () => {
        const mockFareTypeCookie = { 'fdbt-fareType': '{"fareType": "single"}' };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: mockFareTypeCookie,
            body: null,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        (setCookieOnResponseObject as {}) = jest.fn();
        returnDirection(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/returnDirection',
        });
    });

    it('should return 302 redirect to /inputMethod when session is valid, request body is present with inbound and outbound journeys selected', () => {
        (isSessionValid as {}) = jest.fn().mockReturnValue(true);
        (getUuidFromCookie as {}) = jest.fn().mockReturnValue({ uuid: 'testUuid' });
        const mockFareTypeCookie = {
            'fdbt-journey': '{errorMessages: [], inboundJourney: "abc", outboundJourney: "def"}',
        };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: mockFareTypeCookie,
            body: { journeyPattern: 'test_journey', inboundJourney: 'inbound', outboundJourney: 'outbound' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        (setCookieOnResponseObject as {}) = jest.fn();
        returnDirection(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/inputMethod',
        });
    });

    it('should return 302 redirect to /returnDirection when session is valid, request body is not present', () => {
        (isSessionValid as {}) = jest.fn().mockReturnValue(true);
        (getUuidFromCookie as {}) = jest.fn().mockReturnValue({ uuid: 'testUuid' });
        const mockFareTypeCookie = { 'fdbt-fareType': '{"fareType": "returnSingle"}' };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: mockFareTypeCookie,
            body: { journeyPattern: 'test_journey' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        (setCookieOnResponseObject as {}) = jest.fn();
        returnDirection(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/returnDirection',
        });
    });

    it('should return 302 redirect to /error when session is not valid', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { operator: null },
            body: null,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        returnDirection(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
