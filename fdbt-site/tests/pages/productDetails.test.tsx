import * as React from 'react';
import { shallow } from 'enzyme';
import ProductDetails, { getServerSideProps } from '../../src/pages/productDetails';
import { ProductInfo } from '../../src/interfaces';
import { getMockContext } from '../testData/mockData';
import { FARE_ZONE_ATTRIBUTE, SERVICE_LIST_ATTRIBUTE } from '../../src/constants';

const mockproductDetails: ProductInfo = {
    productPrice: '',
    productName: '',
};

describe('pages', () => {
    describe('productDetails', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <ProductDetails
                    product={mockproductDetails}
                    operator="bus company"
                    passengerType="Adult"
                    hintText="Test Zone"
                    csrfToken=""
                    pageProps={[]}
                    errors={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            it('should return expected props to the page when the page is first visited by the user', () => {
                const ctx = getMockContext({ cookies: { productName: null, productPrice: null, fareZoneName: null } });
                const result = getServerSideProps(ctx);

                expect(result.props.operator).toBe('test');
                expect(result.props.passengerType).toBe('Adult');
                expect(result.props.hintText).toBe('Multiple Services');
            });

            it('should throw an error when the FARE_ZONE_ATTRIBUTE and SERVICE_LIST_ATTRIBUTE are missing', () => {
                const ctx = getMockContext({
                    cookies: { passengerType: 'Adult' },
                    session: {
                        [SERVICE_LIST_ATTRIBUTE]: null,
                    },
                });
                expect(() => getServerSideProps(ctx)).toThrow(
                    'Failed to retrieve the necessary cookies and/or session objects.',
                );
            });

            it('should throw an error when the OPERATOR_COOKIE is missing', () => {
                const ctx = getMockContext({
                    cookies: { operator: null },
                    session: {
                        [FARE_ZONE_ATTRIBUTE]: 'Green Park Shops',
                    },
                });
                expect(() => getServerSideProps(ctx)).toThrow(
                    'Failed to retrieve the necessary cookies and/or session objects.',
                );
            });
        });
    });
});
