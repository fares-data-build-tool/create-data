import { isSessionValid } from '../../../src/pages/api/service/validator';
import { setCookieOnResponseObject, getUuidFromCookie } from '../../../src/pages/api/apiUtils/index';
import direction from '../../../src/pages/api/direction';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('direction', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /direction (i.e. itself) when the session is valid, but there is no request body', () => {
        const { req, res } = getMockRequestAndResponse({}, null, {}, writeHeadMock);
        (setCookieOnResponseObject as {}) = jest.fn();
        direction(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/direction',
        });
    });

    it('should return 302 redirect to /inputMethod when session is valid and request body is present', () => {
        (isSessionValid as {}) = jest.fn().mockReturnValue(true);
        (getUuidFromCookie as {}) = jest.fn().mockReturnValue({ uuid: 'testUuid' });
        const { req, res } = getMockRequestAndResponse({}, { journeyPattern: 'test_journey' }, {}, writeHeadMock);
        (setCookieOnResponseObject as {}) = jest.fn();
        direction(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/inputMethod',
        });
    });

    it('should return 302 redirect to /error when session is not valid', () => {
        const { req, res } = getMockRequestAndResponse({ operator: null }, null, {}, writeHeadMock);
        direction(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
