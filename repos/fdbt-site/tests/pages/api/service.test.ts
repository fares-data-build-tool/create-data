import service from '../../../src/pages/api/service';
import { getMockRequestAndResponse } from '../../testData/mockData';
import { isSessionValid } from '../../../src/pages/api/apiUtils/validator';
import { getUuidFromCookie } from '../../../src/pages/api/apiUtils';

afterEach(() => {
    jest.resetAllMocks();
});

describe('service', () => {
    it('should return 302 redirect to /service when the session is valid, but there is no body in the request', () => {
        (isSessionValid as {}) = jest.fn().mockReturnValue(true);
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {},
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        service(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/service',
        });
    });

    it('should return 302 redirect to /singleDirection when session is valid and there is a service selected', () => {
        (isSessionValid as {}) = jest.fn().mockReturnValue(true);
        (getUuidFromCookie as {}) = jest.fn().mockReturnValue({ uuid: 'testUuid' });
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { service: 'test' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        service(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/singleDirection',
        });
    });

    it('should return 302 redirect to /error when session is not valid', () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { operator: null },
            body: null,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        service(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
