import operator from '../../../src/pages/api/operator';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('operator', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /faretype when session operator cookie does not exist but req has operator', () => {
        const { req, res } = getMockRequestAndResponse(
            {},
            { operator: '{"operatorName":"Connexions Buses","nocCode":"HCTY"}' },
            {},
            writeHeadMock,
        );
        operator(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/faretype',
        });
    });

    it('should return 302 redirect to /operator when session operator cookie and operator body do not exist', () => {
        const { req, res } = getMockRequestAndResponse({}, null, {}, writeHeadMock);
        operator(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/operator',
        });
    });
});
