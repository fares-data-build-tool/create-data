import { getMockRequestAndResponse } from '../../testData/mockData';
import fareType from '../../../src/pages/api/fareType';

describe('fareType', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /passengerType when a ticket option is selected', () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({}, { fareType: 'single' }, {}, writeHeadMock);
        fareType(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/passengerType',
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
