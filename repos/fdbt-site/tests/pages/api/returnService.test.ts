import returnService from '../../../src/pages/api/returnService';
import { getMockRequestAndResponse, mockRawService } from '../../testData/mockData';
import * as auroradb from '../../../src/data/auroradb';
import { TXC_SOURCE_ATTRIBUTE } from '../../../src/constants/attributes';

beforeEach(() => {
    jest.resetAllMocks();

    jest.spyOn(auroradb, 'getServiceByIdAndDataSource').mockResolvedValue(mockRawService);
});

describe('returnService', () => {
    it('should return 302 redirect to /returnService when there is no body in the request', async () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {},
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await returnService(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/returnService',
        });
    });

    it('should return 302 redirect to /direction', async () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({
            body: { serviceId: '123' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {
                [TXC_SOURCE_ATTRIBUTE]: { source: 'bods', hasTnds: true, hasBods: true },
            },
        });
        await returnService(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/direction',
        });
    });
});
