import http from 'http';
import { getMockRequestAndResponse } from '../../testData/mockData';
import fareType from '../../../src/pages/api/fareType';

http.OutgoingMessage.prototype.setHeader = jest.fn();

describe('fareType', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /service when the single ticket option is selected', () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({}, { fareType: 'single' }, {}, writeHeadMock);
        fareType(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/service',
        });
    });

    it('should return 302 redirect to /service when the return ticket option is selected', () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({}, { fareType: 'return' }, {}, writeHeadMock);
        fareType(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/service',
        });
    });

    it('should return 302 redirect to /periodType when the period ticket option is selected', () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({}, { fareType: 'period' }, {}, writeHeadMock);
        fareType(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/periodType',
        });
    });

    it('should return 302 redirect to /serviceList when the flat fare ticket option is selected', () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({}, { fareType: 'flatFare' }, {}, writeHeadMock);
        fareType(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/serviceList',
        });
    });

    it('should return 302 redirect to /fareType when session is valid but there is no service cookie set', () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({}, null, {}, writeHeadMock);
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
