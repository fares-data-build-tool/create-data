import mockReqRes, { mockRequest, mockResponse } from 'mock-req-res';
import chooseStages from '../../../src/pages/api/chooseStages';

describe('chooseStages', () => {
    let res: mockReqRes.ResponseOutput;
    let writeHeadMock: jest.Mock;

    beforeEach(() => {
        jest.resetAllMocks();
        writeHeadMock = jest.fn();
        res = mockResponse({
            writeHead: writeHeadMock,
        });
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
        chooseStages(mockRequest({ body: testData }), res);
        expect(writeHeadMock).toBeCalledWith(302, expectedLocation);
    });
});
