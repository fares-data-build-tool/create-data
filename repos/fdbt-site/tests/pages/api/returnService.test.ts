import returnService from '../../../src/pages/api/returnService';
import { getMockRequestAndResponse, mockRawService } from '../../testData/mockData';
import * as auroradb from '../../../src/data/auroradb';
import { RETURN_SERVICE_ATTRIBUTE, TXC_SOURCE_ATTRIBUTE } from '../../../src/constants/attributes';
import * as sessions from '../../../src/utils/sessions';

beforeEach(() => {
    jest.resetAllMocks();

    jest.spyOn(auroradb, 'getServiceByIdAndDataSource').mockResolvedValue(mockRawService);
});

describe('returnService', () => {
    const updateAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

    it('should return 302 redirect to /returnService when there is no body in the request', async () => {
        const writeHeadMock = jest.fn();
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {},
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        const expectedReturnService = {
            errors: [{ errorMessage: 'Choose a service from the options', id: 'returnService' }],
        };
        await returnService(req, res);
        expect(updateAttributeSpy).toHaveBeenCalledWith(req, RETURN_SERVICE_ATTRIBUTE, expectedReturnService);
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
        const expectedReturnService = {
            lineId: 'q2gv2ve',
            lineName: '17',
            nocCode: '',
            operatorShortName: '',
            serviceDescription: '\n\t\t\t\tInterchange Stand B,Seaham - Estate (Hail and Ride) N/B,Westlea\n\t\t\t',
            id: 123,
        };
        await returnService(req, res);
        expect(updateAttributeSpy).toHaveBeenCalledWith(req, RETURN_SERVICE_ATTRIBUTE, expectedReturnService);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/direction',
        });
    });
});
