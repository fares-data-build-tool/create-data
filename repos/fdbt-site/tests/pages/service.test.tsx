import * as React from 'react';
import { shallow } from 'enzyme';
import Service, { getServerSideProps } from '../../src/pages/service';
import { getFaresServicesByNocCodeAndDataSource } from '../../src/data/auroradb';
import { getMockContext } from '../testData/mockData';
import {
    MULTI_MODAL_ATTRIBUTE,
    OPERATOR_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
} from '../../src/constants/attributes';
import { MyFaresService } from '../../src/interfaces';

jest.mock('../../src/data/auroradb');

const mockServices: MyFaresService[] = [
    {
        id: '11',
        lineName: '123',
        lineId: '3h3vb32ik',
        startDate: '05/02/2020',
        origin: 'Manchester',
        destination: 'Leeds',
        endDate: '25/02/2021',
    },
    {
        id: '12',
        lineName: 'X1',
        lineId: '3h3vb32ik',
        startDate: '06/02/2020',
        origin: 'Edinburgh',
        destination: 'Leeds',
        endDate: '25/02/2021',
    },
    {
        id: '13',
        lineName: 'Infinity Line',
        lineId: '3h3vb32ik',
        startDate: '07/02/2020',
        origin: 'Walsall',
        destination: 'London',
        endDate: '25/02/2021',
    },
];

