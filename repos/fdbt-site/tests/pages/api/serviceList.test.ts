import { getMockRequestAndResponse } from '../../testData/mockData';
import serviceList from '../../../src/pages/api/serviceList';
import { FARE_TYPE_ATTRIBUTE } from '../../../src/constants/attributes';

describe('serviceList', () => {
    const selectAllFalseUrl = '/serviceList?selectAll=false';
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('redirects back to /serviceList if there are errors', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            mockEndFn: jest.fn(),
            requestHeaders: {
                referer: `http://localhost:5000${selectAllFalseUrl}`,
            },
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' } },
        });

        serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: selectAllFalseUrl,
        });
    });

    it('should change the query string for select all to true when select all button is selected', () => {
        const selectAllTrueUrl = '/serviceList?selectAll=true';
        const { req, res } = getMockRequestAndResponse({
            body: { selectAll: 'Select All Services' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            mockEndFn: jest.fn(),
            requestHeaders: {
                referer: `http://localhost:5000${selectAllFalseUrl}`,
            },
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' } },
        });

        serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: selectAllTrueUrl,
        });
    });

    it('redirects to /howManyProducts if input is valid and the user is entering details for a period ticket', () => {
        const serviceInfo = {
            '237#11-237-_-y08-1#07/04/2020': 'Ashton Under Lyne - Glossop',
            '391#NW_01_MCT_391_1#23/04/2019': 'Macclesfield - Bollington - Poynton - Stockport',
            '232#NW_04_MCTR_232_1#06/04/2020': 'Ashton - Hurst Cross - Broadoak Circular',
        };

        const { req, res } = getMockRequestAndResponse({
            body: { ...serviceInfo },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            mockEndFn: jest.fn(),
            requestHeaders: {
                referer: `http://localhost:5000${selectAllFalseUrl}`,
            },
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' } },
        });

        serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/howManyProducts',
        });
    });

    it('redirects to /searchOperators if input is valid and the user is entering details for a multi-operator ticket', () => {
        const serviceInfo = {
            '64': 'Leeds-Bradford#12/02/12',
            '45': 'gggggg#02/03/91',
            '47': 'hhhhhh#23/04/20',
        };

        const { req, res } = getMockRequestAndResponse({
            body: { ...serviceInfo },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            mockEndFn: jest.fn(),
            requestHeaders: {
                referer: `http://localhost:5000${selectAllFalseUrl}`,
            },
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'multiOperator' } },
        });

        serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/reuseOperatorGroup',
        });
    });

    it('redirects to /productDetails if input is valid and the user is entering details for a flat fare ticket', () => {
        const serviceInfo = {
            '64': 'Leeds-Bradford#12/02/12',
            '45': 'gggggg#02/03/91',
            '47': 'hhhhhh#23/04/20',
        };

        const { req, res } = getMockRequestAndResponse({
            body: { ...serviceInfo },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            mockEndFn: jest.fn(),
            requestHeaders: {
                referer: `http://localhost:5000${selectAllFalseUrl}`,
            },
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'flatFare' } },
        });

        serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/productDetails',
        });
    });
});
