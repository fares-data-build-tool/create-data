import ticketRepresentation from '../../../src/pages/api/ticketRepresentation';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('ticketRepresentation', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /ticketRepresentation when no input method is selected', () => {
        const { req, res } = getMockRequestAndResponse({ body: null, mockWriteHeadFn: writeHeadMock });
        ticketRepresentation(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/ticketRepresentation',
        });
    });

    it('should return 302 redirect to /csvZoneUpload when the user selects a geo zone', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { ticketType: 'geoZone' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        ticketRepresentation(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/csvZoneUpload',
        });
    });

    it('should return 302 redirect to /csvZoneUpload when the user selects hybrid', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { ticketType: 'hybrid' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        ticketRepresentation(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/csvZoneUpload',
        });
    });

    it('should return 302 redirect to /serviceList (with selectAll=false) when the user selects the service selection option', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { ticketType: 'multipleServices' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        ticketRepresentation(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/serviceList?selectAll=false',
        });
    });

    it('should return 302 redirect to /service when the user selects the pointToPointPeriod option', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { ticketType: 'pointToPointPeriod' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        ticketRepresentation(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/service',
        });
    });
});
