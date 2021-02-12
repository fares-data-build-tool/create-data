import { getMockRequestAndResponse } from '../../testData/mockData';
import multipleOperatorsServiceList, {
    getSelectedServicesAndNocCodeFromRequest,
} from '../../../src/pages/api/multipleOperatorsServiceList';
import { MULTIPLE_OPERATOR_ATTRIBUTE, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE } from '../../../src/constants/attributes';
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

    it('redirects to /howManyProducts if input is valid and the user is entering details for a period ticket, and the user has completed all of their multiple operators services', () => {
        const serviceInfo = {
            'MCTR#237#11-237-_-y08-1#07/04/2020': 'Ashton Under Lyne - Glossop',
            'MCTR#391#NW_01_MCT_391_1#23/04/2019': 'Macclesfield - Bollington - Poynton - Stockport',
            'MCTR#232#NW_04_MCTR_232_1#06/04/2020': 'Ashton - Hurst Cross - Broadoak Circular',
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
                        services: ['service one', 'service two'],
                    },
                    {
                        nocCode: 'N2',
                        services: ['service one', 'service two'],
                    },
                ],
            },
        });

        multipleOperatorsServiceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/howManyProducts',
        });
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, [
            {
                nocCode: 'MCTR',
                services: [
                    '237#11-237-_-y08-1#07/04/2020#Ashton Under Lyne - Glossop',
                    '391#NW_01_MCT_391_1#23/04/2019#Macclesfield - Bollington - Poynton - Stockport',
                    '232#NW_04_MCTR_232_1#06/04/2020#Ashton - Hurst Cross - Broadoak Circular',
                ],
            },
            { nocCode: 'N1', services: ['service one', 'service two'] },
            { nocCode: 'N2', services: ['service one', 'service two'] },
        ]);
    });
    describe('getSelectedServicesAndNocCodeFromRequest', () => {
        it('returns an object with services and nocCode from a request', () => {
            const serviceInfo = {
                'MCTR#237#11-237-_-y08-1#07/04/2020': 'Ashton Under Lyne - Glossop',
                'MCTR#391#NW_01_MCT_391_1#23/04/2019': 'Macclesfield - Bollington - Poynton - Stockport',
                'MCTR#232#NW_04_MCTR_232_1#06/04/2020': 'Ashton - Hurst Cross - Broadoak Circular',
            };
            const result = getSelectedServicesAndNocCodeFromRequest(serviceInfo);

            expect(result.nocCode).toBe('MCTR');
            expect(result.selectedServices).toStrictEqual([
                '237#11-237-_-y08-1#07/04/2020#Ashton Under Lyne - Glossop',
                '391#NW_01_MCT_391_1#23/04/2019#Macclesfield - Bollington - Poynton - Stockport',
                '232#NW_04_MCTR_232_1#06/04/2020#Ashton - Hurst Cross - Broadoak Circular',
            ]);
        });
    });
});
