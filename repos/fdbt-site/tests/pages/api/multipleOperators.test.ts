import { getMockRequestAndResponse } from '../../testData/mockData';
import multipleOperators from '../../../src/pages/api/multipleOperators';
import * as sessions from '../../../src/utils/sessions';
import { MULTI_MODAL_ATTRIBUTE, OPERATOR_ATTRIBUTE } from '../../../src/constants/attributes';
import * as aurora from '../../../src/data/auroradb';

const multiModalServices = [
    {
        id: 11,
        lineName: '123',
        lineId: '3h3vb32ik',
        startDate: '05/02/2020',
        description: 'IW Bus Service 123',
        serviceCode: 'NW_05_BLAC_123_1',
        origin: 'Manchester',
        destination: 'Leeds',
        dataSource: 'tnds',
        mode: 'ferry',
    },
    {
        id: 12,
        lineName: 'X1',
        lineId: '3h3vb32ik',
        startDate: '06/02/2020',
        description: 'Big Blue Bus Service X1',
        serviceCode: 'NW_05_BLAC_X1_1',
        origin: 'Bolton',
        destination: 'Wigan',
        dataSource: 'tnds',
        mode: 'coach',
    },
    {
        id: 13,
        lineName: 'Infinity Line',
        lineId: '3h3vb32ik',
        startDate: '07/02/2020',
        description: 'This is some kind of bus service',
        serviceCode: 'WY_13_IWBT_07_1',
        origin: 'Manchester',
        destination: 'York',
        dataSource: 'tnds',
        mode: 'tram',
    },
];

describe('multipleOperators', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    const checkForServicesSpy = jest.spyOn(aurora, 'getAllServicesByNocCode');
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /fareType when an operator is provided, and sets operator attribute', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { operator: 'Infinity Line|TEST' },
            uuid: {},
        });

        checkForServicesSpy.mockResolvedValueOnce([]);
        await multipleOperators(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, OPERATOR_ATTRIBUTE, {
            name: 'Infinity Line',
            nocCode: 'TEST',
        });
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/home',
        });
    });

    it('should return 302 redirect to /fareType when an operator is provided, and sets operator attribute, multi modal attribute', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { operator: 'Infinity Line|TEST' },
            uuid: {},
        });

        checkForServicesSpy.mockResolvedValueOnce(multiModalServices);
        await multipleOperators(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, OPERATOR_ATTRIBUTE, {
            name: 'Infinity Line',
            nocCode: 'TEST',
        });
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, MULTI_MODAL_ATTRIBUTE, {
            modes: ['ferry', 'coach', 'tram'],
        });

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/home',
        });
    });

    it('should return 302 redirect to /multipleOperators when operator not provided', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
        });

        await multipleOperators(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, OPERATOR_ATTRIBUTE, {
            errors: [
                {
                    id: 'operators',
                    errorMessage: 'Choose an operator name and NOC from the options',
                },
            ],
        });
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/multipleOperators',
        });
    });
});
