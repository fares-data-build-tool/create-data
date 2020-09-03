import { shallow } from 'enzyme';
import React from 'react';
import MultiProductValidity, { getServerSideProps } from '../../src/pages/multipleProductValidity';
import { getMockContext } from '../testData/mockData';
import { NUMBER_OF_PRODUCTS_ATTRIBUTE, MULTIPLE_PRODUCT_ATTRIBUTE } from '../../src/constants';

describe('pages', () => {
    describe('multipleProductValidity', () => {
        const multipleProducts = [
            {
                productName: 'Weekly Ticket',
                productNameId: 'multiple-product-name-1',
                productPrice: '50',
                productPriceId: 'multiple-product-price-1',
                productDuration: '5',
                productDurationId: 'multiple-product-duration-1',
            },
            {
                productName: 'Day Ticket',
                productNameId: 'multiple-product-name-2',
                productPrice: '2.50',
                productPriceId: 'multiple-product-price-2',
                productDuration: '1',
                productDurationId: 'multiple-product-duration-2',
            },
        ];

        it('should render correctly', () => {
            const wrapper = shallow(
                <MultiProductValidity
                    operator="Infinity Line"
                    passengerType="Adult"
                    numberOfProducts="2"
                    multipleProducts={multipleProducts}
                    errors={[]}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed', () => {
            const wrapper = shallow(
                <MultiProductValidity
                    operator="Infinity Line"
                    passengerType="Adult"
                    numberOfProducts="2"
                    multipleProducts={multipleProducts}
                    errors={[
                        {
                            errorMessage: 'Select one of the two validity options',
                            id: 'multiple-product-validity-error',
                        },
                    ]}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('renders 2 radio buttons per product', () => {
            const wrapper = shallow(
                <MultiProductValidity
                    operator="Infinity Line"
                    passengerType="Adult"
                    numberOfProducts="2"
                    multipleProducts={multipleProducts}
                    errors={[]}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(wrapper.find('.govuk-radios__item')).toHaveLength(4);
        });

        describe('getServerSideProps', () => {
            it('should return number of products to display, name of operator and products if they are set in the cookie', () => {
                const ctx = getMockContext({
                    session: {
                        [NUMBER_OF_PRODUCTS_ATTRIBUTE]: { numberOfProductsInput: '2' },
                    },
                });
                const result = getServerSideProps(ctx);

                expect(result.props.numberOfProducts).toBe('2');
                expect(result.props.operator).toBe('test');
                expect(result.props.multipleProducts[0].productName).toBe('Weekly Ticket');
                expect(result.props.multipleProducts[0].productPrice).toBe('50');
                expect(result.props.multipleProducts[0].productDuration).toBe('5');
                expect(result.props.multipleProducts.length).toBe(3);
            });

            it('should throw an error if the necessary cookies to render the page are not present', () => {
                const ctx = getMockContext({
                    cookies: {
                        operator: null,
                        multipleProduct: null,
                    },
                });
                expect(() => getServerSideProps(ctx)).toThrow(
                    'Necessary cookies/session not found to display the multiple product validity page',
                );
            });

            it('returns errors in the props if there are validity errors on the product object', () => {
                const ctx = getMockContext({
                    session: {
                        [MULTIPLE_PRODUCT_ATTRIBUTE]: {
                            products: [
                                {
                                    productName: 'Best Product',
                                    productNameId: 'multipleProductNameInput0',
                                    productPrice: '2',
                                    productPriceId: 'multipleProductPriceInput0',
                                    productDuration: '3',
                                    productDurationId: 'multipleProductDurationInput0',
                                    productValidity: '',
                                    productValidityError: 'Select one of the two validity options',
                                },
                                {
                                    productName: 'Super Product',
                                    productPrice: '3',
                                    productDuration: '4',
                                    productValidity: '24hr',
                                },
                            ],
                        },
                        [NUMBER_OF_PRODUCTS_ATTRIBUTE]: { numberOfProductsInput: '2' },
                    },
                });

                const result = getServerSideProps(ctx);

                expect(result.props.multipleProducts.length).toBe(2);
                expect(result.props.errors.length).toBe(1);
                expect(result.props.errors[0].errorMessage).toBe('Select one of the two validity options');
                expect(result.props.errors[0].id).toBe('multiple-product-validity-radios-error');
            });
        });
    });
});
