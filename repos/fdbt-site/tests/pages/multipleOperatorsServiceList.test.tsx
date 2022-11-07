import * as React from 'react';
import { shallow } from 'enzyme';
import MultipleOperatorsServiceList, { getServerSideProps } from '../../src/pages/multipleOperatorsServiceList';
import { getMockContext } from '../testData/mockData';
import * as aurora from '../../src/data/auroradb';
import * as sessions from '../../src/utils/sessions';
import { ErrorInfo, MultiOperatorInfo, MultipleOperatorsAttribute, ServicesInfo } from '../../src/interfaces';
import {
    MULTIPLE_OPERATOR_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
    MULTI_OP_TXC_SOURCE_ATTRIBUTE,
} from '../../src/constants/attributes';
import { SelectedService, SelectedServiceWithNocCode } from 'fdbt-types/matchingJsonTypes';

describe('pages', () => {
    describe('multipleOperatorsServiceList', () => {
        const mockServiceList: SelectedService[] = [
            {
                lineName: '123',
                lineId: '3h3vb32ik23',
                startDate: '05/02/2020',
                description: 'IW Bus Service 123',
                serviceCode: 'NW_05_BLAC_123_1',
                selected: false,
            },
            {
                lineName: 'X1',
                lineId: '3h3vb32ik24',
                startDate: '06/02/2020',
                description: 'Big Blue Bus Service X1',
                serviceCode: 'NW_05_BLAC_X1_1',
                selected: false,
            },
            {
                lineName: 'Infinity Line',
                lineId: '3h3vb32ik25',
                startDate: '07/02/2020',
                description: 'This is some kind of bus service',
                serviceCode: 'WY_13_IWBT_07_1',
                selected: false,
            },
        ];

        const mockError: ErrorInfo[] = [
            {
                errorMessage: 'All operators need to have at least one service',
                id: 'checkbox-0',
            },
        ];

        const mockServices: SelectedServiceWithNocCode[] = [
            {
                lineName: '123',
                nocCode: 'BLAC',
                lineId: '3h3vb32ik',
                startDate: '05/02/2020',
                description: 'IW Bus Service 123',
                serviceCode: 'NW_05_BLAC_123_1',
                origin: 'Manchester',
                destination: 'Leeds',
            },
            {
                nocCode: 'BLAC',
                lineName: 'X1',
                lineId: '3h3vb32ik',
                startDate: '06/02/2020',
                description: 'Big Blue Bus Service X1',
                serviceCode: 'NW_05_BLAC_X1_1',
                origin: 'Bolton',
                destination: 'Wigan',
            },
            {
                nocCode: 'LNUD',
                lineName: 'Infinity Line',
                lineId: '3h3vb32ik',
                startDate: '07/02/2020',
                description: 'This is some kind of bus service',
                serviceCode: 'WY_13_IWBT_07_1',
                origin: 'Manchester',
                destination: 'York',
            },
        ];
        const mockDataSource = [{ dataSource: 'bods' }];
        const mockSearchOperator = {
            selectedOperators: [
                { name: 'company name1', nocCode: 'BLAC' },
                { name: 'company name2', nocCode: 'LNUD' },
            ],
        };
        const mockBlackServices: SelectedServiceWithNocCode[] = [
            {
                lineName: '1',
                lineId: '4YyoI0',
                startDate: '05/04/2020',
                description: 'FLEETWOOD - BLACKPOOL via Promenade',
                origin: 'Ballarat west',
                destination: 'Florinas North',
                serviceCode: 'NW_05_BLAC_1_1',
            },
            {
                lineName: '2',
                lineId: 'YpQjUw',
                startDate: '05/04/2020',
                description: 'POULTON - BLACKPOOL via Victoria Hospital Outpatients',
                origin: 'Ballarat East',
                destination: 'Florinas',
                serviceCode: 'NW_05_BLAC_2_1',
            },
        ];
        const mockLNUDServices: SelectedServiceWithNocCode[] = [
            {
                lineName: '259',
                lineId: 'vHaXmz',
                startDate: '25/03/2020',
                description: 'Brighouse - East Bierley',
                origin: 'Campora',
                destination: 'Buli',
                serviceCode: 'YWAO259',
                selected: false,
            },
        ];
        const mockMultiOperatorData: MultiOperatorInfo[] = [
            {
                nocCode: 'BLAC',
                name: 'Blackpool Transport',
                dataSource: 'bods',
                services: [
                    {
                        lineName: '1',
                        lineId: '4YyoI0',
                        startDate: '05/04/2020',
                        description: 'FLEETWOOD - BLACKPOOL via Promenade',
                        origin: 'Ballarat west',
                        destination: 'Florinas North',
                        serviceCode: 'NW_05_BLAC_1_1',
                        selected: false,
                    },
                    {
                        lineName: '2',
                        lineId: 'YpQjUw',
                        startDate: '05/04/2020',
                        description: 'POULTON - BLACKPOOL via Victoria Hospital Outpatients',
                        origin: 'Ballarat East',
                        destination: 'Florinas',
                        serviceCode: 'NW_05_BLAC_2_1',
                        selected: false,
                    },
                ],
            },
            {
                nocCode: 'LNUD',
                name: 'Testing ops',
                dataSource: 'bods',
                services: [
                    {
                        lineName: '259',
                        lineId: 'vHaXmz',
                        startDate: '25/03/2020',
                        description: 'Brighouse - East Bierley',
                        origin: 'Campora',
                        destination: 'Buli',
                        serviceCode: 'YWAO259',
                        selected: false,
                    },
                ],
            },
        ];
        const getServicesByNocCodeAndDataSourceSpy: jest.SpyInstance<Promise<SelectedServiceWithNocCode[]>> =
            jest.spyOn(aurora, 'getServicesByNocCodeAndDataSource');

        const geServiceDataSourceSpy: jest.SpyInstance<Promise<object[]>> = jest.spyOn(aurora, 'geServiceDataSource');
        // const getSessionAttributeSpy: jest.SpyInstance<MultipleOperatorsAttribute> = jest.spyOn(
        //     sessions,
        //     'getSessionAttribute',
        // ) as jest.SpyInstance<MultipleOperatorsAttribute>;

        beforeEach(() => {
            getServicesByNocCodeAndDataSourceSpy.mockImplementation(() => Promise.resolve(mockServices));
            geServiceDataSourceSpy.mockImplementation(() => Promise.resolve(mockDataSource));

            // getServicesByNocCodeAndDataSourceSpy.mockImplementation(() => Promise.resolve(mockBlackServices));
            getServicesByNocCodeAndDataSourceSpy.mockImplementationOnce(() => Promise.resolve(mockBlackServices));
            getServicesByNocCodeAndDataSourceSpy.mockImplementationOnce(() => Promise.resolve(mockLNUDServices));
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        it('should render correctly multiOperatorData', () => {
            const tree = shallow(
                <MultipleOperatorsServiceList preMultiOperatorData={mockMultiOperatorData} errors={[]} csrfToken="" />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly with errors', () => {
            const tree = shallow(
                <MultipleOperatorsServiceList
                    preMultiOperatorData={mockMultiOperatorData}
                    errors={mockError}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            it.only('should return expected props to the page when the page is first visited by the user', async () => {
                const ctx = getMockContext({
                    session: {
                        [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                            selectedOperators: [
                                { nocCode: 'BLAC', name: 'Blackpool Transport' },
                                { nocCode: 'LNUD', name: 'Testing ops' },
                            ],
                        },
                    },
                });
                const expectedCheckedServiceList: MultiOperatorInfo[] = mockMultiOperatorData.map(
                    (mocOperatorData) => ({
                        ...mocOperatorData,
                    }),
                );
                expectedCheckedServiceList[0].open = true;
                const result = await getServerSideProps(ctx);
                expect(result.props.errors.length).toBe(0);
                expect(result.props.preMultiOperatorData).toEqual(expectedCheckedServiceList);
            });

            it('should return expected props to the page when the page is visited by the user for a second time', async () => {
                const ctx = getMockContext({
                    session: {
                        [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                            selectedOperators: [
                                { name: 'Test1', nocCode: 'N1' },
                                { name: 'Test2', nocCode: 'N2' },
                                { name: 'Test3', nocCode: 'N3' },
                            ],
                        },
                        [MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE]: [
                            {
                                nocCode: 'N1',
                                services: ['service one', 'service two'],
                            },
                        ],
                    },
                });
                const result = await getServerSideProps(ctx);
                const expectedCheckedServiceList: ServicesInfo[] = mockServices.map((mockService) => ({
                    ...mockService,
                    checked: false,
                }));
                expect(result.props.errors.length).toBe(0);
                expect(result.props.serviceList).toEqual(expectedCheckedServiceList);
                expect(result.props.buttonText).toEqual('Select All Services');
                expect(result.props.operatorName).toBe('Test2' || 'Test3');
                expect(result.props.nocCode).toBe('N2' || 'N3');
            });

            it('should return expected props to the page when the page is visited by the user for the third time', async () => {
                const ctx = getMockContext({
                    session: {
                        [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                            selectedOperators: [
                                { name: 'Test1', nocCode: 'N1' },
                                { name: 'Test2', nocCode: 'N2' },
                                { name: 'Test3', nocCode: 'N3' },
                            ],
                        },
                        [MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE]: [
                            {
                                nocCode: 'N1',
                                services: ['service one', 'service two'],
                            },
                            {
                                nocCode: 'N2',
                                services: ['service one', 'service two'],
                            },
                        ],
                    },
                });
                const result = await getServerSideProps(ctx);
                const expectedCheckedServiceList: ServicesInfo[] = mockServices.map((mockService) => ({
                    ...mockService,
                    checked: false,
                }));
                expect(result.props.errors.length).toBe(0);
                expect(result.props.serviceList).toEqual(expectedCheckedServiceList);
                expect(result.props.buttonText).toEqual('Select All Services');
                expect(result.props.operatorName).toBe('Test3');
                expect(result.props.nocCode).toBe('N3');
            });

            it('should return expected props to the page when the page is visited by the user for the fourth time having finished all their operators', async () => {
                const ctx = getMockContext({
                    session: {
                        [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                            selectedOperators: [
                                { name: 'Test1', nocCode: 'N1' },
                                { name: 'Test2', nocCode: 'N2' },
                                { name: 'Test3', nocCode: 'N3' },
                            ],
                        },
                        [MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE]: [
                            {
                                nocCode: 'N1',
                                services: ['service one', 'service two'],
                            },
                            {
                                nocCode: 'N2',
                                services: ['service one', 'service two'],
                            },
                            {
                                nocCode: 'N3',
                                services: ['service one', 'service two'],
                            },
                        ],
                    },
                });
                const result = await getServerSideProps(ctx);
                const expectedCheckedServiceList: ServicesInfo[] = mockServices.map((mockService) => ({
                    ...mockService,
                    checked: false,
                }));
                expect(result.props.errors.length).toBe(0);
                expect(result.props.serviceList).toEqual(expectedCheckedServiceList);
                expect(result.props.buttonText).toEqual('Select All Services');
                expect(result.props.operatorName).toBe('Test1' || 'Test2' || 'Test3');
                expect(result.props.nocCode).toBe('N1' || 'N2' || 'N3');
            });

            it('should return expected props to the page when the page is visited by the user with errors on the session attribute', async () => {
                const ctx = getMockContext({
                    session: {
                        [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                            selectedOperators: [
                                { name: 'Test1', nocCode: 'N1' },
                                { name: 'Test2', nocCode: 'N2' },
                                { name: 'Test3', nocCode: 'N3' },
                            ],
                        },
                        [MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE]: {
                            multiOperatorInfo: [
                                {
                                    nocCode: 'N1',
                                    services: ['service one', 'service two'],
                                },
                            ],
                            errors: mockError,
                        },
                    },
                });
                const result = await getServerSideProps(ctx);
                expect(result.props.errors).toStrictEqual(mockError);
            });

            it('should create a multi op TXC attribute according to whether the chosen operators NOC has services', async () => {
                const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
                const ctx = getMockContext({
                    session: {
                        [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                            selectedOperators: [
                                { name: 'Test1', nocCode: 'N1' },
                                { name: 'Test2', nocCode: 'N2' },
                                { name: 'Test3', nocCode: 'N3' },
                            ],
                        },
                    },
                });
                await getServerSideProps(ctx);
                expect(updateSessionAttributeSpy).toBeCalledWith(ctx.req, MULTI_OP_TXC_SOURCE_ATTRIBUTE, {
                    source: 'tnds',
                    hasBods: false,
                    hasTnds: false,
                });
            });
        });
    });
});
