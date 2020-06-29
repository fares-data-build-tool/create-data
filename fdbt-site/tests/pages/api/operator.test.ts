import operator from '../../../src/pages/api/operator';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('operator', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /fareType when session operator cookie does not exist but req has operator', () => {
        const { req, res } = getMockRequestAndResponse({
            body: { operator: '{"operatorName":"Connexions Buses","nocCode":"HCTY"}' },
            mockWriteHeadFn: writeHeadMock,
        });
        operator(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/fareType',
        });
    });

    it('should return 302 redirect to /operator when session operator cookie and operator body do not exist', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        operator(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/operator',
        });
    });
});
