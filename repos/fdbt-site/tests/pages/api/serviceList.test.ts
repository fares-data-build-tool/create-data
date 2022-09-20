import {
    expectedPeriodMultipleServicesTicketWithMultipleProducts,
    getMockRequestAndResponse,
} from '../../testData/mockData';
import serviceList from '../../../src/pages/api/serviceList';
import {
    FARE_TYPE_ATTRIBUTE,
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
} from '../../../src/constants/attributes';
import * as userData from '../../../src/utils/apiUtils/userData';

describe('serviceList', () => {
    const selectAllFalseUrl = '/serviceList?selectAll=false';
    const writeHeadMock = jest.fn();
    const s3Spy = jest.spyOn(userData, 'putUserDataInProductsBucketWithFilePath');
    s3Spy.mockImplementation(() => Promise.resolve('pathToFile'));

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('redirects back to /serviceList if there are errors', async () => {
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

        await serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: selectAllFalseUrl,
        });
    });

    it('should change the query string for select all to true when select all button is selected', async () => {
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

        await serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: selectAllTrueUrl,
        });
    });

    it('redirects to /multipleProducts if input is valid and the user is entering details for a period ticket', async () => {
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

        await serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/multipleProducts',
        });
    });

    it('redirects to /searchOperators if input is valid and the user is entering details for a multi-operator ticket', async () => {
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

        await serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/reuseOperatorGroup',
        });
    });

    it('redirects to /multipleProducts if input is valid and the user is entering details for a flat fare ticket', async () => {
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

        await serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/multipleProducts',
        });
    });

    it.only('should update the service list when in edit mode and redirect back to products/productDetails', async () => {
        const serviceInfo = {
            '2#YpQjUw#NW_05_BLAC_2_1#05/04/2020': 'POULTON - BLACKPOOL via Victoria Hospital Outpatients',
        };

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { ...serviceInfo },
            uuid: {},
            session: {
                [MATCHING_JSON_ATTRIBUTE]: expectedPeriodMultipleServicesTicketWithMultipleProducts,
                [MATCHING_JSON_META_DATA_ATTRIBUTE]: {
                    productId: '2',
                    serviceId: '22D',
                    matchingJsonLink: 'test/path',
                },
            },
            mockWriteHeadFn: writeHeadMock,
        });
        await serviceList(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/products/productDetails?productId=2&serviceId=22D',
        });
    });
});
