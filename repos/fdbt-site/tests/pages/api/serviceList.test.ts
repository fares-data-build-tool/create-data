import {
    expectedPeriodMultipleServicesTicketWithMultipleProducts,
    getMockRequestAndResponse,
    zoneStops,
} from '../../testData/mockData';
import serviceList from '../../../src/pages/api/serviceList';
import {
    FARE_TYPE_ATTRIBUTE,
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
    STOPS_EXEMPTION_ATTRIBUTE,
} from '../../../src/constants/attributes';
import * as userData from '../../../src/utils/apiUtils/userData';
import * as fileUpload from '../../../src/utils/apiUtils/fileUpload';
import * as sessions from '../../../src/utils/sessions';
import * as virusCheck from '../../../src/utils/apiUtils/virusScan';
import * as auroradb from '../../../src/data/auroradb';
import { secondTestCsv } from '../../testData/csvZoneData';

describe('serviceList', () => {
    const writeHeadMock = jest.fn();
    const s3Spy = jest.spyOn(userData, 'putUserDataInProductsBucketWithFilePath');
    s3Spy.mockImplementation(() => Promise.resolve('pathToFile'));
    const getServiceListFormDataSpy = jest.spyOn(fileUpload, 'getServiceListFormData');
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    const batchGetStopsByAtcoCodeSpy = jest.spyOn(auroradb, 'batchGetStopsByAtcoCode');

    const file = {
        'csv-upload': {
            size: 999,
            path: 'string',
            name: 'string',
            type: 'text/csv',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            toJSON(): any {
                return '';
            },
        },
    };

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('redirects back to /serviceList if there are errors', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: null,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' } },
        });

        getServiceListFormDataSpy.mockImplementation().mockResolvedValue({
            name: '',
            files: file,
            fileContents: '',
            fields: {
                exempt: 'no',
            },
        });

        await serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/serviceList',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, SERVICE_LIST_ATTRIBUTE, {
            errors: [{ errorMessage: 'Choose at least one service from the options', id: 'checkbox-0' }],
        });
    });

    it('redirects to /multipleProducts if input is valid and the user is entering details for a period ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                '237#YpQjUw#11-237-_-y08-1#07/04/2020': 'Ashton Under Lyne - Glossop',
                '391#Y2ejUw#NW_01_MCT_391_1#23/04/2019': 'Macclesfield - Bollington - Poynton - Stockport',
                '232#YfsjUw#NW_04_MCTR_232_1#06/04/2020': 'Ashton - Hurst Cross - Broadoak Circular',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' } },
        });

        getServiceListFormDataSpy.mockImplementation().mockResolvedValue({
            name: '',
            files: file,
            fileContents: '',
            fields: {
                exempt: 'no',
                '237#YpQjUw#11-237-_-y08-1#07/04/2020': 'Ashton Under Lyne - Glossop',
                '391#Y2ejUw#NW_01_MCT_391_1#23/04/2019': 'Macclesfield - Bollington - Poynton - Stockport',
                '232#YfsjUw#NW_04_MCTR_232_1#06/04/2020': 'Ashton - Hurst Cross - Broadoak Circular',
            },
        });

        await serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/multipleProducts',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, SERVICE_LIST_ATTRIBUTE, {
            selectedServices: [
                {
                    lineId: 'YpQjUw',
                    lineName: '237',
                    serviceCode: '11-237-_-y08-1',
                    serviceDescription: 'Ashton Under Lyne - Glossop',
                    startDate: '07/04/2020',
                },
                {
                    lineId: 'Y2ejUw',
                    lineName: '391',
                    serviceCode: 'NW_01_MCT_391_1',
                    serviceDescription: 'Macclesfield - Bollington - Poynton - Stockport',
                    startDate: '23/04/2019',
                },
                {
                    lineId: 'YfsjUw',
                    lineName: '232',
                    serviceCode: 'NW_04_MCTR_232_1',
                    serviceDescription: 'Ashton - Hurst Cross - Broadoak Circular',
                    startDate: '06/04/2020',
                },
            ],
        });
    });

    it('redirects to /multipleProducts if input is valid and the user is entering details for a period ticket, and there are exempt stops', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                '237#YpQjUw#11-237-_-y08-1#07/04/2020': 'Ashton Under Lyne - Glossop',
                '391#Y2ejUw#NW_01_MCT_391_1#23/04/2019': 'Macclesfield - Bollington - Poynton - Stockport',
                '232#YfsjUw#NW_04_MCTR_232_1#06/04/2020': 'Ashton - Hurst Cross - Broadoak Circular',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' } },
        });

        getServiceListFormDataSpy.mockImplementation().mockResolvedValue({
            name: '',
            files: file,
            fileContents: secondTestCsv,
            fields: {
                exempt: 'yes',
                '237#YpQjUw#11-237-_-y08-1#07/04/2020': 'Ashton Under Lyne - Glossop',
                '391#Y2ejUw#NW_01_MCT_391_1#23/04/2019': 'Macclesfield - Bollington - Poynton - Stockport',
                '232#YfsjUw#NW_04_MCTR_232_1#06/04/2020': 'Ashton - Hurst Cross - Broadoak Circular',
            },
        });

        jest.spyOn(virusCheck, 'containsViruses').mockImplementation().mockResolvedValue(false);
        batchGetStopsByAtcoCodeSpy.mockImplementation(() => Promise.resolve(zoneStops));

        await serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/multipleProducts',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, SERVICE_LIST_ATTRIBUTE, {
            selectedServices: [
                {
                    lineId: 'YpQjUw',
                    lineName: '237',
                    serviceCode: '11-237-_-y08-1',
                    serviceDescription: 'Ashton Under Lyne - Glossop',
                    startDate: '07/04/2020',
                },
                {
                    lineId: 'Y2ejUw',
                    lineName: '391',
                    serviceCode: 'NW_01_MCT_391_1',
                    serviceDescription: 'Macclesfield - Bollington - Poynton - Stockport',
                    startDate: '23/04/2019',
                },
                {
                    lineId: 'YfsjUw',
                    lineName: '232',
                    serviceCode: 'NW_04_MCTR_232_1',
                    serviceDescription: 'Ashton - Hurst Cross - Broadoak Circular',
                    startDate: '06/04/2020',
                },
            ],
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, STOPS_EXEMPTION_ATTRIBUTE, { exemptStops: zoneStops });
    });

    it('redirects to /searchOperators if input is valid and the user is entering details for a multi-operator ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                '237#YpQjUw#11-237-_-y08-1#07/04/2020': 'Ashton Under Lyne - Glossop',
                '391#Y2ejUw#NW_01_MCT_391_1#23/04/2019': 'Macclesfield - Bollington - Poynton - Stockport',
                '232#YfsjUw#NW_04_MCTR_232_1#06/04/2020': 'Ashton - Hurst Cross - Broadoak Circular',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            mockEndFn: jest.fn(),
            requestHeaders: {
                referer: 'http://localhost:5000/serviceList',
            },
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'multiOperator' } },
        });

        getServiceListFormDataSpy.mockImplementation().mockResolvedValue({
            name: '',
            files: file,
            fileContents: '',
            fields: {
                exempt: 'no',
                '237#YpQjUw#11-237-_-y08-1#07/04/2020': 'Ashton Under Lyne - Glossop',
                '391#Y2ejUw#NW_01_MCT_391_1#23/04/2019': 'Macclesfield - Bollington - Poynton - Stockport',
                '232#YfsjUw#NW_04_MCTR_232_1#06/04/2020': 'Ashton - Hurst Cross - Broadoak Circular',
            },
        });

        await serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/reuseOperatorGroup',
        });
    });

    it('redirects to /multipleProducts if input is valid and the user is entering details for a flat fare ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                '237#YpQjUw#11-237-_-y08-1#07/04/2020': 'Ashton Under Lyne - Glossop',
                '391#Y2ejUw#NW_01_MCT_391_1#23/04/2019': 'Macclesfield - Bollington - Poynton - Stockport',
                '232#YfsjUw#NW_04_MCTR_232_1#06/04/2020': 'Ashton - Hurst Cross - Broadoak Circular',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            mockEndFn: jest.fn(),
            requestHeaders: {
                referer: 'http://localhost:5000/serviceList',
            },
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'flatFare' } },
        });

        getServiceListFormDataSpy.mockImplementation().mockResolvedValue({
            name: '',
            files: file,
            fileContents: '',
            fields: {
                exempt: 'no',
                '237#YpQjUw#11-237-_-y08-1#07/04/2020': 'Ashton Under Lyne - Glossop',
                '391#Y2ejUw#NW_01_MCT_391_1#23/04/2019': 'Macclesfield - Bollington - Poynton - Stockport',
                '232#YfsjUw#NW_04_MCTR_232_1#06/04/2020': 'Ashton - Hurst Cross - Broadoak Circular',
            },
        });

        await serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/multipleProducts',
        });
    });

    it('should update the service list when in edit mode and redirect back to products/productDetails', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { '2#YpQjUw#NW_05_BLAC_2_1#05/04/2020': 'POULTON - BLACKPOOL via Victoria Hospital Outpatients' },
            uuid: {},
            session: {
                [MATCHING_JSON_ATTRIBUTE]: expectedPeriodMultipleServicesTicketWithMultipleProducts,
                [MATCHING_JSON_META_DATA_ATTRIBUTE]: {
                    productId: '2',
                    matchingJsonLink: 'test/path',
                },
            },
            mockWriteHeadFn: writeHeadMock,
        });

        getServiceListFormDataSpy.mockImplementation().mockResolvedValue({
            name: '',
            files: file,
            fileContents: '',
            fields: {
                exempt: 'no',
                '2#YpQjUw#NW_05_BLAC_2_1#05/04/2020': 'POULTON - BLACKPOOL via Victoria Hospital Outpatients',
            },
        });

        await serviceList(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/products/productDetails?productId=2',
        });
    });
});
