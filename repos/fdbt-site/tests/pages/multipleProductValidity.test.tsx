import { shallow } from 'enzyme';
import React from 'react';
import MultiProductValidity, { getServerSideProps } from '../../src/pages/multipleProductValidity';
import { getMockContext } from '../testData/mockData';
import {
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
    MULTIPLE_PRODUCT_ATTRIBUTE,
    OPERATOR_ATTRIBUTE,
} from '../../src/constants/attributes';

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
                productDurationUnits: 'day',
                productDurationUnitsId: '',
                productValidity: '',
                productValidityId: '',
            },
            {
                productName: 'Day Ticket',
                productNameId: 'multiple-product-name-2',
                productPrice: '2.50',
                productPriceId: 'multiple-product-price-2',
                productDuration: '1',
                productDurationId: 'multiple-product-duration-2',
                productDurationUnits: 'day',
                productDurationUnitsId: '',
                productValidity: '',
                productValidityId: '',
            },
        ];

        it('should render correctly', () => {
            const wrapper = shallow(
                <MultiProductValidity
                    operatorName="Infinity Line"
                    passengerType="Adult"
                    numberOfProducts="2"
                    multipleProducts={multipleProducts}
                    errors={[]}
                    csrfToken=""
                    endTimes={[]}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed', () => {
            const wrapper = shallow(
                <MultiProductValidity
                    operatorName="Infinity Line"
                    passengerType="Adult"
                    numberOfProducts="2"
                    multipleProducts={multipleProducts}
                    errors={[
                        {
                            errorMessage: 'Select one of the two validity options',
                            id: 'twenty-four-hours-row-0',
                        },
                    ]}
                    csrfToken=""
                    endTimes={[]}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('renders dropdown for product validity per product', () => {
            const wrapper = shallow(
                <MultiProductValidity
                    operatorName="Infinity Line"
                    passengerType="Adult"
                    numberOfProducts="2"
                    multipleProducts={multipleProducts}
                    errors={[]}
                    csrfToken=""
                    endTimes={[]}
                />,
            );
            expect(wrapper.find('.govuk-select')).toHaveLength(2);
        });

        it('show the service end time column', () => {
            const wrapper = shallow(
                <MultiProductValidity
                    operatorName="Infinity Line"
                    passengerType="Adult"
                    numberOfProducts="2"
                    multipleProducts={multipleProducts}
                    errors={[]}
                    csrfToken=""
                    endTimes={['validity-option-0']}
                />,
            );
            expect(wrapper.find('.govuk-table__header')).toHaveLength(5);
        });

        it('should call the handleSelection function on change of expiry dropdown value', () => {
            const mockSetState = jest.fn();
            jest.mock('react', () => ({ useState: (initialState: unknown): unknown => [initialState, mockSetState] }));
            const mockChangeEvent = ({
                target: { id: 'validity-option-0' },
                currentTarget: { value: 'endOfServiceDay' },
            } as unknown) as React.ChangeEvent;
            const wrapper = shallow(
                <MultiProductValidity
                    operatorName="Infinity Line"
                    passengerType="Adult"
                    numberOfProducts="2"
                    multipleProducts={multipleProducts}
                    errors={[]}
                    csrfToken=""
                    endTimes={['validity-option-0']}
                />,
            );

            (wrapper.find(`#validity-option-0`).prop('onChange') as Function)(mockChangeEvent);

            const input = wrapper.find('#validity-end-time-0').prop('className');

            expect(input).toEqual(expect.stringContaining('inputVisible'));
        });

        describe('getServerSideProps', () => {
            it('should return number of products to display, name of operator and products if they are set in the session', () => {
                const ctx = getMockContext({
                    session: {
                        [NUMBER_OF_PRODUCTS_ATTRIBUTE]: { numberOfProductsInput: '2' },
                    },
                });
                const result = getServerSideProps(ctx);

                expect(result.props.numberOfProducts).toBe('2');
                expect(result.props.operatorName).toBe('test');
                expect(result.props.multipleProducts[0].productName).toBe('Weekly Ticket');
                expect(result.props.multipleProducts[0].productPrice).toBe('50');
                expect(result.props.multipleProducts[0].productDuration).toBe('5');
                expect(result.props.multipleProducts.length).toBe(3);
            });

            it('should throw an error if the necessary attributes to render the page are not present', () => {
                const ctx = getMockContext({
                    session: {
                        [OPERATOR_ATTRIBUTE]: undefined,
                        [MULTIPLE_PRODUCT_ATTRIBUTE]: undefined,
                    },
                });
                expect(() => getServerSideProps(ctx)).toThrow(
                    'Necessary attributes not found to display the multiple product validity page',
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
                                    productValidityId: 'validity-option-0',
                                },
                                {
                                    productName: 'Super Product',
                                    productPrice: '3',
                                    productDuration: '4',
                                    productValidity: '24hr',
                                },
                            ],
                            errors: [
                                { errorMessage: 'Select one of the three expiry options', id: 'validity-option-0' },
                            ],
                        },
                        [NUMBER_OF_PRODUCTS_ATTRIBUTE]: { numberOfProductsInput: '2' },
                    },
                });

                const result = getServerSideProps(ctx);
                expect(result.props.multipleProducts.length).toBe(2);
                expect(result.props.errors.length).toBe(1);
                expect(result.props.errors[0].errorMessage).toBe('Select one of the three expiry options');
                expect(result.props.errors[0].id).toBe('validity-option-0');
            });
        });
    });
});
