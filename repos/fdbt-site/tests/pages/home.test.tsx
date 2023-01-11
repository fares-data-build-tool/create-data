import * as React from 'react';
import { shallow } from 'enzyme';
import Home, { getServerSideProps } from '../../src/pages/home';
import { MULTI_MODAL_ATTRIBUTE, OPERATOR_ATTRIBUTE } from '../../src/constants/attributes';
import * as aurora from '../../src/data/auroradb';
import { OperatorAttribute } from '../../src/interfaces';
import { getMockContext } from '../testData/mockData';

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

describe('pages', () => {
    describe('home page', () => {
        const checkForServicesSpy = jest.spyOn(aurora, 'getAllServicesByNocCode');

        it('should render correctly', () => {
            const tree = shallow(<Home csrfToken="" showDeleteProductsLink={true} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly for prod environment', () => {
            const tree = shallow(<Home csrfToken="" showDeleteProductsLink={false} />);
            expect(tree).toMatchSnapshot();
        });

        it('should set the multi modal attribute when operator has no bods but tnds services', async () => {
            const operatorData: OperatorAttribute = {
                name: 'Test Op',
                nocCode: 'TEST',
            };

            checkForServicesSpy.mockResolvedValueOnce(multiModalServices);
            const ctx = getMockContext({
                cookies: {},
                body: null,
                session: {
                    [OPERATOR_ATTRIBUTE]: operatorData,
                },
            });

            await getServerSideProps(ctx);

            expect(ctx.req.session[OPERATOR_ATTRIBUTE]).toEqual(operatorData);
            expect(ctx.req.session[MULTI_MODAL_ATTRIBUTE]).toEqual({ modes: ['ferry', 'coach', 'tram'] });
        });

        it('should not set the multi modal attribute when operator has bods services', async () => {
            const services = [
                {
                    id: 11,
                    lineName: '123',
                    lineId: '3h3vb32ik',
                    startDate: '05/02/2020',
                    description: 'IW Bus Service 123',
                    serviceCode: 'NW_05_BLAC_123_1',
                    origin: 'Manchester',
                    destination: 'Leeds',
                    dataSource: 'bods',
                    mode: 'ferry',
                },
            ];
            const operatorData: OperatorAttribute = {
                name: 'Test Op',
                nocCode: 'TEST',
            };

            checkForServicesSpy.mockResolvedValueOnce(services);
            const ctx = getMockContext({
                cookies: {},
                body: null,
                session: {
                    [OPERATOR_ATTRIBUTE]: operatorData,
                },
            });

            await getServerSideProps(ctx);

            expect(ctx.req.session[OPERATOR_ATTRIBUTE]).toEqual(operatorData);
            expect(ctx.req.session[MULTI_MODAL_ATTRIBUTE]).toEqual(undefined);
        });

        it('should not set the multi modal attribute when operator has bods and tnds services', async () => {
            const services = [
                {
                    id: 11,
                    lineName: '123',
                    lineId: '3h3vb32ik',
                    startDate: '05/02/2020',
                    description: 'IW Bus Service 123',
                    serviceCode: 'NW_05_BLAC_123_1',
                    origin: 'Manchester',
                    destination: 'Leeds',
                    dataSource: 'bods',
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
            ];
            const operatorData: OperatorAttribute = {
                name: 'Test Op',
                nocCode: 'TEST',
            };

            checkForServicesSpy.mockResolvedValueOnce(services);
            const ctx = getMockContext({
                cookies: {},
                body: null,
                session: {
                    [OPERATOR_ATTRIBUTE]: operatorData,
                },
            });

            await getServerSideProps(ctx);

            expect(ctx.req.session[OPERATOR_ATTRIBUTE]).toEqual(operatorData);
            expect(ctx.req.session[MULTI_MODAL_ATTRIBUTE]).toEqual(undefined);
        });

        it('should not set the multi modal attribute when operator has no bods or no tnds services', async () => {
            const operatorData: OperatorAttribute = {
                name: 'Test Op',
                nocCode: 'TEST',
            };

            checkForServicesSpy.mockResolvedValueOnce([]);
            const ctx = getMockContext({
                cookies: {},
                body: null,
                session: {
                    [OPERATOR_ATTRIBUTE]: operatorData,
                },
            });

            await getServerSideProps(ctx);

            expect(ctx.req.session[OPERATOR_ATTRIBUTE]).toEqual(operatorData);
            expect(ctx.req.session[MULTI_MODAL_ATTRIBUTE]).toEqual(undefined);
        });
    });
});
