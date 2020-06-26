import { getMockRequestAndResponse } from '../../testData/mockData';
import fareType from '../../../src/pages/api/fareType';

describe('fareType', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /passengerType when a ticket option is selected', () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { fareType: 'single' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        fareType(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/passengerType',
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
        fareType(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
