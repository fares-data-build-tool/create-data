import { ChooseStagesInputCheck } from '../../../src/pages/chooseStages';
import { setCookieOnResponseObject } from '../../../src/pages/api/apiUtils/index';
import chooseStages, { isInvalidFareStageNumber } from '../../../src/pages/api/chooseStages';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('chooseStages', () => {
    let writeHeadMock: jest.Mock;

    beforeEach(() => {
        writeHeadMock = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    const cases: {}[] = [
        [{}, { Location: '/chooseStages' }],
        [{ fareStageInput: 'abcdefghijk' }, { Location: '/chooseStages' }],
        [{ fareStageInput: '1.2' }, { Location: '/chooseStages' }],
        [{ fareStageInput: 1.2 }, { Location: '/chooseStages' }],
        [{ fareStageInput: '21' }, { Location: '/chooseStages' }],
        [{ fareStageInput: 21 }, { Location: '/chooseStages' }],
        [{ fareStageInput: '0' }, { Location: '/chooseStages' }],
        [{ fareStageInput: 0 }, { Location: '/chooseStages' }],
        [{ fareStageInput: '1' }, { Location: '/chooseStages' }],
        [{ fareStageInput: '2' }, { Location: '/stageNames' }],
        [{ fareStageInput: "[]'l..33" }, { Location: '/chooseStages' }],
        [{ fareStageInput: '6' }, { Location: '/stageNames' }],
        [{ fareStageInput: 6 }, { Location: '/stageNames' }],
    ];

    test.each(cases)('given %p as request, redirects to %p', (testData, expectedLocation) => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: testData,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        (setCookieOnResponseObject as {}) = jest.fn();
        chooseStages(req, res);
        expect(writeHeadMock).toBeCalledWith(302, expectedLocation);
    });

    it('should set the fare stages cookie according to the specified number of fare stages', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { fareStageInput: '6' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const mockSetCookies = jest.fn();

        (setCookieOnResponseObject as {}) = jest.fn().mockImplementation(() => {
            mockSetCookies();
        });

        chooseStages(req, res);

        expect(mockSetCookies).toBeCalledTimes(1);
    });
});

describe('isInvalidStageNumber', () => {
    it('should return an object with an error if something is incorrect', () => {
        const result: ChooseStagesInputCheck = isInvalidFareStageNumber('f');
        expect(result.error).toBeDefined();
    });

    it('should return an object with no errors if input is valid', () => {
        const result: ChooseStagesInputCheck = isInvalidFareStageNumber('8');
        expect(result.error).toBe('');
    });
});
