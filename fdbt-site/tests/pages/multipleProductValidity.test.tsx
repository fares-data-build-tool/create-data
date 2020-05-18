import { shallow } from 'enzyme';
import React from 'react';
import MultiProductValidity, { getServerSideProps } from '../../src/pages/multipleProductValidity';
import { getMockContext } from '../testData/mockData';

describe('pages', () => {
    describe('multipleProductValidity', () => {
        const multipleProducts = [
            {
                productName: 'Weekly Ticket',
                productNameId: 'multipleProductName1',
                productPrice: '50',
                productPriceId: 'multipleProductPrice1',
                productDuration: '5',
                productDurationId: 'multipleProductDuration1',
            },
            {
                productName: 'Day Ticket',
                productNameId: 'multipleProductName2',
                productPrice: '2.50',
                productPriceId: 'multipleProductPrice2',
                productDuration: '1',
                productDurationId: 'multipleProductDuration2',
            },
        ];

        it('should render correctly', () => {
            const wrapper = shallow(
                <MultiProductValidity
                    operator="Infinity Line"
                    numberOfProducts="2"
                    multipleProducts={multipleProducts}
                    errors={[]}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed', () => {
            const wrapper = shallow(
                <MultiProductValidity
                    operator="Infinity Line"
                    numberOfProducts="2"
                    multipleProducts={multipleProducts}
                    errors={[
                        {
                            errorMessage: 'Select one of the two validity options',
                            id: 'multiple-product-validity-error',
                        },
                    ]}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('renders 2 radio buttons per product', () => {
            const wrapper = shallow(
                <MultiProductValidity
                    operator="Infinity Line"
                    numberOfProducts="2"
                    multipleProducts={multipleProducts}
                    errors={[]}
                />,
            );
            expect(wrapper.find('.govuk-radios__item')).toHaveLength(4);
        });

        describe('getServerSideProps', () => {
            it('should return number of products to display, name of operator and products if they are set in the cookie', () => {
                const ctx = getMockContext();
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
                    operator: null,
                    numberOfProductsInput: null,
                    multipleProduct: null,
                });
                expect(() => getServerSideProps(ctx)).toThrow(
                    'Necessary cookies not found to display the multiple product validity page',
                );
            });

            it('returns errors in the props if there are validity errors on the product object', () => {
                const ctx = getMockContext({
                    multipleProducts: [
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
