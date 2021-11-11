import { shallow } from 'enzyme';
import * as React from 'react';
import PointToPointProducts, { filterProductsNotToDisplay } from '../../../src/pages/products/pointToPointProducts';

describe('myfares pages', () => {
    describe('pointToPointProducts', () => {
        it('should render correctly when no products against service', () => {
            const tree = shallow(
                <PointToPointProducts
                    service={{
                        id: '01',
                        origin: 'Leeds',
                        destination: 'Manchester',
                        lineId: 'wefawefa',
                        lineName: '1',
                        startDate: '1/1/2021',
                        endDate: '16/9/2021',
                    }}
                    products={[]}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when products present against service and the product requires attention', () => {
            const tree = shallow(
                <PointToPointProducts
                    service={{
                        id: '01',
                        origin: 'Leeds',
                        destination: 'Manchester',
                        lineId: 'wefawefa',
                        lineName: '1',
                        startDate: '1/1/2021',
                        endDate: '16/9/2021',
                    }}
                    products={[
                        {
                            id: 1,
                            productDescription: 'Adult - single',
                            validity: 'Monday, Tuesday',
                            startDate: '05/04/2020',
                            endDate: '10/04/2020',
                            requiresAttention: true,
                        },
                    ]}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when products present against service and the product does not require attention', () => {
            const tree = shallow(
                <PointToPointProducts
                    service={{
                        id: '01',
                        origin: 'Leeds',
                        destination: 'Manchester',
                        lineId: 'wefawefa',
                        lineName: '1',
                        startDate: '1/1/2021',
                        endDate: '16/9/2021',
                    }}
                    products={[
                        {
                            id: 1,
                            productDescription: 'Adult - single',
                            validity: 'Monday, Tuesday',
                            startDate: '05/04/2020',
                            endDate: '10/04/2020',
                            requiresAttention: false,
                        },
                    ]}
                />,
            );

            expect(tree).toMatchSnapshot();
        });
    });

    describe('filterProductsNotToDisplay', () => {
        it('correctly returns the products which should be displayed on the page', () => {
            const result = filterProductsNotToDisplay(
                {
                    id: '01',
                    origin: 'Leeds',
                    destination: 'Manchester',
                    lineId: 'wefawefa',
                    lineName: '1',
                    startDate: '1/1/2021',
                    endDate: '16/9/2021',
                },
                [
                    {
                        id: 1,
                        lineId: 'wefawefa',
                        matchingJsonLink: '/path/to/json',
                        startDate: '05/04/2018',
                        endDate: '10/04/2019',
                        servicesRequiringAttention: [],
                    },
                    {
                        id: 2,
                        lineId: 'wefawefa',
                        matchingJsonLink: '/path/to/json',
                        startDate: '01/01/2021',
                        endDate: '04/04/2021',
                        servicesRequiringAttention: [],
                    },
                    {
                        id: 3,
                        lineId: 'wefawefa',
                        matchingJsonLink: '/path/to/json',
                        startDate: '05/04/2020',
                        endDate: '10/04/2020',
                        servicesRequiringAttention: [],
                    },
                    {
                        id: 4,
                        lineId: 'wefawefa',
                        matchingJsonLink: '/path/to/json',
                        startDate: '05/04/2020',
                        endDate: '10/04/2020',
                        servicesRequiringAttention: [],
                    },
                ],
            );
            expect(result).toEqual([
                {
                    endDate: '04/04/2021',
                    id: 2,
                    lineId: 'wefawefa',
                    matchingJsonLink: '/path/to/json',
                    startDate: '01/01/2021',
                    servicesRequiringAttention: [],
                },
            ]);
        });

        it('correctly returns no products when none fall between the correct dates', () => {
            const result = filterProductsNotToDisplay(
                {
                    id: '01',
                    origin: 'Leeds',
                    destination: 'Manchester',
                    lineId: 'wefawefa',
                    lineName: '1',
                    startDate: '1/1/2021',
                    endDate: '16/9/2021',
                },
                [
                    {
                        id: 1,
                        lineId: 'blah1',
                        matchingJsonLink: '/path/to/json',
                        startDate: '05/04/2012',
                        endDate: '10/04/2012',
                        servicesRequiringAttention: [],
                    },
                    {
                        id: 2,
                        lineId: 'blah2',
                        matchingJsonLink: '/path/to/json',
                        startDate: '01/01/2014',
                        endDate: '04/04/2015',
                        servicesRequiringAttention: [],
                    },
                    {
                        id: 3,
                        lineId: 'blah3',
                        matchingJsonLink: '/path/to/json',
                        startDate: '05/04/2022',
                        endDate: '10/04/2022',
                        servicesRequiringAttention: [],
                    },
                    {
                        id: 4,
                        lineId: 'blah4',
                        matchingJsonLink: '/path/to/json',
                        startDate: '12/12/2021',
                        endDate: '10/04/2023',
                        servicesRequiringAttention: [],
                    },
                ],
            );
            expect(result).toEqual([]);
        });
    });
});
