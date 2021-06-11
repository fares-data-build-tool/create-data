import { shallow } from 'enzyme';
import React from 'react';
import MultipleProducts, { getServerSideProps } from '../../src/pages/multipleProducts';
import { getMockContext } from '../testData/mockData';
import {
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
    CARNET_FARE_TYPE_ATTRIBUTE,
} from '../../src/constants/attributes';

describe('pages', () => {
    describe('multipleProduct', () => {
        it('should render correctly for a non flat fare non carnet', () => {
            const wrapper = shallow(
                <MultipleProducts
                    numberOfProductsToRender={1}
                    errors={[]}
                    userInput={[]}
                    csrfToken=""
                    flatFare={false}
                    carnet={false}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should render correctly for a flat fare non carnet', () => {
            const wrapper = shallow(
                <MultipleProducts
                    numberOfProductsToRender={1}
                    errors={[]}
                    userInput={[]}
                    csrfToken=""
                    flatFare
                    carnet={false}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should render correctly for a flat fare carnet', () => {
            const wrapper = shallow(
                <MultipleProducts
                    numberOfProductsToRender={1}
                    errors={[]}
                    userInput={[]}
                    csrfToken=""
                    flatFare
                    carnet
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should render correctly for a period carnet', () => {
            const wrapper = shallow(
                <MultipleProducts
                    numberOfProductsToRender={1}
                    errors={[]}
                    userInput={[]}
                    csrfToken=""
                    flatFare={false}
                    carnet
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should render correctly for 5 products', () => {
            const wrapper = shallow(
                <MultipleProducts
                    numberOfProductsToRender={5}
                    errors={[]}
                    userInput={[]}
                    csrfToken=""
                    flatFare
                    carnet
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            beforeEach(() => {
                jest.clearAllMocks();
            });
            it('should return number of products to render, whether the ticket is flat fare, and whether the ticket is carnet', () => {
                const ctx = getMockContext({
                    session: {
                        [FARE_TYPE_ATTRIBUTE]: {
                            fareType: 'flatFare',
                        },
                        [CARNET_FARE_TYPE_ATTRIBUTE]: true,
                        [NUMBER_OF_PRODUCTS_ATTRIBUTE]: 2,
                    },
                });
                const result = getServerSideProps(ctx);

                expect(result.props.numberOfProductsToRender).toBe(2);
                expect(result.props.carnet).toBe(true);
                expect(result.props.flatFare).toBe(true);
            });

            it('should throw an error if the necessary attributes to render the page are not present', () => {
                const ctx = getMockContext({
                    session: {
                        [FARE_TYPE_ATTRIBUTE]: undefined,
                    },
                });
                expect(() => getServerSideProps(ctx)).toThrow(
                    'Faretype attribute not found, could not ascertain fareType.',
                );
            });
        });
    });
});
