import service from '../../../src/pages/api/service';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('service', () => {
    it('should return 302 redirect to /inputMethod when the session is valid, there is no service cookie BUT one can be set', () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({}, { service: 'test_service' }, {}, writeHeadMock);
        service(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/direction',
        });
    });

    it('should return 302 redirect to /service when session is valid but there is neither a service cookie nor can one be set', () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({}, null, {}, writeHeadMock);
        service(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/service',
        });
    });

    it('should return 302 redirect to /error when session is not valid', () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({ operator: null }, null, {}, writeHeadMock);
        service(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
