import * as apiUtils from '../../../src/utils/apiUtils/index';
import direction from '../../../src/pages/api/singleDirection';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('direction', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /singleDirection (i.e. itself) when there is no request body', () => {
        const { req, res } = getMockRequestAndResponse({
            body: null,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        jest.spyOn(apiUtils, 'setCookieOnResponseObject');
        direction(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/singleDirection',
        });
    });

    it('should return 302 redirect to /inputMethod when request body is present and fareType is single', () => {
        const { req, res } = getMockRequestAndResponse({
            body: { directionJourneyPattern: 'test_journey' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        jest.spyOn(apiUtils, 'setCookieOnResponseObject');
        direction(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/inputMethod',
        });
    });
});
