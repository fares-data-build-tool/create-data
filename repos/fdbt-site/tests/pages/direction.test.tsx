import * as React from 'react';
import { shallow } from 'enzyme';

import Direction from '../../src/pages/direction';
import { getServiceByNocCodeAndLineName, getNaptanInfoByAtcoCode } from '../../src/data/dynamodb';
import { serviceData, mockServiceInfo, serviceDataWithDuplicates, getMockContext } from '../testData/mockData';

jest.mock('../../src/data/dynamodb');

describe('pages', () => {
    describe('direction', () => {
        beforeEach(() => {
            (({ ...getServiceByNocCodeAndLineName } as jest.Mock).mockImplementation(() => serviceData));
            (({ ...getNaptanInfoByAtcoCode } as jest.Mock).mockImplementation(() => ({})));
        });

        it('should render correctly', () => {
            const tree = shallow(
                <Direction Operator="Connexions Buses" lineName="X6A" serviceInfo={mockServiceInfo} />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('shows operator name above the select box', () => {
            const wrapper = shallow(
                <Direction Operator="Connexions Buses" lineName="X6A" serviceInfo={mockServiceInfo} />,
            );
            const journeyWelcome = wrapper.find('#direction-operator-linename-hint').first();

            expect(journeyWelcome.text()).toBe('Connexions Buses - X6A');
        });

        it('shows a list of journey patterns for the service in the select box', () => {
            const wrapper = shallow(
                <Direction Operator="Connexions Buses" lineName="X6A" serviceInfo={mockServiceInfo} />,
            );
            const serviceJourney = wrapper.find('.journey-option');

            expect(serviceJourney).toHaveLength(2);
            expect(serviceJourney.first().text()).toBe('Estate (Hail and Ride) N/B TO Interchange Stand B');
            expect(serviceJourney.at(1).text()).toBe('Interchange Stand B TO Estate (Hail and Ride) N/B');
        });

        it('returns operator value and list of services when operator cookie exists with NOCCode', async () => {
            (({ ...getServiceByNocCodeAndLineName } as jest.Mock).mockImplementation(() => serviceData));
            const operator = 'HCTY';
            const lineName = 'X6A';

            const ctx = getMockContext({ operator, serviceLineName: lineName });

            const result = await Direction.getInitialProps(ctx);

            expect(result).toEqual({
                Operator: operator,
                lineName,
                serviceInfo: mockServiceInfo,
            });
        });

        it('removes journeys that have the same start and end points before rendering', async () => {
            (({ ...getServiceByNocCodeAndLineName } as jest.Mock).mockImplementation(() => serviceDataWithDuplicates));
            const operator = 'HCTY';
            const lineName = 'X6A';

            const ctx = getMockContext({ operator, serviceLineName: lineName });

            const result = await Direction.getInitialProps(ctx);

            expect(result).toEqual({
                Operator: operator,
                lineName,
                serviceInfo: mockServiceInfo,
            });
        });

        it('throws an error if no journey patterns can be found', async () => {
            (({ ...getServiceByNocCodeAndLineName } as jest.Mock).mockImplementation(() => Promise.resolve(null)));

            const ctx = getMockContext();

            await expect(Direction.getInitialProps(ctx)).rejects.toThrow();
        });

        it('throws an error if the operator or service cookies do not exist', async () => {
            const ctx = getMockContext({ operator: null, serviceLineName: null });

            await expect(Direction.getInitialProps(ctx)).rejects.toThrow(
                'Necessary cookies not found to show direction page',
            );
        });
    });
});
