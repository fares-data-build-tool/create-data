import service from '../../../src/pages/api/service';
import { getMockRequestAndResponse } from '../../testData/mockData';
import { getUuidFromSession } from '../../../src/pages/api/apiUtils';

afterEach(() => {
    jest.resetAllMocks();
});

describe('service', () => {
    it('should return 302 redirect to /service when there is no body in the request', () => {
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

    it('should return 302 redirect to /singleDirection when there is a service selected', () => {
        (getUuidFromSession as {}) = jest.fn().mockReturnValue({ uuid: 'testUuid' });
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({
            body: { service: 'test' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        service(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/singleDirection',
        });
    });
});
