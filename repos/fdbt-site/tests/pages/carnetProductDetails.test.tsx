import * as React from 'react';
import { shallow } from 'enzyme';
import CarnetProductDetails, { getServerSideProps } from '../../src/pages/carnetProductDetails';
import { ExpiryUnit, PointToPointProductInfo } from '../../src/interfaces';
import { getMockContext } from '../testData/mockData';
import { FARE_ZONE_ATTRIBUTE, OPERATOR_ATTRIBUTE, PASSENGER_TYPE_ATTRIBUTE } from '../../src/constants/attributes';

const mockProductDetails: PointToPointProductInfo = {
    productName: '',
    carnetDetails: {
        quantity: '5',
        expiryTime: '2',
        expiryUnit: ExpiryUnit.DAY,
    },
};

describe('pages', () => {
    describe('carnetProductDetails', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <CarnetProductDetails product={mockProductDetails} hintText="Test Hint" csrfToken="" errors={[]} />,
            );
            expect(tree).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            it('should return expected props to the page when the page is first visited by the user', () => {
                const ctx = getMockContext();
                const result = getServerSideProps(ctx);

                expect(result.props.hintText).toBe('test - Adult Carnet Single');
            });

            it('should throw an error when the PASSENGER_TYPE_ATTRIBUTE is missing', () => {
                const ctx = getMockContext({
                    session: {
                        [PASSENGER_TYPE_ATTRIBUTE]: undefined,
                    },
                });
                expect(() => getServerSideProps(ctx)).toThrow(
                    'Failed to retrieve passenger type attribute for product details page',
                );
            });

            it('should throw an error when the OPERATOR_ATTRIBUTE is missing', () => {
                const ctx = getMockContext({
                    session: {
                        [OPERATOR_ATTRIBUTE]: undefined,
                        [FARE_ZONE_ATTRIBUTE]: 'Green Park Shops',
                    },
                });
                expect(() => getServerSideProps(ctx)).toThrow('Failed to retrieve the necessary session objects');
            });
        });
    });
});
