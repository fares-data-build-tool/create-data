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
                        selected: false,
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
                        selected: false,
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
                        selected: false,
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
    const writeHeadMock = jest.fn();
    const errorId = 'service-to-add-1';

    it('should redirect and produce error when operator count does not match number of multi operator data', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                operatorCount: 1,
                'BLAC#237#123#abc#12/06/2020': 'Some description',
                'LNUD#145#12345#cdb#10/07/2021': 'Some description 2',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            mockEndFn: jest.fn(),
            session: {},
        });
        await getMultiOperatorServiceList(req, res);
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
                            selected: false,
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
                            selected: false,
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

    it('should redirect to multi products page', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                operatorCount: 2,
                'BLAC#237#123#abc#12/06/2020': 'Some description',
                'LNUD#145#12345#cdb#10/07/2021': 'Some description 2',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            mockEndFn: jest.fn(),
            session: {},
        });
        await getMultiOperatorServiceList(req, res);
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
                        selected: false,
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
                        selected: false,
                    },
                ],
            },
        ]);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/multipleProducts',
        });
    });
});
