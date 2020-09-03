import { shallow } from 'enzyme';
import React from 'react';
import MultipleProducts, { getServerSideProps } from '../../src/pages/multipleProducts';
import { getMockContext } from '../testData/mockData';
import { NUMBER_OF_PRODUCTS_ATTRIBUTE } from '../../src/constants';

describe('pages', () => {
    describe('multipleProduct', () => {
        it('should render correctly', () => {
            const wrapper = shallow(
                <MultipleProducts
                    numberOfProductsToDisplay="2"
                    operator="Infinity Line"
                    passengerType="Adult"
                    errors={[]}
                    userInput={[]}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            beforeEach(() => {
                jest.clearAllMocks();
            });
            it('should return number of products to display, name of operator and passenger type if there is no cookie set', () => {
                const ctx = getMockContext({
                    cookies: {
                        operator: {
                            operator: {
                                operatorPublicName: 'BLP',
                            },
                            noc: 'TEST',
                        },

                        passengerType: { passengerType: 'Adult' },
                    },
                    session: {
                        [NUMBER_OF_PRODUCTS_ATTRIBUTE]: { numberOfProductsInput: '2' },
                    },
                });
                const result = getServerSideProps(ctx);

                expect(result.props.numberOfProductsToDisplay).toBe('2');
                expect(result.props.operator).toBe('BLP');
                expect(result.props.passengerType).toBe('Adult');
            });

            it('should throw an error if the necessary cookies to render the page are not present', () => {
                const ctx = getMockContext({
                    cookies: {
                        operator: null,
                    },
                    session: {
                        [NUMBER_OF_PRODUCTS_ATTRIBUTE]: undefined,
                    },
                });
                expect(() => getServerSideProps(ctx)).toThrow(
                    'Necessary cookies/session not found to show multiple products page',
                );
            });
        });
    });
});
