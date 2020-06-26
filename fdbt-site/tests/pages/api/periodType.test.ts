import periodType from '../../../src/pages/api/periodType';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('periodType', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /periodType when no input method is selected', () => {
        const { req, res } = getMockRequestAndResponse({ body: null, mockWriteHeadFn: writeHeadMock });
        periodType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/periodType',
        });
    });

    it('should return 302 redirect to /error when the session is invalid', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { operator: null },
            body: {},
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        periodType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should return 302 redirect to /csvZoneUpload when the user selects a geo zone', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { periodType: 'periodGeoZone' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        periodType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/csvZoneUpload',
        });
    });

    it('should return 302 redirect to /serviceList (with selectAll=false) when the user selects the service selection option', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { periodType: 'periodMultipleServices' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        periodType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/serviceList?selectAll=false',
        });
    });
});
