import * as React from 'react';
import { shallow } from 'enzyme';
import ServiceList, { getServerSideProps } from '../../src/pages/serviceList';
import { getMockContext } from '../testData/mockData';
import { getServicesByNocCodeAndDataSource, getAllServicesByNocCode } from '../../src/data/auroradb';
import { OPERATOR_ATTRIBUTE, SERVICE_LIST_ATTRIBUTE } from '../../src/constants/attributes';
import { ErrorInfo, ServiceType, ServicesInfo } from '../../src/interfaces';

jest.mock('../../src/data/auroradb');

describe('pages', () => {
    describe('serviceList', () => {
        const mockServiceList: ServicesInfo[] = [
            {
                lineName: '123',
                lineId: '3h3vb32ik',
                startDate: '05/02/2020',
                description: 'IW Bus Service 123',
                origin: 'Manchester',
                destination: 'Leeds',
                serviceCode: 'NW_05_BLAC_123_1',
                checked: false,
            },
            {
                lineName: 'X1',
                lineId: '3h3vb32ik',
                startDate: '06/02/2020',
                description: 'Big Blue Bus Service X1',
                origin: 'Edinburgh',
                serviceCode: 'NW_05_BLAC_X1_1',
                checked: false,
            },
            {
                lineName: 'Infinity Line',
                lineId: '3h3vb32ik',
                startDate: '07/02/2020',
                description: 'This is some kind of bus service',
                destination: 'London',
                serviceCode: 'WY_13_IWBT_07_1',
                checked: false,
            },
        ];

        const mockError: ErrorInfo[] = [
            {
                errorMessage: 'Choose at least one service from the list',
                id: 'service-list-error',
            },
        ];

        const mockServices: ServiceType[] = [
            {
                lineName: '123',
                lineId: '3h3vb32ik',
                startDate: '05/02/2020',
                description: 'IW Bus Service 123',
                origin: 'Manchester',
                destination: 'Leeds',
                serviceCode: 'NW_05_BLAC_123_1',
                dataSource: 'tnds',
            },
            {
                lineName: 'X1',
                lineId: '3h3vb32ik',
                startDate: '06/02/2020',
                description: 'Big Blue Bus Service X1',
                origin: 'Edinburgh',
                serviceCode: 'NW_05_BLAC_X1_1',
                dataSource: 'tnds',
            },
            {
                lineName: 'Infinity Line',
                lineId: '3h3vb32ik',
                startDate: '07/02/2020',
                description: 'This is some kind of bus service',
                destination: 'London',
                serviceCode: 'WY_13_IWBT_07_1',
                dataSource: 'tnds',
            },
        ];

        beforeEach(() => {
            (getServicesByNocCodeAndDataSource as jest.Mock).mockImplementation(() => mockServices);
            (getAllServicesByNocCode as jest.Mock).mockImplementation(() => mockServices);
        });

        it('should render correctly with tnds data source', () => {
            const tree = shallow(
                <ServiceList
                    serviceList={mockServiceList}
                    buttonText="Select All"
                    errors={[]}
                    csrfToken=""
                    multiOperator={false}
                    dataSourceAttribute={{
                        source: 'tnds',
                        hasTnds: true,
                        hasBods: false,
                    }}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly with bods data source', () => {
            const tree = shallow(
                <ServiceList
                    serviceList={mockServiceList}
                    buttonText="Select All"
                    errors={[]}
                    csrfToken=""
                    multiOperator={false}
                    dataSourceAttribute={{
                        source: 'bods',
                        hasTnds: true,
                        hasBods: true,
                    }}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly for multiOperator', () => {
            const tree = shallow(
                <ServiceList
                    serviceList={mockServiceList}
                    buttonText="Select All"
                    errors={[]}
                    csrfToken=""
                    multiOperator
                    dataSourceAttribute={{
                        source: 'tnds',
                        hasTnds: true,
                        hasBods: false,
                    }}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render an error when the error flag is set to true', () => {
            const tree = shallow(
                <ServiceList
                    serviceList={[]}
                    errors={mockError}
                    buttonText="Select All"
                    csrfToken=""
                    multiOperator={false}
                    dataSourceAttribute={{
                        source: 'bods',
                        hasTnds: true,
                        hasBods: true,
                    }}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            it('should return expected props to the page when the page is first visited by the user', async () => {
                const ctx = getMockContext({ session: { [SERVICE_LIST_ATTRIBUTE]: null } });
                const result = await getServerSideProps(ctx);
                const expectedCheckedServiceList: ServicesInfo[] = mockServices.map(mockService => ({
                    ...mockService,
                    checked: false,
                }));
                expect(result.props.errors.length).toBe(0);
                expect(result.props.serviceList).toEqual(expectedCheckedServiceList);
                expect(result.props.buttonText).toEqual('Select All Services');
            });

            it('should return props containing errors when the user has previously selected no checkboxes', async () => {
                const ctx = getMockContext({
                    session: {
                        [SERVICE_LIST_ATTRIBUTE]: {
                            errors: mockError,
                        },
                    },
                });
                const result = await getServerSideProps(ctx);
                const expectedCheckedServiceList: ServicesInfo[] = mockServices.map(mockService => ({
                    ...mockService,
                    checked: false,
                }));
                expect(result.props.errors).toEqual(mockError);
                expect(result.props.serviceList).toEqual(expectedCheckedServiceList);
                expect(result.props.buttonText).toEqual('Select All Services');
            });

            it('should throw an error if noc invalid', async () => {
                const ctx = getMockContext({
                    session: { [OPERATOR_ATTRIBUTE]: undefined },
                    body: null,
                    uuid: {},
                    mockWriteHeadFn: jest.fn(),
                    mockEndFn: jest.fn(),
                    isLoggedin: false,
                });
                await expect(getServerSideProps(ctx)).rejects.toThrow('invalid NOC set');
            });
        });
    });
});
