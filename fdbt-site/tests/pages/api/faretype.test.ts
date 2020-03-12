import http from 'http';
import faretype from '../../../src/pages/api/faretype';
import { getMockRequestAndResponse } from '../../testData/mockData';

http.OutgoingMessage.prototype.setHeader = jest.fn();

describe('faretype', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /service when the session is valid, there is no faretype cookie BUT one can be set', () => {
        const { req, res } = getMockRequestAndResponse({}, { faretype: 'single' }, {}, writeHeadMock);
        faretype(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/service',
        });
    });

    it('should return 302 redirect to /faretype when session is valid but there is neither a service cookie nor has one been set', () => {
        const { req, res } = getMockRequestAndResponse({ service: null }, null, {}, writeHeadMock);
        faretype(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/faretype',
        });
    });

    it('should return 302 redirect to /error when session is not valid', () => {
        const { req, res } = getMockRequestAndResponse({ operator: null }, null, {}, writeHeadMock);
        faretype(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
