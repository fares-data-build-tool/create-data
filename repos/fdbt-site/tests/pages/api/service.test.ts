import service from '../../../src/pages/api/service';
import { getMockRequestAndResponse, mockRawService } from '../../testData/mockData';
import { TXC_SOURCE_ATTRIBUTE } from '../../../src/constants/attributes';
import * as auroradb from '../../../src/data/auroradb';
import * as featureFlag from '../../../src/constants/featureFlag';

beforeEach(() => {
    jest.resetAllMocks();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    featureFlag.masterStopListEnabled = true;

    jest.spyOn(auroradb, 'getServiceByIdAndDataSource').mockResolvedValue(mockRawService);
});

describe('service', () => {
    it('should return 302 redirect to /service when there is no body in the request', async () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {},
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await service(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/service',
        });
    });

    it('should return 302 redirect to /direction when there is a bods service selected', async () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({
            body: { serviceId: '123' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {
                [TXC_SOURCE_ATTRIBUTE]: { source: 'bods', hasTnds: true, hasBods: true },
            },
        });
        await service(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/direction',
        });
    });

    it('should return 302 redirect to /singleDirection when there is a tnds service selected', async () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({
            body: { serviceId: '123' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {
                [TXC_SOURCE_ATTRIBUTE]: { source: 'tnds', hasTnds: true, hasBods: true },
            },
        });
        await service(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/singleDirection',
        });
    });
});
