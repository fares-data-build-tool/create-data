import {
    MULTI_OP_TXC_SOURCE_ATTRIBUTE,
    MULTIPLE_OPERATOR_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
} from '../../../src/constants/attributes';
import { getMockRequestAndResponse } from '../../testData/mockData';
import multipleOperatorsServiceList, {
    getSelectedServicesAndNocCodeFromRequest,
} from '../../../src/pages/api/multipleOperatorsServiceList';

import * as sessions from '../../../src/utils/sessions';

describe('multipleOperatorsServiceList', () => {
    const selectAllFalseUrl = '/multipleOperatorsServiceList?selectAll=false';
    const writeHeadMock = jest.fn();
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('redirects back to /multipleOperatorsServiceList if there are errors', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            mockEndFn: jest.fn(),
            requestHeaders: {
                referer: `http://localhost:5000${selectAllFalseUrl}`,
            },
            session: {
                [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                    selectedOperators: [
                        { name: 'Test1', nocCode: 'N1' },
                        { name: 'Test2', nocCode: 'N2' },
                        { name: 'Test3', nocCode: 'N3' },
                    ],
                },
            },
        });

        multipleOperatorsServiceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: selectAllFalseUrl,
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, {
            multiOperatorInfo: [],
            errors: [{ id: 'checkbox-0', errorMessage: 'Choose at least one service from the options' }],
        });
    });

    it('should change the query string for select all to true when select all button is selected', () => {
        const selectAllTrueUrl = '/multipleOperatorsServiceList?selectAll=true';
        const { req, res } = getMockRequestAndResponse({
            body: { selectAll: 'Select All Services' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            mockEndFn: jest.fn(),
            requestHeaders: {
                referer: `http://localhost:5000${selectAllFalseUrl}`,
            },
            session: {
                [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                    selectedOperators: [
                        { name: 'Test1', nocCode: 'N1' },
                        { name: 'Test2', nocCode: 'N2' },
                        { name: 'Test3', nocCode: 'N3' },
                    ],
                },
            },
        });

        multipleOperatorsServiceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: selectAllTrueUrl,
        });
    });

    it('redirects to /multipleProducts if input is valid with no errors, and deletes TXC multiOp session attribute', () => {
        const serviceInfo = {
            'MCTR#237#dsdwgwe223#11-237-_-y08-1#07/04/2020': 'Ashton Under Lyne - Glossop',
            'MCTR#391#dsdwgwe223#NW_01_MCT_391_1#23/04/2019': 'Macclesfield - Bollington - Poynton - Stockport',
            'MCTR#232#dsdwgwe223#NW_04_MCTR_232_1#06/04/2020': 'Ashton - Hurst Cross - Broadoak Circular',
        };

        const { req, res } = getMockRequestAndResponse({
            body: { ...serviceInfo },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            mockEndFn: jest.fn(),
            requestHeaders: {
                referer: `http://localhost:5000${selectAllFalseUrl}`,
            },
            session: {
                [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                    selectedOperators: [
                        { name: 'Test1', nocCode: 'N1' },
                        { name: 'Test2', nocCode: 'N2' },
                        { name: 'Test3', nocCode: 'N3' },
                    ],
                },
                [MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE]: [
                    {
                        nocCode: 'N1',
                        services: [],
                    },
                    {
                        nocCode: 'N2',
                        services: [],
                    },
                ],
            },
        });

        multipleOperatorsServiceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/multipleProducts',
        });
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, [
            {
                nocCode: 'MCTR',
                services: [
                    {
                        lineName: '237',
                        lineId: 'dsdwgwe223',
                        serviceCode: '11-237-_-y08-1',
                        serviceDescription: 'Ashton Under Lyne - Glossop',
                        startDate: '07/04/2020',
                    },
                    {
                        lineName: '391',
                        lineId: 'dsdwgwe223',
                        serviceCode: 'NW_01_MCT_391_1',
                        serviceDescription: 'Macclesfield - Bollington - Poynton - Stockport',
                        startDate: '23/04/2019',
                    },
                    {
                        lineName: '232',
                        lineId: 'dsdwgwe223',
                        serviceCode: 'NW_04_MCTR_232_1',
                        serviceDescription: 'Ashton - Hurst Cross - Broadoak Circular',
                        startDate: '06/04/2020',
                    },
                ],
            },
            { nocCode: 'N1', services: [] },
            { nocCode: 'N2', services: [] },
        ]);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, MULTI_OP_TXC_SOURCE_ATTRIBUTE, undefined);
    });
    describe('getSelectedServicesAndNocCodeFromRequest', () => {
        it('returns an object with services and nocCode from a request', () => {
            const serviceInfo = {
                'MCTR#237#strfg323#11-237-_-y08-1#07/04/2020': 'Ashton Under Lyne - Glossop',
                'MCTR#391#strfg323#NW_01_MCT_391_1#23/04/2019': 'Macclesfield - Bollington - Poynton - Stockport',
                'MCTR#232#strfg323#NW_04_MCTR_232_1#06/04/2020': 'Ashton - Hurst Cross - Broadoak Circular',
            };
            const result = getSelectedServicesAndNocCodeFromRequest(serviceInfo);

            expect(result.nocCode).toBe('MCTR');
            expect(result.selectedServices).toStrictEqual([
                {
                    lineName: '237',
                    lineId: 'strfg323',
                    serviceCode: '11-237-_-y08-1',
                    startDate: '07/04/2020',
                    serviceDescription: 'Ashton Under Lyne - Glossop',
                },
                {
                    lineName: '391',
                    lineId: 'strfg323',
                    serviceCode: 'NW_01_MCT_391_1',
                    startDate: '23/04/2019',
                    serviceDescription: 'Macclesfield - Bollington - Poynton - Stockport',
                },
                {
                    lineName: '232',
                    lineId: 'strfg323',
                    serviceCode: 'NW_04_MCTR_232_1',
                    startDate: '06/04/2020',
                    serviceDescription: 'Ashton - Hurst Cross - Broadoak Circular',
                },
            ]);
        });
    });
});
