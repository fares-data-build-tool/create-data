import { MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE } from '../../../src/constants/attributes';
import { getMockRequestAndResponse } from '../../testData/mockData';
import getMultiOperatorServiceList, {
    getMultiOperatorsDataFromRequest,
} from '../../../src/pages/api/multipleOperatorsServiceList';
import * as sessions from '../../../src/utils/sessions';

describe('getMultiOperatorsDataFromRequests tests', () => {
    it('should return operator data for one operator', () => {
        const response = getMultiOperatorsDataFromRequest({ 'BLAC#237#123#abc#12/06/2020': 'Some description' });
        expect(response).toEqual([
            {
                nocCode: 'BLAC',
                services: [
                    {
                        lineId: '123',
                        lineName: '237',
                        nocCode: 'BLAC',
                        serviceCode: 'abc',
                        serviceDescription: 'Some description',
                        startDate: '12/06/2020',
                    },
                ],
            },
        ]);
    });

    it('should return operator data for more than one operator', () => {
        const response = getMultiOperatorsDataFromRequest({
            'BLAC#237#123#abc#12/06/2020': 'Some description',
            'LNUD#145#12345#cdb#10/07/2021': 'Some description 2',
        });
        expect(response).toEqual([
            {
                nocCode: 'BLAC',
                services: [
                    {
                        lineId: '123',
                        lineName: '237',
                        nocCode: 'BLAC',
                        serviceCode: 'abc',
                        serviceDescription: 'Some description',
                        startDate: '12/06/2020',
                    },
                ],
            },
            {
                nocCode: 'LNUD',
                services: [
                    {
                        lineId: '12345',
                        lineName: '145',
                        nocCode: 'LNUD',
                        serviceCode: 'cdb',
                        serviceDescription: 'Some description 2',
                        startDate: '10/07/2021',
                    },
                ],
            },
        ]);
    });

    it('should return no data when there is no operator info', () => {
        const response = getMultiOperatorsDataFromRequest({});
        expect(response).toEqual([]);
    });
});

describe('multiOperatorServiceList tests', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    beforeEach(() => {
        jest.resetAllMocks();
    });
    const selectAllFalseUrl = '/multipleOperatorsServiceList?selectAll=false';
    const writeHeadMock = jest.fn();
    const errorId = 'checkbox-0';

    it('should redirect and produce error when response body is empty', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            mockEndFn: jest.fn(),
            requestHeaders: {
                referer: `http://localhost:5000${selectAllFalseUrl}`,
            },
            session: {},
        });
        getMultiOperatorServiceList(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, {
            multiOperatorInfo: [],
            errors: [{ id: errorId, errorMessage: 'Choose at least one service from the options' }],
        });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/multipleOperatorsServiceList',
        });
    });

    it('should redirect and produce error when operator count does not match number of multi operator data', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                operatorCount: 1,
                confirm: true,
                'BLAC#237#123#abc#12/06/2020': 'Some description',
                'LNUD#145#12345#cdb#10/07/2021': 'Some description 2',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            mockEndFn: jest.fn(),
            requestHeaders: {
                referer: `http://localhost:5000${selectAllFalseUrl}`,
            },
            session: {},
        });
        getMultiOperatorServiceList(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, {
            multiOperatorInfo: [
                {
                    nocCode: 'BLAC',
                    services: [
                        {
                            lineId: '123',
                            lineName: '237',
                            nocCode: 'BLAC',
                            serviceCode: 'abc',
                            serviceDescription: 'Some description',
                            startDate: '12/06/2020',
                        },
                    ],
                },
                {
                    nocCode: 'LNUD',
                    services: [
                        {
                            lineId: '12345',
                            lineName: '145',
                            nocCode: 'LNUD',
                            serviceCode: 'cdb',
                            serviceDescription: 'Some description 2',
                            startDate: '10/07/2021',
                        },
                    ],
                },
            ],
            errors: [
                {
                    id: errorId,
                    errorMessage: 'All operators need to have at least one service',
                },
            ],
        });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/multipleOperatorsServiceList',
        });
    });

    it('should redirect to multi products page', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                operatorCount: 2,
                confirm: true,
                'BLAC#237#123#abc#12/06/2020': 'Some description',
                'LNUD#145#12345#cdb#10/07/2021': 'Some description 2',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            mockEndFn: jest.fn(),
            requestHeaders: {
                referer: `http://localhost:5000${selectAllFalseUrl}`,
            },
            session: {},
        });
        getMultiOperatorServiceList(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, [
            {
                nocCode: 'BLAC',
                services: [
                    {
                        lineId: '123',
                        lineName: '237',
                        nocCode: 'BLAC',
                        serviceCode: 'abc',
                        serviceDescription: 'Some description',
                        startDate: '12/06/2020',
                    },
                ],
            },
            {
                nocCode: 'LNUD',
                services: [
                    {
                        lineId: '12345',
                        lineName: '145',
                        nocCode: 'LNUD',
                        serviceCode: 'cdb',
                        serviceDescription: 'Some description 2',
                        startDate: '10/07/2021',
                    },
                ],
            },
        ]);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/multipleProducts',
        });
    });
});
