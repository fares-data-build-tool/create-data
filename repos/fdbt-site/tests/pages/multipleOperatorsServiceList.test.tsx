import * as React from 'react';
import { shallow } from 'enzyme';
import MultipleOperatorsServiceList, {
    getServerSideProps,
    ServicesInfo,
} from '../../src/pages/multipleOperatorsServiceList';
import { getMockContext } from '../testData/mockData';
import { getServicesByNocCode, ServiceType } from '../../src/data/auroradb';
import { MULTIPLE_OPERATOR_ATTRIBUTE, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE } from '../../src/constants';
import { ErrorInfo } from '../../src/interfaces';

jest.mock('../../src/data/auroradb');

describe('pages', () => {
    describe('multipleOperatorsServiceList', () => {
        const mockServiceList: ServicesInfo[] = [
            {
                lineName: '123',
                startDate: '05/02/2020',
                description: 'IW Bus Service 123',
                serviceCode: 'NW_05_BLAC_123_1',
                checked: false,
            },
            {
                lineName: 'X1',
                startDate: '06/02/2020',
                description: 'Big Blue Bus Service X1',
                serviceCode: 'NW_05_BLAC_X1_1',
                checked: false,
            },
            {
                lineName: 'Infinity Line',
                startDate: '07/02/2020',
                description: 'This is some kind of bus service',
                serviceCode: 'WY_13_IWBT_07_1',
                checked: false,
            },
        ];

        const mockError: ErrorInfo[] = [
            {
                errorMessage: 'Choose at least one service from the list',
                id: 'checkbox-0',
            },
        ];

        const mockServices: ServiceType[] = [
            {
                lineName: '123',
                startDate: '05/02/2020',
                description: 'IW Bus Service 123',
                serviceCode: 'NW_05_BLAC_123_1',
            },
            {
                lineName: 'X1',
                startDate: '06/02/2020',
                description: 'Big Blue Bus Service X1',
                serviceCode: 'NW_05_BLAC_X1_1',
            },
            {
                lineName: 'Infinity Line',
                startDate: '07/02/2020',
                description: 'This is some kind of bus service',
                serviceCode: 'WY_13_IWBT_07_1',
            },
        ];

        beforeEach(() => {
            (getServicesByNocCode as jest.Mock).mockImplementation(() => mockServices);
        });

        it('should render correctly', () => {
            const tree = shallow(
                <MultipleOperatorsServiceList
                    serviceList={mockServiceList}
                    buttonText="Select All"
                    errors={[]}
                    csrfToken=""
                    pageProps={[]}
                    operatorName="Test Operator"
                    nocCode="TO"
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly with errors', () => {
            const tree = shallow(
                <MultipleOperatorsServiceList
                    serviceList={mockServiceList}
                    buttonText="Select All"
                    errors={mockError}
                    csrfToken=""
                    pageProps={[]}
                    operatorName="Test Operator"
                    nocCode="TO"
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            it('should return expected props to the page when the page is first visited by the user', async () => {
                const ctx = getMockContext({
                    session: {
                        [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                            selectedOperators: [
                                { operatorPublicName: 'Test1', nocCode: 'N1' },
                                { operatorPublicName: 'Test2', nocCode: 'N2' },
                                { operatorPublicName: 'Test3', nocCode: 'N3' },
                            ],
                        },
                    },
                });
                const result = await getServerSideProps(ctx);
                const expectedCheckedServiceList: ServicesInfo[] = mockServices.map(mockService => ({
                    ...mockService,
                    checked: false,
                }));
                expect(result.props.errors.length).toBe(0);
                expect(result.props.serviceList).toEqual(expectedCheckedServiceList);
                expect(result.props.buttonText).toEqual('Select All Services');
                expect(result.props.operatorName).toBe('Test1' || 'Test2' || 'Test3');
                expect(result.props.nocCode).toBe('N1' || 'N2' || 'N3');
            });

            it('should return expected props to the page when the page is visited by the user for a second time', async () => {
                const ctx = getMockContext({
                    session: {
                        [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                            selectedOperators: [
                                { operatorPublicName: 'Test1', nocCode: 'N1' },
                                { operatorPublicName: 'Test2', nocCode: 'N2' },
                                { operatorPublicName: 'Test3', nocCode: 'N3' },
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
                const expectedCheckedServiceList: ServicesInfo[] = mockServices.map(mockService => ({
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
                                { operatorPublicName: 'Test1', nocCode: 'N1' },
                                { operatorPublicName: 'Test2', nocCode: 'N2' },
                                { operatorPublicName: 'Test3', nocCode: 'N3' },
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
                const expectedCheckedServiceList: ServicesInfo[] = mockServices.map(mockService => ({
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
                                { operatorPublicName: 'Test1', nocCode: 'N1' },
                                { operatorPublicName: 'Test2', nocCode: 'N2' },
                                { operatorPublicName: 'Test3', nocCode: 'N3' },
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
                const expectedCheckedServiceList: ServicesInfo[] = mockServices.map(mockService => ({
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
                                { operatorPublicName: 'Test1', nocCode: 'N1' },
                                { operatorPublicName: 'Test2', nocCode: 'N2' },
                                { operatorPublicName: 'Test3', nocCode: 'N3' },
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
        });
    });
});
