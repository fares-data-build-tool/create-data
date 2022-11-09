import * as React from 'react';
import { shallow } from 'enzyme';
import MultipleOperatorsServiceList, {
    getServerSideProps,
    showSelectedOperators,
} from '../../src/pages/multipleOperatorsServiceList';
import { getMockContext } from '../testData/mockData';
import * as aurora from '../../src/data/auroradb';
import { ErrorInfo, MultiOperatorInfo } from '../../src/interfaces';
import { MULTIPLE_OPERATOR_ATTRIBUTE } from '../../src/constants/attributes';
import { ServiceWithNocCode } from 'fdbt-types/matchingJsonTypes';

describe('pages', () => {
    describe('multipleOperatorsServiceList', () => {
        const mockError: ErrorInfo[] = [
            {
                errorMessage: 'All operators need to have at least one service',
                id: 'checkbox-0',
            },
        ];

        const mockDataSource = [{ dataSource: 'bods' }];
        const mockBlackServices: ServiceWithNocCode[] = [
            {
                lineName: '1',
                lineId: '4YyoI0',
                startDate: '05/04/2020',
                serviceDescription: 'FLEETWOOD - BLACKPOOL via Promenade',
                origin: 'Ballarat west',
                destination: 'Florinas North',
                serviceCode: 'NW_05_BLAC_1_1',
            },
            {
                lineName: '2',
                lineId: 'YpQjUw',
                startDate: '05/04/2020',
                serviceDescription: 'POULTON - BLACKPOOL via Victoria Hospital Outpatients',
                origin: 'Ballarat East',
                destination: 'Florinas',
                serviceCode: 'NW_05_BLAC_2_1',
            },
        ];
        const mockLNUDServices: ServiceWithNocCode[] = [
            {
                lineName: '259',
                lineId: 'vHaXmz',
                startDate: '25/03/2020',
                serviceDescription: 'Brighouse - East Bierley',
                origin: 'Campora',
                destination: 'Buli',
                serviceCode: 'YWAO259',
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
                        serviceDescription: 'FLEETWOOD - BLACKPOOL via Promenade',
                        origin: 'Ballarat west',
                        destination: 'Florinas North',
                        serviceCode: 'NW_05_BLAC_1_1',
                        selected: false,
                    },
                    {
                        lineName: '2',
                        lineId: 'YpQjUw',
                        startDate: '05/04/2020',
                        serviceDescription: 'POULTON - BLACKPOOL via Victoria Hospital Outpatients',
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
                        serviceDescription: 'Brighouse - East Bierley',
                        origin: 'Campora',
                        destination: 'Buli',
                        serviceCode: 'YWAO259',
                        selected: false,
                    },
                ],
            },
        ];
        const getServicesByNocCodeAndDataSourceAndDescriptionSpy = jest.spyOn(
            aurora,
            'getServicesByNocCodeAndDataSourceAndDescription',
        );

        const getServiceDataSourceSpy: jest.SpyInstance<Promise<object[]>> = jest.spyOn(aurora, 'getServiceDataSource');

        beforeEach(() => {
            getServiceDataSourceSpy.mockImplementation(() => Promise.resolve(mockDataSource));

            getServicesByNocCodeAndDataSourceAndDescriptionSpy.mockImplementationOnce(() =>
                Promise.resolve(mockBlackServices),
            );
            getServicesByNocCodeAndDataSourceAndDescriptionSpy.mockImplementationOnce(() =>
                Promise.resolve(mockLNUDServices),
            );
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
            it('should return expected props to the page when the page is first visited by the user', async () => {
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
                const expectedCheckedServiceList: MultiOperatorInfo[] = mockMultiOperatorData;
                expectedCheckedServiceList[0].open = true;
                const result = await getServerSideProps(ctx);
                expect(result.props.errors.length).toBe(0);
                expect(result.props.preMultiOperatorData).toEqual(mockMultiOperatorData);
            });
        });
        describe('MultipleOperatorsServiceList', () => {
            it('should remove service from  Selected list list', () => {
                const mockActiveOperator: MultiOperatorInfo = mockMultiOperatorData[0];
                const mockSetActiveOperator = jest.fn();
                const mockRemoveServices = jest.fn();
                const mockOperatorsWithSelectedServices = mockMultiOperatorData.map((operatorData) => ({
                    ...operatorData,
                    services: operatorData.services.map(
                        (service) => ({ ...service, selected: true }),
                    ),
                }));
                const expectedLineId = mockMultiOperatorData[0].services[0].lineId;
                const expectedNocCode = mockMultiOperatorData[0].nocCode;

                const wrapper = shallow(
                    showSelectedOperators(
                        mockOperatorsWithSelectedServices,
                        mockActiveOperator,
                        mockSetActiveOperator,
                        mockRemoveServices,
                    ),
                );

                wrapper.find('#remove-from-BLAC-0').simulate('click');
                expect(mockRemoveServices).toBeCalledWith(undefined, expectedLineId, expectedNocCode);
            });
        });
    });
});
