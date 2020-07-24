import * as React from 'react';
import { shallow } from 'enzyme';
import ProductDetails, { getServerSideProps } from '../../src/pages/productDetails';
import { ProductInfo } from '../../src/interfaces';
import { getMockContext } from '../testData/mockData';

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

            it('should throw an error when the CSV_ZONE_UPLOAD_COOKIE and SERVICE_LIST_COOKIE are missing', () => {
                const ctx = getMockContext({
                    cookies: { fareZoneName: null, selectedServices: null, passengerType: 'Adult' },
                });
                expect(() => getServerSideProps(ctx)).toThrow(
                    'Failed to retrieve zone or service list cookie info for product details page.',
                );
            });

            it('should throw an error when the OPERATOR_COOKIE is missing', () => {
                const ctx = getMockContext({ cookies: { operator: null, selectedServices: null } });
                expect(() => getServerSideProps(ctx)).toThrow(
                    'Failed to retrieve operator cookie info for product details page.',
                );
            });
        });
    });
});
