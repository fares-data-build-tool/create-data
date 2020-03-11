import { setCookieOnResponseObject } from '../../../src/pages/api/apiUtils/index';
import chooseStages from '../../../src/pages/api/chooseStages';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('chooseStages', () => {
    let writeHeadMock: jest.Mock;

    beforeEach(() => {
        writeHeadMock = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cases: any[] = [
        [{}, { Location: '/chooseStages' }],
        [{ fareStageInput: 'abcdefghijk' }, { Location: '/error' }],
        [{ fareStageInput: '1.2' }, { Location: '/error' }],
        [{ fareStageInput: 1.2 }, { Location: '/error' }],
        [{ fareStageInput: '21' }, { Location: '/error' }],
        [{ fareStageInput: 21 }, { Location: '/error' }],
        [{ fareStageInput: '0' }, { Location: '/error' }],
        [{ fareStageInput: 0 }, { Location: '/error' }],
        [{ fareStageInput: '1' }, { Location: '/stageNames' }],
        [{ fareStageInput: "[]'l..33" }, { Location: '/error' }],
        [{ fareStageInput: '6' }, { Location: '/stageNames' }],
        [{ fareStageInput: 6 }, { Location: '/stageNames' }],
    ];

    test.each(cases)('given %p as request, redirects to %p', (testData, expectedLocation) => {
        const { req, res } = getMockRequestAndResponse({}, testData, {}, writeHeadMock);

        (setCookieOnResponseObject as {}) = jest.fn();
        chooseStages(req, res);
        expect(writeHeadMock).toBeCalledWith(302, expectedLocation);
    });

    it('should set the fare stages cookie according to the specified number of fare stages', () => {
        const { req, res } = getMockRequestAndResponse({}, { fareStageInput: '6' }, {}, writeHeadMock);

        const mockSetCookies = jest.fn();

        (setCookieOnResponseObject as {}) = jest.fn().mockImplementation(() => {
            mockSetCookies();
        });

        chooseStages(req, res);

        expect(mockSetCookies).toBeCalledTimes(1);
    });
});
