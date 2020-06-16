import * as React from 'react';
import { shallow } from 'enzyme';
import ServiceList, { ServiceListProps, getServerSideProps } from '../../src/pages/serviceList';
import { getMockContext } from '../testData/mockData';
import { getServicesByNocCode, ServiceType } from '../../src/data/auroradb';
import { ServicesInfo } from '../../src/interfaces';

jest.mock('../../src/data/auroradb');

describe('pages', () => {
    const serviceInfoNoError: ServiceListProps = {
        service: {
            selectedServices: [],
        },
        buttonText: 'Select All',
        error: [],
    };

    const serviceInfoWithError: ServiceListProps = {
        service: {
            selectedServices: [],
        },
        buttonText: 'Select All',
        error: [
            {
                errorMessage: 'Choose at least one service from the list',
                id: 'id',
            },
        ],
    };

    const mockServices: ServiceType[] = [
        { lineName: '123', startDate: '05/02/2020', description: 'IW Bus Service 123' },
        { lineName: 'X1', startDate: '06/02/2020', description: 'Big Blue Bus Service X1' },
        { lineName: 'Infinity Line', startDate: '07/02/2020', description: 'This is some kind of bus service' },
    ];

    beforeEach(() => {
        (getServicesByNocCode as jest.Mock).mockImplementation(() => mockServices);
    });

    describe('serviceList', () => {
        it('should render correctly', () => {
            // eslint-disable-next-line react/jsx-props-no-spreading
            const tree = shallow(<ServiceList {...serviceInfoNoError} csrfToken="" pageProps={[]} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render an error when the error flag is set to true', () => {
            // eslint-disable-next-line react/jsx-props-no-spreading
            const tree = shallow(<ServiceList {...serviceInfoWithError} csrfToken="" pageProps={[]} />);
            expect(tree).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            it('should return expected props to the page when the page is first visited by the user', async () => {
                const ctx = getMockContext({ cookies: { selectedServices: null } });
                const result = await getServerSideProps(ctx);
                const expectedCheckedServiceList: ServicesInfo[] = mockServices.map(mockService => {
                    return {
                        ...mockService,
                        serviceDescription: mockService.description,
                        checked: false,
                    };
                });
                expect(result.props.error.length).toBe(0);
                expect(result.props.service.selectedServices).toEqual(expectedCheckedServiceList);
                expect(result.props.buttonText).toEqual('Select All');
            });

            it('should throw an error when necessary cookies missing', async () => {
                const ctx = getMockContext({
                    cookies: { operator: null },
                    body: null,
                    uuid: {},
                    mockWriteHeadFn: jest.fn(),
                    mockEndFn: jest.fn(),
                    isLoggedin: false,
                });
                await expect(getServerSideProps(ctx)).rejects.toThrow(
                    'Necessary cookies not found to show serviceList page',
                );
            });
        });
    });
});
