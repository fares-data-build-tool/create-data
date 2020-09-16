import * as React from 'react';
import { shallow } from 'enzyme';
import ServiceList, { ServicesInfo, getServerSideProps } from '../../src/pages/serviceList';
import { getMockContext } from '../testData/mockData';
import { getServicesByNocCode, ServiceType } from '../../src/data/auroradb';
import { SERVICE_LIST_ATTRIBUTE } from '../../src/constants';
import { ErrorInfo } from '../../src/interfaces';

jest.mock('../../src/data/auroradb');

describe('pages', () => {
    describe('serviceList', () => {
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
                id: 'service-list-error',
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
                <ServiceList
                    serviceList={mockServiceList}
                    buttonText="Select All"
                    errors={[]}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render an error when the error flag is set to true', () => {
            const tree = shallow(
                <ServiceList serviceList={[]} errors={mockError} buttonText="Select All" csrfToken="" pageProps={[]} />,
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
                    cookies: { operator: null },
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
