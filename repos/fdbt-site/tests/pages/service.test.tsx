import * as React from 'react';
import { shallow } from 'enzyme';
import Service, { getServerSideProps } from '../../src/pages/service';
import { getServicesByNocCode } from '../../src/data/auroradb';
import { getMockContext } from '../testData/mockData';
import { PASSENGER_TYPE_ATTRIBUTE } from '../../src/constants';
import { ServiceType } from '../../src/interfaces';

jest.mock('../../src/data/auroradb');

const mockServices: ServiceType[] = [
    {
        lineName: '123',
        startDate: '05/02/2020',
        description: 'this bus service is 123',
        serviceCode: 'NW_05_BLAC_123_1',
    },
    { lineName: 'X1', startDate: '06/02/2020', description: 'this bus service is X1', serviceCode: 'NW_05_BLAC_X1_1' },
    {
        lineName: 'Infinity Line',
        startDate: '07/02/2020',
        description: 'this bus service is Infinity Line',
        serviceCode: 'WY_13_IWBT_07_1',
    },
];

describe('pages', () => {
    describe('service', () => {
        beforeEach(() => {
            (getServicesByNocCode as jest.Mock).mockImplementation(() => mockServices);
        });

        it('should render correctly', () => {
            const tree = shallow(
                <Service
                    operator="Connexions Buses"
                    passengerType="Adult"
                    services={mockServices}
                    error={[]}
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
                    csrfToken=""
                />,
            );
            const operatorWelcome = wrapper.find('#service-operator-passenger-type-hint').first();

            expect(operatorWelcome.text()).toBe('Connexions Buses - Adult');
        });

        it('shows a list of services for the operator in the select box', () => {
            const wrapper = shallow(
                <Service
                    operator="Connexions Buses"
                    passengerType="Adult"
                    services={mockServices}
                    error={[]}
                    csrfToken=""
                />,
            );
            const operatorServices = wrapper.find('.service-option');

            expect(operatorServices).toHaveLength(3);
            expect(operatorServices.first().text()).toBe('123 - Start date 05/02/2020');
            expect(operatorServices.at(1).text()).toBe('X1 - Start date 06/02/2020');
            expect(operatorServices.at(2).text()).toBe('Infinity Line - Start date 07/02/2020');
        });

        it('returns operator value and list of services when operator cookie exists with NOCCode', async () => {
            const ctx = getMockContext();
            const result = await getServerSideProps(ctx);
            expect(result).toEqual({
                props: {
                    error: [],
                    operator: 'test',
                    passengerType: 'Adult',
                    services: [
                        {
                            lineName: '123',
                            startDate: '05/02/2020',
                            description: 'this bus service is 123',
                            serviceCode: 'NW_05_BLAC_123_1',
                        },
                        {
                            lineName: 'X1',
                            startDate: '06/02/2020',
                            description: 'this bus service is X1',
                            serviceCode: 'NW_05_BLAC_X1_1',
                        },
                        {
                            lineName: 'Infinity Line',
                            startDate: '07/02/2020',
                            description: 'this bus service is Infinity Line',
                            serviceCode: 'WY_13_IWBT_07_1',
                        },
                    ],
                    csrfToken: '',
                },
            });
        });

        it('throws error if no services can be found', async () => {
            (getServicesByNocCode as jest.Mock).mockImplementation(() => []);

            const mockWriteHeadFn = jest.fn();
            const mockEndFn = jest.fn();

            const ctx = getMockContext({
                body: null,
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
                cookies: { operator: null },
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
                'Could not render the service selection page. Necessary cookies not found.',
            );
        });
    });
});
