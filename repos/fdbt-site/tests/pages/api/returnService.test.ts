import returnService from '../../../src/pages/api/returnService';
import {
    expectedReturnTicketWithAdditionalService,
    getMockRequestAndResponse,
    mockRawService,
} from '../../testData/mockData';
import * as auroradb from '../../../src/data/auroradb';
import {
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
} from '../../../src/constants/attributes';
import * as userData from '../../../src/utils/apiUtils/userData';

beforeEach(() => {
    jest.resetAllMocks();

    jest.spyOn(auroradb, 'getServiceByIdAndDataSource').mockResolvedValue(mockRawService);
    const s3Spy = jest.spyOn(userData, 'putUserDataInProductsBucketWithFilePath');
    s3Spy.mockImplementation(() => Promise.resolve('pathToFile'));
});

describe('returnService', () => {
    it('should return 302 redirect to /returnService when there is no body in the request', async () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            query: {},
            body: {
                selectedServiceId: 1,
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await returnService(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/returnService?selectedServiceId=1',
        });
    });

    it('should return 302 redirect to /direction', async () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({
            body: { selectedServiceId: 1, serviceId: 4 },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {
                [TXC_SOURCE_ATTRIBUTE]: { source: 'bods', hasTnds: true, hasBods: true },
                [MATCHING_JSON_ATTRIBUTE]: expectedReturnTicketWithAdditionalService,
                [MATCHING_JSON_META_DATA_ATTRIBUTE]: {
                    productId: '1',
                    serviceId: '2',
                    matchingJsonLink: 'matchingJsonLink',
                },
            },
        });
        await returnService(req, res);

        expect(userData.putUserDataInProductsBucketWithFilePath).toBeCalledWith(
            {
                ...expectedReturnTicketWithAdditionalService,
                additionalServices: [
                    {
                        id: 4,
                        lineId: 'q2gv2ve',
                        lineName: '17',
                        serviceDescription:
                            '\n\t\t\t\tInterchange Stand B,Seaham - Estate (Hail and Ride) N/B,Westlea\n\t\t\t',
                    },
                ],
            },
            'matchingJsonLink',
        );
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/products/productDetails?productId=1&serviceId=2',
        });
    });
});
