import * as React from 'react';
import { mount, shallow } from 'enzyme';

import SingleDirection, { getServerSideProps } from '../../src/pages/singleDirection';
import { getServiceByNocCodeAndLineName, batchGetStopsByAtcoCode } from '../../src/data/auroradb';
import { mockRawService, mockService, mockRawServiceWithDuplicates, getMockContext } from '../testData/mockData';
import { SERVICE_ATTRIBUTE } from '../../src/constants';

jest.mock('../../src/data/auroradb.ts');

describe('pages', () => {
    describe('direction', () => {
        beforeEach(() => {
            (getServiceByNocCodeAndLineName as jest.Mock).mockImplementation(() => mockRawService);
            (batchGetStopsByAtcoCode as jest.Mock).mockImplementation(() => [{ localityName: '' }]);
        });

        it('should render correctly', () => {
            const tree = shallow(
                <SingleDirection
                    operator="Connexions Buses"
                    passengerType="Adult"
                    lineName="X6A"
                    service={mockService}
                    error={[]}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('shows operator name above the select box', () => {
            const wrapper = shallow(
                <SingleDirection
                    operator="Connexions Buses"
                    passengerType="Adult"
                    lineName="X6A"
                    service={mockService}
                    error={[]}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            const journeyWelcome = wrapper.find('#direction-operator-linename-passenger-type-hint').first();

            expect(journeyWelcome.text()).toBe('Connexions Buses - X6A - Adult');
        });

        it('shows a list of journey patterns for the service in the select box', () => {
            const wrapper = mount(
                <SingleDirection
                    operator="Connexions Buses"
                    passengerType="Adult"
                    lineName="X6A"
                    service={mockService}
                    error={[]}
                    csrfToken=""
                    pageProps={[]}
                />,
            );

            const serviceJourney = wrapper.find('.journey-option');

            expect(serviceJourney).toHaveLength(2);
            expect(serviceJourney.first().text()).toBe('Estate (Hail and Ride) N/B TO Interchange Stand B');
            expect(serviceJourney.at(1).text()).toBe('Interchange Stand B TO Estate (Hail and Ride) N/B');
        });

        it('returns operator value and list of services when operator cookie exists with NOCCode', async () => {
            (({ ...getServiceByNocCodeAndLineName } as jest.Mock).mockImplementation(() => mockRawService));

            const ctx = getMockContext();

            const result = await getServerSideProps(ctx);

            expect(result.props.service).toEqual(mockService);
        });

        it('removes journeys that have the same start and end points before rendering', async () => {
            (({ ...getServiceByNocCodeAndLineName } as jest.Mock).mockImplementation(
                () => mockRawServiceWithDuplicates,
            ));

            const ctx = getMockContext();

            const result = await getServerSideProps(ctx);
            expect(result.props.service).toEqual(mockService);
        });

        it('throws an error if no journey patterns can be found', async () => {
            (({ ...getServiceByNocCodeAndLineName } as jest.Mock).mockImplementation(() => Promise.resolve(null)));
            const ctx = getMockContext();

            await expect(getServerSideProps(ctx)).rejects.toThrow();
        });

        it('throws an error if noc invalid', async () => {
            const ctx = getMockContext({ cookies: { operator: null } });

            await expect(getServerSideProps(ctx)).rejects.toThrow('invalid NOC set');
        });

        it('throws an error if the service cookie does not exist', async () => {
            const ctx = getMockContext({
                session: {
                    [SERVICE_ATTRIBUTE]: undefined,
                },
            });

            await expect(getServerSideProps(ctx)).rejects.toThrow('Necessary cookies not found to show direction page');
        });
    });
});
