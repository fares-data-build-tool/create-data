import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { getServiceByNocCodeLineNameAndDataSource, batchGetStopsByAtcoCode } from '../../src/data/auroradb';
import { getMockContext, mockRawService, mockRawServiceWithDuplicates, mockService } from '../testData/mockData';
import ReturnDirection, { getServerSideProps } from '../../src/pages/returnDirection';
import { OPERATOR_ATTRIBUTE, SERVICE_ATTRIBUTE, TXC_SOURCE_ATTRIBUTE } from '../../src/constants/attributes';

jest.mock('../../src/data/auroradb.ts');

describe('pages', () => {
    describe('returnDirection', () => {
        const mockErrors = [
            { errorMessage: 'Choose an option for an outbound journey', id: 'outbound-journey' },
            { errorMessage: 'Choose an option for an inbound journey', id: 'inbound-journey' },
        ];

        beforeEach(() => {
            (getServiceByNocCodeLineNameAndDataSource as jest.Mock).mockImplementation(() => mockRawService);
            (batchGetStopsByAtcoCode as jest.Mock).mockImplementation(() => [{ localityName: '' }]);
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        it('should render correctly', () => {
            const tree = shallow(
                <ReturnDirection
                    service={mockService}
                    errors={[]}
                    inboundJourney=""
                    outboundJourney=""
                    csrfToken=""
                    dataSource="bods"
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render errors correctly', () => {
            const tree = shallow(
                <ReturnDirection
                    service={mockService}
                    errors={mockErrors}
                    inboundJourney=""
                    outboundJourney=""
                    csrfToken=""
                    dataSource="bods"
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('shows a list of journey patterns for the service in each of the select boxes', () => {
            const wrapper = mount(
                <ReturnDirection
                    service={mockService}
                    errors={[]}
                    inboundJourney=""
                    outboundJourney=""
                    csrfToken=""
                    dataSource="tnds"
                />,
            );

            const serviceJourney = wrapper.find('.journey-option');

            expect(serviceJourney).toHaveLength(4);
            expect(serviceJourney.first().text()).toBe('Estate (Hail and Ride) N/B - Interchange Stand B');
            expect(serviceJourney.at(1).text()).toBe('Interchange Stand B - Estate (Hail and Ride) N/B');
        });

        describe('getServerSideProps', () => {
            it('returns operator value and list of services when operator attribute exists with NOCCode', async () => {
                (({ ...getServiceByNocCodeLineNameAndDataSource } as jest.Mock).mockImplementation(
                    () => mockRawService,
                ));

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
                        errors: [],
                        service: mockService,
                        csrfToken: '',
                        dataSource: 'bods',
                    },
                });
            });

            it('removes journeys that have the same start and end points before rendering', async () => {
                (({ ...getServiceByNocCodeLineNameAndDataSource } as jest.Mock).mockImplementation(
                    () => mockRawServiceWithDuplicates,
                ));

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
                        errors: [],
                        service: mockService,
                        csrfToken: '',
                        dataSource: 'bods',
                    },
                });
            });

            it('throws an error if no journey patterns can be found', async () => {
                (({ ...getServiceByNocCodeLineNameAndDataSource } as jest.Mock).mockImplementation(() =>
                    Promise.resolve(null),
                ));
                const ctx = getMockContext({
                    session: {
                        [TXC_SOURCE_ATTRIBUTE]: {
                            source: 'bods',
                            hasBods: true,
                            hasTnds: true,
                        },
                    },
                });

                await expect(getServerSideProps(ctx)).rejects.toThrow();
            });

            it('throws an error if the service attribute does not exist', async () => {
                const ctx = getMockContext({
                    session: {
                        [SERVICE_ATTRIBUTE]: undefined,
                        [TXC_SOURCE_ATTRIBUTE]: {
                            source: 'bods',
                            hasBods: true,
                            hasTnds: true,
                        },
                    },
                });

                await expect(getServerSideProps(ctx)).rejects.toThrow(
                    'Necessary attributes not found to show direction page',
                );
            });

            it('throws an error if the noc is invalid', async () => {
                const ctx = getMockContext({
                    session: {
                        [OPERATOR_ATTRIBUTE]: undefined,
                        [TXC_SOURCE_ATTRIBUTE]: {
                            source: 'bods',
                            hasBods: true,
                            hasTnds: true,
                        },
                    },
                });

                await expect(getServerSideProps(ctx)).rejects.toThrow('invalid NOC set');
            });

            it('throws an error if txc source attribute not set', async () => {
                const ctx = getMockContext({
                    session: {
                        [TXC_SOURCE_ATTRIBUTE]: undefined,
                    },
                });

                await expect(getServerSideProps(ctx)).rejects.toThrow("Cannot read property 'source' of undefined");
            });
        });
    });
});
