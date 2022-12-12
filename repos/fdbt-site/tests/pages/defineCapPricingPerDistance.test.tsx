import * as React from 'react';
import { shallow } from 'enzyme';
import DefineCapPricingPerDistance from '../../src/pages/defineCapPricingPerDistance';

describe('pages', () => {
    describe('defineCapPricingPerDistance', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <DefineCapPricingPerDistance
                    errors={[]}
                    csrfToken=""
                    capPricePerDistances={{ distanceFrom0: '0' }}
                    numberOfCapInitial={1}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed', () => {
            const tree = shallow(
                <DefineCapPricingPerDistance
                    errors={[
                        {
                            id: `distance-to-0`,
                            errorMessage: 'Distance to is required and needs to be number',
                        },
                    ]}
                    csrfToken=""
                    capPricePerDistances={{
                        distanceFrom0: '0',
                        distanceFrom1: '3',
                        distanceTo0: '',
                        maximumPrice: '4',
                        minimumPrice: '3',
                        pricePerKm1: '5',
                        pricePerKm0: '5',
                    }}
                    numberOfCapInitial={2}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
