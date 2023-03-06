import * as React from 'react';
import { shallow } from 'enzyme';
import PointToPointPeriodProduct from '../../src/pages/pointToPointPeriodProduct';

describe('pages', () => {
    describe('pointToPointPeriodProduct', () => {
        it('should render correctly on first load', () => {
            const tree = shallow(
                <PointToPointPeriodProduct
                    errors={[]}
                    csrfToken=""
                    product={null}
                    operator="Test Operator"
                    passengerType="Adult"
                    school={false}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly for school ticket', () => {
            const tree = shallow(
                <PointToPointPeriodProduct
                    errors={[]}
                    csrfToken=""
                    product={null}
                    operator="Test Operator"
                    passengerType="Adult"
                    school
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed', () => {
            const tree = shallow(
                <PointToPointPeriodProduct
                    errors={[
                        {
                            errorMessage: 'Product name cannot have less than 2 characters',
                            id: 'point-to-point-period-product-name',
                        },

                        {
                            errorMessage: 'Product duration cannot be empty',
                            id: 'product-details-expiry-quantity',
                        },
                        {
                            errorMessage: 'Select a valid expiry unit',
                            id: 'product-details-expiry-unit',
                        },
                    ]}
                    csrfToken=""
                    product={null}
                    operator="Test Operator"
                    passengerType="Adult"
                    school
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