describe('pages', () => {
    describe('service', () => {
        beforeEach(() => {
            (getFaresServicesByNocCodeAndDataSource as jest.Mock).mockImplementation(() => mockServices);
        });
        /*
         it('should render correctly when data source is tnds', () => {
             const tree = shallow(
                 <Service
                     operator="Connexions Buses"
                     passengerType="Adult"
                     services={mockServices}
                     error={[]}
                     dataSourceAttribute={{
                         source: 'tnds',
                         hasTnds: true,
                         hasBods: false,
                     }}
                     csrfToken=""
                 />,
             );
             expect(tree).toMatchSnapshot();
         });
         */

        it('should render correctly when data source is bods', () => {
            const tree = shallow(
                <Service
                    operator="Connexions Buses"
                    passengerType="Adult"
                    services={mockServices}
                    error={[]}
                    dataSourceAttribute={{
                        source: 'bods',
                        hasTnds: false,
                        hasBods: true,
                    }}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('shows operator name above the select box', () => {
            const wrapper = shallow(
                <Service
                    operator="Connexions Buses"
                    passengerType="Adult"
                    services={mockServices}
                    error={[]}
                    dataSourceAttribute={{
                        source: 'tnds',
                        hasTnds: true,
                        hasBods: false,
                    }}
                    csrfToken=""
                />,
            );
            const operatorWelcome = wrapper.find('#service-operator-passenger-type-hint').first();

            expect(operatorWelcome.text()).toBe('Connexions Buses - Adult');
        });

        it('shows a list of services for the operator in the select box with tnds data source', () => {
            const wrapper = shallow(
                <Service
                    operator="Connexions Buses"
                    passengerType="Adult"
                    services={mockServices}
                    error={[]}
                    dataSourceAttribute={{
                        source: 'tnds',
                        hasTnds: true,
                        hasBods: false,
                    }}
                    csrfToken=""
                />,
            );
            const operatorServices = wrapper.find('.service-option');

            expect(operatorServices).toHaveLength(3);
            expect(operatorServices.first().text()).toBe('123 - Start date 05/02/2020');
            expect(operatorServices.at(1).text()).toBe('X1 - Start date 06/02/2020');
            expect(operatorServices.at(2).text()).toBe('Infinity Line - Start date 07/02/2020');
        });

        it('shows a list of services for the operator in the select box with bods data source', () => {
            const wrapper = shallow(
                <Service
                    operator="Connexions Buses"
                    passengerType="Adult"
                    services={mockServices}
                    error={[]}
                    dataSourceAttribute={{
                        source: 'bods',
                        hasTnds: false,
                        hasBods: true,
                    }}
                    csrfToken=""
                />,
            );
            const operatorServices = wrapper.find('.service-option');

            expect(operatorServices).toHaveLength(3);
            expect(operatorServices.first().text()).toBe('123 Manchester - Leeds (Start date 05/02/2020)');
            expect(operatorServices.at(1).text()).toBe('X1 Edinburgh - Leeds (Start date 06/02/2020)');
            expect(operatorServices.at(2).text()).toBe('Infinity Line Walsall - London (Start date 07/02/2020)');
        });

        it('returns operator value and list of services for the multi modal operator if multi modal attribute is present in session', async () => {
            const ctx = getMockContext({
                session: {
                    [TXC_SOURCE_ATTRIBUTE]: {
                        source: 'tnds',
                        hasBods: false,
                        hasTnds: true,
                    },
                    [MULTI_MODAL_ATTRIBUTE]: {
                        modes: ['tram', 'bus', 'coach'],
                    },
                },
            });
            const result = await getServerSideProps(ctx);

            expect(result).toEqual({
                props: {
                    error: [],
                    operator: 'test',
                    passengerType: 'Adult',
                    services: [
                        {
                            id: '11',
                            lineName: '123',
                            lineId: '3h3vb32ik',
                            startDate: '05/02/2020',
                            origin: 'Manchester',
                            destination: 'Leeds',
                            endDate: '25/02/2021',
                        },
                        {
                            id: '12',
                            lineName: 'X1',
                            lineId: '3h3vb32ik',
                            startDate: '06/02/2020',
                            destination: 'Leeds',
                            origin: 'Edinburgh',
                            endDate: '25/02/2021',
                        },
                        {
                            id: '13',
                            lineName: 'Infinity Line',
                            lineId: '3h3vb32ik',
                            startDate: '07/02/2020',
                            destination: 'London',
                            origin: 'Walsall',

                            endDate: '25/02/2021',
                        },
                    ],
                    dataSourceAttribute: {
                        source: 'tnds',
                        hasBods: false,
                        hasTnds: true,
                    },
                    csrfToken: '',
                },
            });
        });

        it('returns operator value and list of services when operator attribute exists with NOCCode', async () => {
            const ctx = getMockContext({
                session: {
                    [TXC_SOURCE_ATTRIBUTE]: {
                        source: 'bods',
                        hasBods: true,
                        hasTnds: true,
                    },
                },
            });
            const result = await getServerSideProps(ctx);
            expect(result).toEqual({
                props: {
                    error: [],
                    operator: 'test',
                    passengerType: 'Adult',
                    services: [
                        {
                            id: '11',
                            lineName: '123',
                            lineId: '3h3vb32ik',
                            startDate: '05/02/2020',
                            origin: 'Manchester',
                            destination: 'Leeds',
                            endDate: '25/02/2021',
                        },
                        {
                            id: '12',
                            lineName: 'X1',
                            lineId: '3h3vb32ik',
                            startDate: '06/02/2020',
                            origin: 'Edinburgh',
                            destination: 'Leeds',
                            endDate: '25/02/2021',
                        },
                        {
                            id: '13',
                            lineName: 'Infinity Line',
                            lineId: '3h3vb32ik',
                            startDate: '07/02/2020',
                            origin: 'Walsall',
                            destination: 'London',
                            endDate: '25/02/2021',
                        },
                    ],
                    dataSourceAttribute: {
                        source: 'bods',
                        hasBods: true,
                        hasTnds: true,
                    },
                    csrfToken: '',
                },
            });
        });

        it('throws error if no services can be found', async () => {
            (getFaresServicesByNocCodeAndDataSource as jest.Mock).mockImplementation(() => []);
            const mockWriteHeadFn = jest.fn();
            const mockEndFn = jest.fn();

            const ctx = getMockContext({
                body: null,
                session: {
                    [TXC_SOURCE_ATTRIBUTE]: {
                        source: 'bods',
                        hasBods: true,
                        hasTnds: true,
                    },
                },
                uuid: {},
                mockWriteHeadFn,
                mockEndFn,
            });

            await getServerSideProps(ctx);

            expect(ctx.res?.writeHead).toBeCalledWith(302, { Location: '/noServices' });
        });

        it('throws error if noc invalid', async () => {
            const mockWriteHeadFn = jest.fn();
            const mockEndFn = jest.fn();

            const ctx = getMockContext({
                session: {
                    [OPERATOR_ATTRIBUTE]: undefined,
                    [TXC_SOURCE_ATTRIBUTE]: {
                        source: 'bods',
                        hasBods: true,
                        hasTnds: true,
                    },
                },
                body: null,
                uuid: {},
                mockWriteHeadFn,
                mockEndFn,
            });

            await expect(getServerSideProps(ctx)).rejects.toThrow('invalid NOC set');
        });

        it('throws error if passengerType session does not exist', async () => {
            const mockWriteHeadFn = jest.fn();
            const mockEndFn = jest.fn();

            const ctx = getMockContext({
                body: null,
                uuid: {},
                mockWriteHeadFn,
                mockEndFn,
                session: {
                    [PASSENGER_TYPE_ATTRIBUTE]: undefined,
                },
            });

            await expect(getServerSideProps(ctx)).rejects.toThrow(
                'Could not render the service selection page. Necessary attributes not found.',
            );
        });
    });
});
