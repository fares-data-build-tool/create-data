import http from 'http';
import { getMockRequestAndResponse } from '../../testData/mockData';
import fareType from '../../../src/pages/api/fareType';

http.OutgoingMessage.prototype.setHeader = jest.fn();

describe('fareType', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /service when the session is valid, there is no fareType cookie BUT one can be set', () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({}, { fareType: 'single' }, {}, writeHeadMock);
        fareType(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/service',
        });
    });

    it('should return 302 redirect to /service when return single option is selected', () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({}, { fareType: 'return' }, {}, writeHeadMock);
        fareType(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/service',
        });
    });

    it('should return 302 redirect to /fareType when session is valid but there is neither a service cookie nor has one been set', () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({ service: null }, null, {}, writeHeadMock);
        fareType(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/fareType',
        });
    });

    it('should return 302 redirect to /error when session is not valid', () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({ operator: null }, null, {}, writeHeadMock);
        fareType(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
