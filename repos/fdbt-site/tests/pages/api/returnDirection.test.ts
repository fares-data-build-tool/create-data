import * as apiUtils from '../../../src/utils/apiUtils/index';
import returnDirection from '../../../src/pages/api/returnDirection';
import { getMockRequestAndResponse } from '../../testData/mockData';

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
        jest.spyOn(apiUtils, 'setCookieOnResponseObject');
        returnDirection(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/returnDirection',
        });
    });

    it('should return 302 redirect to /inputMethod when request body is present with inbound and outbound journeys selected', () => {
        jest.spyOn(apiUtils, 'getUuidFromSession').mockReturnValue('testUuid');
        const mockFareTypeCookie = {
            'fdbt-journey': '{errorMessages: [], inboundJourney: "abc", outboundJourney: "def"}',
        };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: mockFareTypeCookie,
            body: { journeyPattern: 'test_journey', inboundJourney: 'inbound', outboundJourney: 'outbound' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        jest.spyOn(apiUtils, 'setCookieOnResponseObject');
        returnDirection(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/inputMethod',
        });
    });

    it('should return 302 redirect to /returnDirection when request body is not present', () => {
        jest.spyOn(apiUtils, 'getUuidFromSession').mockReturnValue('testUuid');
        const mockFareTypeCookie = { 'fdbt-fareType': '{"fareType": "returnSingle"}' };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: mockFareTypeCookie,
            body: { journeyPattern: 'test_journey' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        jest.spyOn(apiUtils, 'setCookieOnResponseObject');
        returnDirection(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/returnDirection',
        });
    });
});
