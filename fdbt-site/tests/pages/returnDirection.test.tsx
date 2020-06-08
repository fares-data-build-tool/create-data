import * as React from 'react';
import { mount, shallow } from 'enzyme';

import { getServiceByNocCodeAndLineName, batchGetStopsByAtcoCode } from '../../src/data/auroradb';
import { getMockContext, mockRawService, mockRawServiceWithDuplicates, mockService } from '../testData/mockData';
import ReturnDirection, { getServerSideProps } from '../../src/pages/returnDirection';

jest.mock('../../src/data/auroradb.ts');

describe('pages', () => {
    describe('selectJourneyDirection', () => {
        beforeEach(() => {
            (getServiceByNocCodeAndLineName as jest.Mock).mockImplementation(() => mockRawService);
            (batchGetStopsByAtcoCode as jest.Mock).mockImplementation(() => [{ localityName: '' }]);
        });

        it('should render correctly', () => {
            const tree = shallow(
                <ReturnDirection service={mockService} errors={[]} inboundJourney="" outboundJourney="" />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('shows a list of journey patterns for the service in each of the select boxes', () => {
            const wrapper = mount(
                <ReturnDirection service={mockService} errors={[]} inboundJourney="" outboundJourney="" />,
            );

            const serviceJourney = wrapper.find('.journey-option');

            expect(serviceJourney).toHaveLength(4);
            expect(serviceJourney.first().text()).toBe('Estate (Hail and Ride) N/B TO Interchange Stand B');
            expect(serviceJourney.at(1).text()).toBe('Interchange Stand B TO Estate (Hail and Ride) N/B');
        });

        it('returns operator value and list of services when operator cookie exists with NOCCode', async () => {
            (({ ...getServiceByNocCodeAndLineName } as jest.Mock).mockImplementation(() => mockRawService));
            const operator = 'TEST';
            const lineName = 'X6A';

            const ctx = getMockContext({ operator, serviceLineName: lineName });

            const result = await getServerSideProps(ctx);

            expect(result).toEqual({
                props: {
                    errors: [],
                    service: mockService,
                },
            });
        });

        it('removes journeys that have the same start and end points before rendering', async () => {
            (({ ...getServiceByNocCodeAndLineName } as jest.Mock).mockImplementation(
                () => mockRawServiceWithDuplicates,
            ));
            const operator = 'TEST';
            const lineName = 'X6A';

            const ctx = getMockContext({ operator, serviceLineName: lineName });

            const result = await getServerSideProps(ctx);

            expect(result).toEqual({
                props: {
                    errors: [],
                    service: mockService,
                },
            });
        });

        it('throws an error if no journey patterns can be found', async () => {
            (({ ...getServiceByNocCodeAndLineName } as jest.Mock).mockImplementation(() => Promise.resolve(null)));
            const ctx = getMockContext();

            await expect(getServerSideProps(ctx)).rejects.toThrow();
        });

        it('throws an error if the operator or service cookies do not exist', async () => {
            const ctx = getMockContext({ operator: null, serviceLineName: null });

            await expect(getServerSideProps(ctx)).rejects.toThrow('Necessary cookies not found to show direction page');
        });
    });
});
