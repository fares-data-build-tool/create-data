import { shallow } from 'enzyme';
import React from 'react';
import MultipleProducts, { getServerSideProps } from '../../src/pages/multipleProducts';
import { getMockContext } from '../testData/mockData';
import { NUMBER_OF_PRODUCTS_ATTRIBUTE, OPERATOR_ATTRIBUTE } from '../../src/constants/attributes';

describe('pages', () => {
    describe('multipleProduct', () => {
        it('should render correctly', () => {
            const wrapper = shallow(
                <MultipleProducts
                    numberOfProductsToDisplay="2"
                    operatorName="Infinity Line"
                    passengerType="Adult"
                    errors={[]}
                    userInput={[]}
                    csrfToken=""
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            beforeEach(() => {
                jest.clearAllMocks();
            });
            it('should return number of products to display, name of operator and passenger type if there is no attribute set', () => {
                const ctx = getMockContext({
                    session: {
                        [OPERATOR_ATTRIBUTE]: {
                            name: 'BLP',
                            nocCode: 'TEST',
                        },
                        [NUMBER_OF_PRODUCTS_ATTRIBUTE]: { numberOfProductsInput: '2' },
                    },
                });
                const result = getServerSideProps(ctx);

                expect(result.props.numberOfProductsToDisplay).toBe('2');
                expect(result.props.operatorName).toBe('BLP');
                expect(result.props.passengerType).toBe('Adult');
            });

            it('should throw an error if the necessary attributes to render the page are not present', () => {
                const ctx = getMockContext({
                    session: {
                        [NUMBER_OF_PRODUCTS_ATTRIBUTE]: undefined,
                        [OPERATOR_ATTRIBUTE]: undefined,
                    },
                });
                expect(() => getServerSideProps(ctx)).toThrow(
                    'Necessary attributes not found to show multiple products page',
                );
            });
        });
    });
});
